import * as base from '../../';
import * as object from '../../record';
import * as array from '../../array';
import * as string from '../../string';
import * as boolean from '../../boolean';
import * as number from '../../number';
import * as async from '../../async';
import * as asyncObject from '../../async/record';
import * as asyncArray from '../../async/array';

import { just, Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Record, rmerge, merge3 } from '@quenk/noni/lib/data/record';
import { get } from '@quenk/noni/lib/data/record/path';
import { Value } from '@quenk/noni/lib/data/jsonx';
import { Type, isFunction } from '@quenk/noni/lib/data/type';

import { parse } from '../parse';
import { PreconditionSpec, Schema } from '..';
import { BaseOptions, CompileContext } from '.';

/**
 * Precondition specialized to jsonx values.
 */
export type Precondition = base.Precondition<Value, Value>;

type Provide<T> = (...args: Type[]) => T;

/**
 * Provider provides a precondition given some arguments.
 */
export type Provider = Provide<Precondition>;

/**
 * PreconditionsAvailable is a namespaced map or a map of providers.
 */
export interface PreconditionsAvailable
    extends Record<Provider | Record<Provider>> {}

/**
 * Options that can be configured when compiling functions.
 */
export interface Options extends BaseOptions {
    /**
     * preconditions is used to resolve precondition references.
     */
    preconditions: PreconditionsAvailable;
}

const props = {
    restrict: object.restrict,
    intersect: object.intersect,
    disjoint: object.disjoint,
    union: object.union
};

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
 * FunctionContext is used for compilation of a schema to a synchronous
 * precondition function.
 */
export class FunctionContext extends CompileContext<Precondition, Options> {
    identity = base.identity;

    optional = base.optional;

    and = base.and;

    or = base.or;

    properties = <Provider>props[<'restrict'>this.options.propMode];

    additionalProperties = <Provider>object.map;

    items = (prec: Precondition) =>
        <Precondition>base.and(base.typeOf<Value[]>('array'), array.map(prec));

    get = (spec: PreconditionSpec<Precondition>): Maybe<Precondition> =>
        doGet<Precondition>(this.options.preconditions, spec);
}

const doGet = <T>(
    rec: Record<Provide<T> | Record<Provide<T>>>,
    spec: PreconditionSpec<T>
): Maybe<T> => {
    if (Array.isArray(spec)) {
        let [path, args] = spec;
        return get(path, rec).chain(fn =>
            isFunction(fn) ? just(fn.apply(null, args)) : nothing()
        );
    } else if (isFunction(spec)) {
        return just(<T>spec);
    } else {
        return nothing();
    }
};

/**
 * compile a schema into a single precondition function.
 */
export const compile = (opts: Partial<Options>, schema: Schema) =>
    parse(
        new FunctionContext(
            merge3(
                { key: 'preconditions', propMode: 'restrict', builtins: true },
                opts,
                {
                    preconditions: rmerge(
                        defaultAvailables,
                        opts.preconditions || {}
                    )
                }
            )
        ),
        schema
    );

/**
 * AsyncPrecondition specialized to jsonx values.
 */
export type AsyncPrecondition = async.AsyncPrecondition<Value, Value>;

/**
 * AsyncProvider provides an async precondition given some arguments.
 */
export type AsyncProvider = (...args: Type[]) => AsyncPrecondition;

/**
 * AsyncOptions used for async precondition compilation.
 */
export interface AsyncOptions extends BaseOptions {
    /**
     * asyncPreconditions is used to resolve async precondition
     * references.
     */
    asyncPreconditions: AsyncPreconditionsAvailable;
}

/**
 * AsyncPreconditionsAvailable is a namespaced map or a map of async providers.
 */
export interface AsyncPreconditionsAvailable
    extends Record<AsyncProvider | Record<AsyncProvider>> {}

const asyncProps = {
    restrict: asyncObject.restrict,
    intersect: asyncObject.intersect,
    disjoint: asyncObject.disjoint,
    union: asyncObject.union
};

/**
 * AsyncFunctionContext is used for compilation of a schema to an async
 * precondition function.
 */
export class AsyncFunctionContext extends CompileContext<
    AsyncPrecondition,
    AsyncOptions
> {
    identity = async.identity;

    optional = async.optional;

    and = async.and;

    or = async.or;

    properties = <AsyncProvider>asyncProps[<'restrict'>this.options.propMode];

    additionalProperties = <AsyncProvider>asyncObject.map;

    items = (prec: AsyncPrecondition) =>
        <AsyncPrecondition>(
            async.and(
                async.async(base.typeOf<Value[]>('array')),
                asyncArray.map(prec)
            )
        );

    get = (
        spec: PreconditionSpec<AsyncPrecondition>
    ): Maybe<AsyncPrecondition> =>
        doGet<AsyncPrecondition>(this.options.asyncPreconditions, spec);
}

/**
 * compileAsync a schema into a single async precondition function.
 *
 * This function disables builtins and changes the default precondition key to
 * "asyncPreconditions".
 */
export const compileAsync = (opts: Partial<AsyncOptions>, schema: Schema) =>
    parse(
        new AsyncFunctionContext(
            merge3(
                {
                    key: 'asyncPreconditions',
                    propMode: 'restrict'
                },
                opts,
                {
                    builtins: false,
                    asyncPreconditions: rmerge(
                        {},
                        opts.asyncPreconditions || {}
                    )
                }
            )
        ),
        schema
    );
