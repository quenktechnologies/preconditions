import * as Promise from 'bluebird';
import { Record } from '@quenk/noni/lib/data/record';
import { Reports as SyncReports } from '../../record/failure';
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
export declare type Reports<A, B> = Promise<SyncReports<A, B>>;
/**
 * @private
 */
export declare const reports: <A>() => Promise<SyncReports<A, A>>;
/**
 * @private
 */
export declare const finish: <A>(key: string, r: SyncReports<A, A>) => (e: import("@quenk/noni/lib/data/either").Either<import("../failure").Failure<A>, A>) => Promise<any>;
/**
 * restrict (async version).
 */
export declare const restrict: <A extends Record<AB>, AB, B>(conditions: Preconditions<AB, AB>) => Precondition<A, B>;
/**
 * disjoint (async version).
 */
export declare const disjoint: <A extends Record<AB>, AB, B>(conditions: Preconditions<AB, AB>) => Precondition<A, B>;
/**
 * intersect (async version).
 */
export declare const intersect: <A extends Record<AB>, AB, B>(conditions: Preconditions<AB, AB>) => Precondition<A, B>;
/**
 * union (async version).
 */
export declare const union: <A extends Record<AB>, AB, B>(conditions: Preconditions<AB, AB>) => Precondition<A, B>;
/**
 * map (async version).
 */
export declare const map: <A extends Record<AB>, AB, B>(condition: Precondition<AB, AB>) => Precondition<A, B>;
