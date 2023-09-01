import { just } from '@quenk/noni/lib/data/maybe';
import { Record, mapTo, merge } from '@quenk/noni/lib/data/record';
import { empty } from '@quenk/noni/lib/data/array';
import { Type } from '@quenk/noni/lib/data/type';

import { Context, visit } from '.';
import { Schema } from '..';
import { parse } from '../parse';

/**
 * Code output.
 */
export type Code = string;

export interface Options {
    update?: boolean;

    context?: Partial<Context<Code>>;
}

export const compile = (opts: Options, schema: Schema) => {
    let ctx = merge(defaults(opts.update), opts.context || {});
    return parse<Code>({ visit: node => visit(ctx, node), get }, schema);
};

const defaults = (update?: boolean) => ({
    and: (left: Code, right: Code) => `base.and(${left}, ${right})`,

    or: (left: Code, right: Code) => `base.or(${left},${right})`,

    properties: (props: Record<Code>) => {
        let out = mapTo(props, (code, key) => `${key} : ${code}`);
        let meth = update ? 'object.intersect' : 'object.restrict';
        return `${meth}({${out.join(',')}})`;
    },

    items: (prec: Code) => `array.map(${prec})`
});

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
