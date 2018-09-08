import * as Promise from 'bluebird';
import { reduce } from '@quenk/noni/lib/data/record';
import { either } from '@quenk/noni/lib/data/either';
import { Reports as SyncReports } from '../../record/failure';
import { onSuccess, onFailure } from '../../record';
import { combineKeys } from '../../util';
import { Values } from '../../record';
import { Result as SyncResult } from '../../result';
import { Precondition } from '../../async';
import { review } from './failure';

/**
 * Preconditions is a record of asynchronous preconditions.
 */
export interface Preconditions<A, B> {

    [key: string]: Precondition<A, B>

}

/**
 * @private
 */
export type Reports<A, B> = Promise<SyncReports<A, B>>

/**
 * @private
 */
export const reports = <A>(): Reports<A, A> =>
    Promise.resolve({ failures: {}, values: {} });

/**
 * @private
 */
export const finish = <A>(key: string, r: SyncReports<A, A>) =>
    (e: SyncResult<A, A>) =>
        Promise.resolve(either(onFailure(key, r))(onSuccess(key, r))(e));

/**
 * restrict (async version).
 */
export const restrict =
    <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>): Precondition<A, B> =>
        (value: A) =>
            reduce(conditions, reports(), (
                p: Reports<AB, AB>,
                f: Precondition<AB, AB>,
                key: string) =>
                p.then((r: SyncReports<AB, AB>) =>
                    f(value[key]).then(finish(key, r))))
                .then(review<A, AB, B>(value));

/**
 * disjoint (async version).
 */
export const disjoint = <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>)
    : Precondition<A, B> =>
    (value: A) =>

        reduce(value, reports(), (
            p: Reports<AB, AB>,
            x: AB,
            key: string) =>
            p
                .then((r: SyncReports<AB, AB>) =>
                    conditions.hasOwnProperty(key) ?
                        conditions[key](x)
                            .then(finish(key, r)) :
                        Promise.resolve(onSuccess(key, r)(x))))

            .then(review<A, AB, B>(value));

/**
 * intersect (async version).
 */
export const intersect =
    <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>)
        : Precondition<A, B> =>
        (value: A) =>

            reduce(value, reports(), (
                p: Reports<AB, AB>,
                x: AB,
                key: string) =>
                p
                    .then((r: SyncReports<AB, AB>) =>
                        conditions.hasOwnProperty(key) ?
                            conditions[key](x)
                                .then(finish(key, r)) :
                            Promise.resolve(onSuccess(key, r)(null))))

                .then(review<A, AB, B>(value));

/**
 * union (async version).
 */
export const union =
    <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>)
        : Precondition<A, B> =>
        (value: A) =>
            combineKeys(conditions, value)
                .reduce((p: Reports<AB, AB>, key: string) =>
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
    <A extends Values<AB>, AB, B>(condition: Precondition<AB, AB>)
        : Precondition<A, B> =>
        (value: A) =>
            reduce(value, reports(), (p: Reports<AB, AB>, x: AB, key: string) =>
                p.then((r: SyncReports<AB, AB>) =>
                    condition(x)
                        .then(finish(key, r))))
                .then(review<A, AB, B>(value));

