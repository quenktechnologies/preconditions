import { just } from '@quenk/noni/lib/data/maybe';
import { Record, mapTo, merge } from '@quenk/noni/lib/data/record';
import { empty } from '@quenk/noni/lib/data/array';
import { Type } from '@quenk/noni/lib/data/type';

import { parse } from '../parse';
import { BaseOptions, CompileContext } from '.';
import { Schema } from '..';

/**
 * Code output.
 */
export type Code = string;

export interface Options extends BaseOptions {
    /**
     * async if true, changes the default options to be suitable for generating
     * an async precondition.
     *
     * Builtins are disabled and the default key name is changed to
     * "asyncPreconditions". For function compilation, the async functions are
     * used instead of the regular ones. Defaults to false.
     */
    async: boolean;
}

/**
 * StringContext is used for compilation of a schema to a synchronous
 * precondition string of code.
 */
export class StringContext extends CompileContext<Code> {
    identity = 'base.identity';

    optional = (code: Code) => `base.optional(${code})`;

    and = (left: Code, right: Code) => `base.and(${left},${right})`;

    or = (left: Code, right: Code) => `base.or(${left},${right})`;

    properties = (props: Record<Code>) => {
        let out = mapTo(props, (code, key) => `${key} : ${code}`);
        return `object.${this.options.propMode}({${out.join(',')}})`;
    };

    additionalProperties = (prec: Code) => `object.map(${prec})`;

    items = (prec: Code) => `array.map(${prec})`;

    get = (path: string, args: Type[]) =>
        just(
            empty(args)
                ? path
                : [
                      path,
                      '(',
                      args.map(val => JSON.stringify(val)).join(','),
                      ')'
                  ].join('')
        );
}

const defaultOptions = (opts: Partial<Options>) =>
    merge(
        opts.async
            ? {
                  key: 'asyncPreconditions',
                  propMode: 'restrict',
                  builtins: false
              }
            : {
                  key: 'preconditions',
                  propMode: 'restrict',
                  builtins: true
              },
        opts
    );

/**
 * compile a schema into a string.
 *
 * This function produces a string that can be used for code generation from
 * templates.
 */
export const compile = (opts: Partial<Options>, schema: Schema) =>
    parse<Code>(new StringContext(defaultOptions(opts)), schema);
