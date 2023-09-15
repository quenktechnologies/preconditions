import { Record, empty as isEmpty } from '@quenk/noni/lib/data/record';
import { empty } from '@quenk/noni/lib/data/array';

import { Node, PrimNode, ArrayNode, ObjectNode } from '../parse';

/**
 * Context is used to retrieve preconditions used in combining one or more
 * precondition into a larger set.
 */
export interface Context<T> {
    /**
     * identity provides a precondition that always succeeds with its value.
     */
    identity: T;

    /**
     * optional wraps a precondition in an optional precondition wrapper to
     * prevent execution if a value is not specified.
     */
    optional: (prec: T) => T;

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
     * additionalProperties wraps a precondition so it can be used on the
     * encountered properties of an object.
     */
    additionalProperties: (prec: T) => T;

    /**
     * items given a precondition, produces a precondition that will apply it
     * to each element of an array.
     *
     * Note: The resulting precondition should ensure the value passed is an
     * array first.
     */
    items: (prec: T) => T;
}

/**
 * visit implementation for the parser.
 *
 * @internal
 */
export const visit = <T>(ctx: Context<T>, node: Node<T>): T => {
    let result;
    if (node[0] === 'object') result = object(ctx, node);
    else if (node[0] === 'array') result = array(ctx, node);
    else result = prim(ctx, node);

    return node[2] === true ? ctx.optional(result) : result;
};

const object = <T>(ctx: Context<T>, node: ObjectNode<T>) => {
    let [, [builtins, rec, addProps, precs = []]] = node;

    let builtinPrecs;

    if (!empty(builtins)) builtinPrecs = combine(ctx, builtins);

    let props;

    if (!isEmpty(rec)) props = ctx.properties(rec);

    if (addProps) {
        let prec = ctx.additionalProperties(addProps);
        props = props ? ctx.or(props, prec) : prec;
    }

    let result;

    if (builtinPrecs && props) {
        result = ctx.and(builtinPrecs, props);
    } else if (builtinPrecs) {
        result = builtinPrecs;
    } else if (props) {
        result = props;
    }

    if (!empty(precs)) {
        let prec = combine(ctx, precs);
        result = result ? ctx.and(result, prec) : prec;
    }

    return result ? result : ctx.identity;
};

const array = <T>(ctx: Context<T>, node: ArrayNode<T>) => {
    let [, [builtins, items, precs = []]] = node;
    let result = ctx.items(items);

    if (!empty(builtins)) result = ctx.and(combine(ctx, builtins), result);

    if (!empty(precs)) result = ctx.and(result, combine(ctx, precs));

    return result;
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
