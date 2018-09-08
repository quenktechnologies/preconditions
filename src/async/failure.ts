import * as Promise from 'bluebird';
import {
    Result as SyncResult,
    failure as syncFailure,
    success as syncSuccess
} from '../result';
import { Failure as SyncFailure } from '../failure';
import { Context } from '../failure';

export type Failure<A> = Promise<SyncFailure<A>>;

/**
 * Result (async version).
 */
export type Result<A, B> = Promise<SyncResult<A, B>>;

/**
 * failure flags an async precondtion as failing.
 */
export const failure =
    <A, B>(
        message: string,
        a: A,
        ctx: Context = {}): Result<A, B> =>
        Promise.resolve(syncFailure<A, B>(message, a, ctx));

/**
 * success flags an async precondition as succeeding.
 */
export const success = <A, B>(b: B) => Promise.resolve(syncSuccess<A, B>(b));
