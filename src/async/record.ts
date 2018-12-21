import { Record, reduce, keys, merge } from '@quenk/noni/lib/data/record';
import { Future, pure } from '@quenk/noni/lib/control/monad/future';
import { Type } from '@quenk/noni/lib/data/type';
import { fail } from '../result/failure/record';
import { Failure, Failures } from '../result/failure';
import { Result, succeed } from '../result';
import { Precondition, Preconditions } from './';

interface Reports<A, B, BR extends Record<B>> {

    failures: Failures<A>

    values: BR

}

/**
 * restrict (async version).
 */
export const restrict = <A, AR extends Record<A>, B, BR extends Record<B>>
    (conditions: Preconditions<A, B>): Precondition<AR, BR> => (value: AR) =>
        reduce(conditions, reports<A, B, BR>(), restrictReduce(value))
            .chain(review<A, AR, B, BR>(value));

const restrictReduce = <A, AR extends Record<A>, B, BR extends Record<B>>
    (value: AR) => (
        p: Future<Reports<A, B, BR>>,
        f: Precondition<A, B>,
        key: string) =>
        p.chain((r: Reports<A, B, BR>) => f(value[key]).chain(finish(key, r)));

/**
 * disjoint (async version).
 */
export const disjoint = <A, AR extends Record<A>, B, BR extends Record<B>>
    (conditions: Preconditions<A, B>): Precondition<AR, BR> => (value: AR) =>
        reduce(value, reports<A, B, BR>(), (
            p: Future<Reports<A, B, BR>>,
            x: A,
            key: string) =>
            p
                .chain((r: Reports<A, B, BR>) =>
                    conditions.hasOwnProperty(key) ?
                        conditions[key](x)
                            .chain(finish(key, r)) :
                        pure(onSuccess<A, B, BR>(key, <any>r)(<Type>x))))

            .chain(review<A, AR, B, BR>(value));

/**
 * intersect (async version).
 */
export const intersect = <A, AR extends Record<A>, B, BR extends Record<B>>
    (conditions: Preconditions<A, B>): Precondition<AR, BR> => (value: AR) =>
        reduce(value, reports<A, B, BR>(), intersectReduce<A, B, BR>(conditions))
            .chain(review<A, AR, B, BR>(value));

const intersectReduce = <A, B, BR extends Record<B>>
    (conditions: Preconditions<A, B>) =>
    (p: Future<Reports<A, B, BR>>, x: A, key: string) =>
        p
            .chain((r: Reports<A, B, BR>) =>
                conditions.hasOwnProperty(key) ?
                    conditions[key](x).chain(finish(key, r)) :
                    pure(onSuccess(key, r)(<any>null)));

/**
 * union (async version).
 */
export const union = <A, AR extends Record<A>, B, BR extends Record<B>>
    (conditions: Preconditions<A, B>): Precondition<AR, BR> => (value: AR) =>
        keys(conditions)
            .concat(keys(value))
            .reduce(unionReduce<A, AR, B, BR>(conditions, value), reports<A, B, BR>())
            .chain(review<A, AR, B, BR>(value));

const unionReduce = <A, AR extends Record<A>, B, BR extends Record<B>>
    (conditions: Preconditions<A, B>, value: AR) =>
    (p: Future<Reports<A, B, BR>>, key: string) =>
        p
            .chain(r => conditions.hasOwnProperty(key) ?
                conditions[key](value[key]).chain(finish(key, r)) :
                pure(onSuccess(key, r)(<Type>value[key])))

/**
 * map (async version).
 */
export const map = <A, AR extends Record<A>, B, BR extends Record<B>>
    (condition: Precondition<A, B>): Precondition<AR, BR> => (value: AR) =>
        reduce(value, reports<A, B, BR>(), mapReduce<A, B, BR>(condition))
            .chain(review<A, AR, B, BR>(value));

const mapReduce = <A, B, BR extends Record<B>>(condition: Precondition<A, B>) =>
    (p: Future<Reports<A, B, BR>>, x: A, key: string) =>
        p.chain((r: Reports<A, B, BR>) =>
            condition(x).chain(finish<A, B, BR>(key, r)));

const reports = <A, B, BR extends Record<B>>(): Future<Reports<A, B, BR>> =>
    pure(<Reports<A, B, BR>>{ failures: {}, values: {} });

const finish = <A, B, BR extends Record<B>>
    (k: string, r: Reports<A, B, BR>) => (e: Result<A, B>)
        : Future<Reports<A, B, BR>> =>
        pure(e.fold(onFailure<A, B, BR>(k, r), onSuccess(k, r)));

const onFailure = <A, B, BR extends Record<B>>
    (key: string, { failures, values }: Reports<A, B, BR>) =>
    (f: Failure<A>): Reports<A, B, BR> => ({
        values,
        failures: merge(failures, { [key]: f })
    });

const onSuccess = <A, B, BR extends Record<B>>
    (key: string, { failures, values }: Reports<A, B, BR>) => (v: B)
        : Reports<A, B, BR> =>
        (v == null) ?
            { failures, values } :
            ({
                failures,
                values: merge(values, { [key]: v })
            });

const review = <A, AR extends Record<A>, B, BR extends Record<B>>(value: AR) =>
    (r: Reports<A, B, BR>): Future<Result<AR, BR>> =>
        (keys(r.failures).length > 0) ?
            pure(fail<A, AR, B, BR>(r.failures, value, {})) :
            pure(succeed<AR, BR>(r.values));
