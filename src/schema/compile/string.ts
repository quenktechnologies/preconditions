import { just } from '@quenk/noni/lib/data/maybe';
import { Record, mapTo, merge } from '@quenk/noni/lib/data/record';
import { empty } from '@quenk/noni/lib/data/array';
import { Type } from '@quenk/noni/lib/data/type';

import { parse } from '../parse';
import { Context, visit } from '.';
import { Schema } from '..';

/**
 * Code output.
 */
export type Code = string;

/**
 * Options for the compile() function.
 */
export interface Options extends Context<Code> {
    /**
     * reduce a list of Code output into a single Code.
     *
     * This is used for the `properties` section of the object schema and can
     * be specified to determine which precondition to use to combine them.
     */
    reduce?: (precs: Code[]) => Code;
}

/**
 * compile a schema into a string.
 *
 * This function produces a string that can be used for code generation from
 * templates.
 */
export const compile = (opts: Partial<Options>, schema: Schema) => {
    let ctx = defaults(opts);
    return parse<Code>({ visit: node => visit(ctx, node), get }, schema);
};

const defaults = (opts: Partial<Options>) => {
    let wrap = opts.reduce || 'object.restrict';
    return merge(
        {
            identity: () => 'base.identity',

            and: (left: Code, right: Code) => `base.and(${left},${right})`,

            or: (left: Code, right: Code) => `base.or(${left},${right})`,

            properties: (props: Record<Code>) => {
                let out = mapTo(props, (code, key) => `${key} : ${code}`);
                return `${wrap}({${out.join(',')}})`;
            },

            additionalProperties: (prec: Code) => `object.map(${prec})`,

            items: (prec: Code) => `array.map(${prec})`
        },
        opts
    );
};

const get = (path: string, args: Type[]) =>
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
