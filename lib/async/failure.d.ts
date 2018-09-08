import * as Promise from 'bluebird';
import { Result as SyncResult } from '../result';
import { Failure as SyncFailure } from '../failure';
import { Context } from '../failure';
export declare type Failure<A> = Promise<SyncFailure<A>>;
/**
 * Result (async version).
 */
export declare type Result<A, B> = Promise<SyncResult<A, B>>;
/**
 * failure flags an async precondtion as failing.
 */
export declare const failure: <A, B>(message: string, a: A, ctx?: Context) => Promise<import("@quenk/noni/lib/data/either").Either<SyncFailure<A>, B>>;
/**
 * success flags an async precondition as succeeding.
 */
export declare const success: <A, B>(b: B) => Promise<import("@quenk/noni/lib/data/either").Either<SyncFailure<A>, B>>;
