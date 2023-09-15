import * as base from '../../';
import * as object from '../../record';
import * as array from '../../array';
import * as string from '../../string';
import * as boolean from '../../boolean';
import * as number from '../../number';

import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Record, merge3, rmerge } from '@quenk/noni/lib/data/record';
import { get as _get } from '@quenk/noni/lib/data/record/path';
import { Value } from '@quenk/noni/lib/data/jsonx';
import { Type } from '@quenk/noni/lib/data/type';

import { parse, Path } from '../parse';
import { Context, visit } from '.';
import { Schema } from '..';

/**
 * Precondition specialized to jsonx values.
 */
export type Precondition = base.Precondition<Value, Value>;

/**
 * Preconditions specialised to jsonx values.
 */
export type Preconditions = base.Preconditions<Value, Value>;

/**
 * Options for the compile() function.
 */
export interface Options extends Context<Precondition> {
    available: PreconditionsAvailable;
}

/**
 * Provider provides a precondition given some arguments.
 */
export type Provider = (...args: Type[]) => Precondition;

/**
 * PreconditionsAvailable is a namespaced map or a map of providers.
 */
export interface PreconditionsAvailable extends Record<Record<Provider>> {}

/**
 * @internal
 */
export const defaultAvailables: PreconditionsAvailable = {
    base: {
        identity: () => base.identity,
        and: base.and,
        or: base.or,
        type: base.typeOf,
        const: base.constant,
        equal: base.eq,
        notEqual: base.neq,
        notNull: () => base.notNull,
        optional: base.optional,
        default: base.defaultValue,
        discard: () => base.discard,
        reject: base.reject,
        every: base.every,
        enum: base.exists,
        log: () => base.log
    },
    object: {
        restrict: <Provider>object.restrict,
        intersect: <Provider>object.intersect,
        disjoint: <Provider>object.disjoint,
        union: <Provider>object.union,
        map: <Provider>object.map
    },
    array: {
        nonEmpty: () => <Precondition>array.nonEmpty,
        minItems: <Provider>array.minItems,
        maxItems: <Provider>array.maxItems,
        filter: <Provider>array.filter,
        map: <Provider>array.map,
        tuple: <Provider>array.tuple
    },
    string: {
        cast: () => string.toString,
        minLength: <Provider>string.minLength,
        maxLength: <Provider>string.maxLength,
        pattern: <Provider>string.matches,
        lowerCase: () => <Precondition>string.lowercase,
        upperCase: () => <Precondition>string.uppercase,
        trim: () => <Precondition>string.trim,
        split: <Provider>string.split,
        nonEmpty: () => <Precondition>string.nonEmpty
    },
    boolean: {
        cast: () => boolean.toBoolean
    },
    number: {
        cast: () => number.toNumber,
        min: <Provider>number.min,
        max: <Provider>number.max
    }
};

/**
 * compile a schema into a string.
 *
 * This function produces a string that can be used for code generation from
 * templates.
 */
export const compile = (opts: Partial<Options>, schema: Schema) => {
    let available = rmerge(defaultAvailables, opts.available || {});
    let ctx = merge3(defaults, opts, { available });
    return parse(
        {
            visit: node => visit(ctx, node),
            get: get(ctx)
        },
        schema
    );
};

const defaults = {
    identity: base.identity,

    optional: base.optional,

    and: base.and,

    or: base.or,

    properties: object.restrict,

    additionalProperties: object.map,

    items: (prec: Precondition) =>
        base.and(base.typeOf<Value[]>('array'), array.map(prec))
};

const get =
    (ctx: Options) =>
    (path: Path, args: Type[]): Maybe<Precondition> =>
        _get(path, ctx.available).map(fn => fn.apply(null, args));
