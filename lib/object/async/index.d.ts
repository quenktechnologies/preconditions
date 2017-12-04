import * as Promise from 'bluebird';
import * as asynch from '../../async';
import { Either } from 'afpl/lib/monad/Either';
import { Failure } from '../..';
import { Values, Reports as SyncReports } from '../';
export { Either, Failure };
/**
 * Preconditions is a record of asynchronous preconditions.
 */
export interface Preconditions<A, B> {
    [key: string]: asynch.Precondition<A, B>;
}
/**
 * @private
 */
export declare type Reports<A, B> = Promise<SyncReports<A, B>>;
/**
 * @private
 */
export declare const review: <A extends Values<AB>, AB, B>(value: A) => (r: SyncReports<AB, AB>) => Promise<Either<Failure<A>, B>>;
/**
 * @private
 */
export declare const reports: <A>() => Promise<SyncReports<A, A>>;
/**
 * @private
 */
export declare const finish: <A>(key: string, r: SyncReports<A, A>) => (e: Either<Failure<A>, A>) => Promise<SyncReports<A, A>>;
/**
 * restrict (async version).
 */
export declare const restrict: <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>) => asynch.Precondition<A, B>;
/**
 * disjoint (async version).
 */
export declare const disjoint: <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>) => asynch.Precondition<A, B>;
/**
 * intersect (async version).
 */
export declare const intersect: <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>) => asynch.Precondition<A, B>;
/**
 * union (async version).
 */
export declare const union: <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>) => asynch.Precondition<A, B>;
/**
 * map (async version).
 */
export declare const map: <A extends Values<AB>, AB, B>(condition: asynch.Precondition<AB, AB>) => asynch.Precondition<A, B>;
