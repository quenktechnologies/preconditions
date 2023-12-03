import * as baseAsync from '.';
import * as base from '../';

import {
    Record,
    reduce,
    keys,
    merge,
    empty
} from '@quenk/noni/lib/data/record';
import { Value, Object } from '@quenk/noni/lib/data/jsonx';
import { Future, pure } from '@quenk/noni/lib/control/monad/future';
import { Type } from '@quenk/noni/lib/data/type';

import { fail } from '../result/failure/record';
import { Failure, Failures } from '../result/failure';
import { Result, succeed } from '../result';
import { exclude } from '../record';
import { reduce as arrayReduce } from './array';
import { Precondition, Preconditions } from './';

interface Reports<A, B, R extends Record<B>> {
    failures: Failures<A>;

    values: R;
}

/**
 * restrict (async version).
 */
export const restrict =
    <A, B, R extends Record<B>>(
        tests: Preconditions<A, B>
    ): Precondition<Record<A>, R> =>
    (value: Record<A>) =>
        reduce(tests, reports<A, B, R>(), restrictReduce(value)).chain(
            review<A, B, R>(value)
        );

const restrictReduce =
    <A, B, R extends Record<B>>(value: Record<A>) =>
    (p: Future<Reports<A, B, R>>, f: Precondition<A, B>, key: string) =>
        p.chain((r: Reports<A, B, R>) => f(value[key]).chain(finish(key, r)));

/**
 * disjoint (async version).
 */
export const disjoint =
    <A, B, R extends Record<B>>(
        tests: Preconditions<A, B>
    ): Precondition<Record<A>, R> =>
    (value: Record<A>) =>
        reduce(
            value,
            reports<A, B, R>(),
            (p: Future<Reports<A, B, R>>, x: A, key: string) =>
                p.chain((r: Reports<A, B, R>) =>
                    Object.hasOwnProperty.call(tests, key)
                        ? tests[key](x).chain(finish(key, r))
                        : pure(onSuccess<A, B, R>(key, r)(<Type>x))
                )
        ).chain(review<A, B, R>(value));

/**
 * intersect (async version).
 */
export const intersect =
    <A, B, R extends Record<B>>(
        tests: Preconditions<A, B>
    ): Precondition<Record<A>, R> =>
    (value: Record<A>) =>
        reduce(
            value,
            reports<A, B, R>(),
            intersectReduce<A, B, R>(tests)
        ).chain(review<A, B, R>(value));

const intersectReduce =
    <A, B, R extends Record<B>>(tests: Preconditions<A, B>) =>
    (p: Future<Reports<A, B, R>>, v: A, key: string) =>
        p.chain((r: Reports<A, B, R>) =>
            Object.hasOwnProperty.call(tests, key)
                ? tests[key](v).chain(finish(key, r))
                : pure(onSuccess(key, r)(<Type>null))
        );

/**
 * union (async version).
 */
export const union =
    <A, B, R extends Record<B>>(
        tests: Preconditions<A, B>
    ): Precondition<Record<A>, R> =>
    (value: Record<A>) =>
        keys(tests)
            .concat(keys(value))
            .reduce(unionReduce<A, B, R>(tests, value), reports<A, B, R>())
            .chain(review<A, B, R>(value));

const unionReduce =
    <A, B, R extends Record<B>>(tests: Preconditions<A, B>, value: Record<A>) =>
    (p: Future<Reports<A, B, R>>, key: string) =>
        p.chain(r =>
            Object.hasOwnProperty.call(tests, key)
                ? tests[key](value[key]).chain(finish(key, r))
                : pure(onSuccess(key, r)(<Type>value[key]))
        );

/**
 * map (async version).
 */
export const map =
    <A, B, R extends Record<B>>(
        test: Precondition<A, B>
    ): Precondition<Record<A>, R> =>
    (value: Record<A>) =>
        reduce(value, reports<A, B, R>(), mapReduce<A, B, R>(test)).chain(
            review<A, B, R>(value)
        );

const mapReduce =
    <A, B, R extends Record<B>>(test: Precondition<A, B>) =>
    (p: Future<Reports<A, B, R>>, v: A, key: string) =>
        p.chain((r: Reports<A, B, R>) =>
            test(v).chain(finish<A, B, R>(key, r))
        );

const reports = <A, B, R extends Record<B>>(): Future<Reports<A, B, R>> =>
    pure(<Reports<A, B, R>>{ failures: {}, values: {} });

const finish =
    <A, B, R extends Record<B>>(k: string, r: Reports<A, B, R>) =>
    (e: Result<A, B>): Future<Reports<A, B, R>> =>
        pure(e.fold(onFailure<A, B, R>(k, r), onSuccess(k, r)));

const onFailure =
    <A, B, R extends Record<B>>(
        key: string,
        { failures, values }: Reports<A, B, R>
    ) =>
    (f: Failure<A>): Reports<A, B, R> => ({
        values,
        failures: merge(failures, { [key]: f })
    });

const onSuccess =
    <A, B, R extends Record<B>>(
        key: string,
        { failures, values }: Reports<A, B, R>
    ) =>
    (v: B): Reports<A, B, R> =>
        v == null
            ? { failures, values }
            : {
                  failures,
                  values: merge(values, { [key]: v })
              };

const review =
    <A, B, R extends Record<B>>(value: Record<A>) =>
    (r: Reports<A, B, R>): Future<Result<Record<A>, R>> =>
        keys(r.failures).length > 0
            ? pure(fail<A, B, R>(r.failures, value, {}))
            : pure(succeed<Record<A>, R>(r.values));

/**
 * schemaProperties (async)
 */
export const schemaProperties = (
    propsWrap: (
        props: Preconditions<Value, Value>
    ) => Precondition<Object, Object>,
    props: Preconditions<Value, Value>,
    addPropsPrec?: Precondition<Value, Value>
): Precondition<Value, Value> => {
    let finalPropPrec: Precondition<Object, Object> = empty(props)
        ? baseAsync.async(base.identity)
        : propsWrap(props);

    if (!addPropsPrec) return <Precondition<Value, Value>>finalPropPrec;

    return <Precondition<Value, Value>>baseAsync.and(
        baseAsync.tee<Object, Object>([
            finalPropPrec,
            baseAsync.and(
                baseAsync.async(exclude(keys(props))),
                map(addPropsPrec)
            )
        ]),
        arrayReduce<Object, Object>(
            () => ({}),
            accm => value => pure(succeed(merge(accm, value)))
        )
    );
};
