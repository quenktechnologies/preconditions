import { Record, empty as isEmpty } from '@quenk/noni/lib/data/record';
import { empty } from '@quenk/noni/lib/data/array';

import { Node, PrimNode, ArrayNode, ObjectNode } from '../parse';

/**
 * Context is used to retrieve preconditions used in combining one or more
 * precondition into a larger set.
 */
export interface Context<T> {
    /**
     * and joins to preconditions via logical and operation.
     */
    and: (left: T, right: T) => T;

    /**
     * or joins to preconditions via a logical or operation.
     */
    or: (left: T, right: T) => T;

    /**
     * properties combines the preconditions of an object's properties into
     * one precondition.
     *
     * This precondition must handle record/object types.
     */
    properties: (props: Record<T>) => T;

    /**
     * items produces a precondition from a precondition that can be applied to
     * each item of an array.
     */
    items: (prec: T) => T;
}

/**
 * visit implementation for the parser.
 *
 * @internal
 */
export const visit = <T>(ctx: Context<T>, node: Node<T>): T => {
    if (node[0] === 'object') return object(ctx, node);
    else if (node[0] === 'array') return array(ctx, node);
    else return prim(ctx, node);
};

const object = <T>(ctx: Context<T>, node: ObjectNode<T>) => {
    let [, [rec, addProps, self]] = node;
    let props;

    if (!isEmpty(rec)) props = ctx.properties(rec);

    if (addProps) {
        if (props) props = ctx.or(props, addProps);
        else props = addProps;
    }

    if (self) props = ctx.and(<T>props, combine(ctx, self));

    return <T>props;
};

const array = <T>(ctx: Context<T>, node: ArrayNode<T>) => {
    let [, [items, precs = []]] = node;
    let result = ctx.items(items);

    if (empty(precs)) return result;

    return ctx.and(result, combine(ctx, precs));
};

const prim = <T>(ctx: Context<T>, [, precs]: PrimNode<T>) =>
    combine(ctx, precs);

const combine = <T>(ctx: Context<T>, precs: T[]) => {
    let [prec] = precs;
    for (let i = 1; i < precs.length; i++) {
        prec = ctx.and(prec, precs[i]);
    }
    return prec;
};
