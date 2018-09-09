import * as Promise from 'bluebird';
import { Record, reduce } from '@quenk/noni/lib/data/record';
import { either } from '@quenk/noni/lib/data/either';
import { Reports as SyncReports } from '../../record/result';
import { onSuccess, onFailure } from '../../record';
import { combineKeys } from '../../util';
import { Result as SyncResult } from '../../result';
import { Precondition } from '../../async';
import { Reports, review, reports } from './result';

/**
 * Preconditions is a record of asynchronous preconditions.
 */
export interface Preconditions<A, B> {

    [key: string]: Precondition<A, B>

}

/**
 * @private
 */
export const finish =
    <A>(key: string, r: SyncReports<A, A>) => (e: SyncResult<A, A>) =>
        Promise.resolve(either<any, any, any>(onFailure(key, r))(onSuccess(key, r))(e));

/**
 * restrict (async version).
 */
export const restrict = <P, A extends Record<P>, Q, B extends Record<Q>>
    (conditions: Preconditions<P, Q>): Precondition<A, B> => (value: A) =>
        reduce(conditions, reports(), (
            p: Reports<P, Q>,
            f: Precondition<P, Q>,
            key: string) =>
            p.then((r: SyncReports<P, Q>) =>
                f(value[key]).then(finish<any>(key, r))))
            .then(review<A, P, B>(value));

/**
 * disjoint (async version).
 */
export const disjoint = <P, A extends Record<P>, Q, B extends Record<Q>>
    (conditions: Preconditions<P, Q>): Precondition<A, B> => (value: A) =>
        reduce(value, reports(), (
            p: Reports<P, Q>,
            x: P,
            key: string) =>
            p
                .then((r: SyncReports<P, Q>) =>
                    conditions.hasOwnProperty(key) ?
                        conditions[key](x)
                            .then(finish<any>(key, r)) :
                        Promise.resolve(onSuccess(key, <any>r)(x))))

            .then(review<A, P, B>(value));

/**
 * intersect (async version).
 */
export const intersect = <P, A extends Record<P>, Q, B extends Record<Q>>
    (conditions: Preconditions<P, Q>): Precondition<A, B> => (value: A) =>
        reduce(value, reports(), (
            p: Reports<P, Q>,
            x: P,
            key: string) =>
            p
                .then((r: SyncReports<P, Q>) =>
                    conditions.hasOwnProperty(key) ?
                        conditions[key](x)
                            .then(finish<any>(key, r)) :
                        Promise.resolve(onSuccess(key, r)(<any>null))))

            .then(review<A, P, B>(value));

/**
 * union (async version).
 */
export const union = <P, A extends Record<P>, Q, B extends Record<Q>>
    (conditions: Preconditions<P, Q>): Precondition<A, B> => (value: A) =>
        combineKeys(conditions, value)
            .reduce((p: Reports<P, Q>, key: string) =>
                p
                    .then(r => conditions.hasOwnProperty(key) ?
                        conditions[key](value[key]).then(finish<any>(key, r)) :
                        Promise.resolve(onSuccess(key, r)(<any>value[key]))), reports<P>())
            .then(review<A, P, B>(value));

/**
 * map (async version).
 */
export const map = <P, A extends Record<P>, Q, B extends Record<Q>>
    (condition: Precondition<P, Q>): Precondition<A, B> => (value: A) =>
        reduce(value, reports(), (p: Reports<P, Q>, x: P, key: string) =>
            p.then((r: SyncReports<P, Q>) =>
                condition(x)
                    .then(finish<any>(key, r))))
            .then(review<A, P, B>(value));

