import * as Promise from 'bluebird';
import * as util from 'afpl/lib/util';
import * as asynch from '../../async';
import * as sync from '../..';
import { Either } from 'afpl/lib/monad/Either';
import { Failure } from '../..';
import {
    Values,
    Reports as SyncReports,
    onFailure,
    onSuccess,
    keysUnion,
    failure,
    success
} from '../';

export { Either, Failure }; //shuts up compiler

/**
 * Preconditions is a record of asynchronous preconditions.
 */
export interface Preconditions<A, B> {

    [key: string]: asynch.Precondition<A, B>

}

/**
 * @private
 */
export type Reports<A, B> = Promise<SyncReports<A, B>>

/**
 * @private
 */
export const review = <A extends Values<AB>, AB, B>( value: A) =>
    (r: SyncReports<AB, AB>): asynch.Result<A, B> =>
        (Object.keys(r.failures).length > 0) ?
            Promise.resolve(failure<A, AB, B>(r.failures, value, {})) :
            Promise.resolve(success<A, B>(<B><any>r.values));

/**
 * @private
 */
export const reports = <A>(): Reports<A, A> =>
    Promise.resolve({ failures: {}, values: {} });

/**
 * @private
 */
export const finish = <A>(key: string, r: SyncReports<A, A>) =>
    (e: sync.Result<A, A>) =>
        Promise.resolve(e.cata(onFailure(key, r), onSuccess(key, r)));

/**
 * restrict (async version).
 */
export const restrict =
    <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>): asynch.Precondition<A, B> =>
        (value: A) =>
            util.reduce(conditions, (
                p: Reports<AB, AB>,
                f: asynch.Precondition<AB, AB>,
                key: string) =>
                p.then((r: SyncReports<AB, AB>) =>
                    f(value[key]).then(finish(key, r))), reports())
                .then(review<A, AB, B>( value));

/**
 * disjoint (async version).
 */
export const disjoint = <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>)
    : asynch.Precondition<A, B> =>
    (value: A) =>

        util.reduce(value, (
            p: Reports<AB, AB>,
            x: AB,
            key: string) =>
            p
                .then((r: SyncReports<AB, AB>) =>
                    conditions.hasOwnProperty(key) ?
                        conditions[key](x)
                            .then(finish(key, r)) :
                        Promise.resolve(onSuccess(key, r)(x))), reports())

            .then(review<A, AB, B>(value));

/**
 * intersect (async version).
 */
export const intersect =
    <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>)
        : asynch.Precondition<A, B> =>
        (value: A) =>

            util.reduce(value, (
                p: Reports<AB, AB>,
                x: AB,
                key: string) =>
                p
                    .then((r: SyncReports<AB, AB>) =>
                        conditions.hasOwnProperty(key) ?
                            conditions[key](x)
                                .then(finish(key, r)) :
                            Promise.resolve(onSuccess(key, r)(null))), reports())

                .then(review<A, AB, B>( value));

/**
 * union (async version).
 */
export const union =
    <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>)
        : asynch.Precondition<A, B> =>
        (value: A) =>
            keysUnion(conditions, value)
                .reduce((p: Reports<AB, AB>, key) =>
                    p
                        .then(r =>
                            conditions.hasOwnProperty(key) ?
                                conditions[key](value[key]).then(finish(key, r)) :
                                Promise.resolve(onSuccess(key, r)(value[key]))), reports<AB>())
                .then(review<A, AB, B>(value));

/**
 * map (async version).
 */
export const map =
    <A extends Values<AB>, AB, B>(condition: asynch.Precondition<AB, AB>)
        : asynch.Precondition<A, B> =>
        (value: A) =>
            util.reduce(value, (p: Reports<AB, AB>, x: AB, key: string) =>
                p.then((r: SyncReports<AB, AB>) =>
                    condition(x)
                        .then(finish(key, r))), reports())
                .then(review<A, AB, B>(value));

