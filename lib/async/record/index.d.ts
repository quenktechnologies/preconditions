import * as Promise from 'bluebird';
import { Record } from '@quenk/noni/lib/data/record';
import { Reports as SyncReports } from '../../record/result';
import { Precondition } from '../../async';
/**
 * Preconditions is a record of asynchronous preconditions.
 */
export interface Preconditions<A, B> {
    [key: string]: Precondition<A, B>;
}
/**
 * @private
 */
export declare const finish: <A>(key: string, r: SyncReports<A, A>) => (e: import("@quenk/noni/lib/data/either").Either<import("../result").Failure<A>, A>) => Promise<any>;
/**
 * restrict (async version).
 */
export declare const restrict: <P, A extends Record<P>, Q, B extends Record<Q>>(conditions: Preconditions<P, Q>) => Precondition<A, B>;
/**
 * disjoint (async version).
 */
export declare const disjoint: <P, A extends Record<P>, Q, B extends Record<Q>>(conditions: Preconditions<P, Q>) => Precondition<A, B>;
/**
 * intersect (async version).
 */
export declare const intersect: <P, A extends Record<P>, Q, B extends Record<Q>>(conditions: Preconditions<P, Q>) => Precondition<A, B>;
/**
 * union (async version).
 */
export declare const union: <P, A extends Record<P>, Q, B extends Record<Q>>(conditions: Preconditions<P, Q>) => Precondition<A, B>;
/**
 * map (async version).
 */
export declare const map: <P, A extends Record<P>, Q, B extends Record<Q>>(condition: Precondition<P, Q>) => Precondition<A, B>;
