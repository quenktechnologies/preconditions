import * as Sync from './Sync';
import * as Promise from 'bluebird';
import { Either } from 'afpl';
/**
 *
 * Async version of this module.
 *
 * Async wraps the {@link Sync.Precondition} in a Promise
 * (currently only bluebird can be used) so preconditions can
 * perform non-blocking IO.
 *
 * When working with async tests, use the corresponding logical functions and
 * types from here. Wrap any async work in {@link async} to avoid subtle bugs.
 */
/**
 * A map of key precondition pairs
 */
export interface Preconditions<A, B> {
    [key: string]: Precondition<A, B>;
}
/**
 * Precondition
 *
 * The async version of the Precondition interface.
 */
export interface Precondition<A, B> {
    /**
     * apply this Precondition asynchronously.
     */
    (value: A): Result<A, B>;
}
/**
 * Result async.
 */
export declare type Result<A, B> = Promise<Sync.Result<A, B>>;
/**
 * @private
 */
export declare type Reports<A, B> = Promise<Sync.Reports<A, B>>;
/**
 * fail async
 */
export declare const fail: <A, B>(m: string, v: A, ctx?: Sync.Context) => Promise<Either<Sync.Failure<A>, B>>;
/**
 * mapFail async
 */
export declare const mapFail: <A extends Sync.Values<V>, V, B>(errors: Sync.Failures<V>, value: A, contexts?: Sync.Contexts) => Promise<Either<Sync.MapFailure<A, V>, B>>;
/**
 * valid async
 */
export declare const valid: <A, B>(b: B) => Promise<Either<Sync.Failure<A>, B>>;
/**
 * map async
 */
export declare const map: <A extends Sync.Values<X>, X, Y, B>(conditions: Preconditions<X, Y>) => (value: A) => Promise<Either<Sync.Failure<A>, B>>;
/**
 * partial async
 */
export declare const partial: <A extends Sync.Values<X>, X, Y, B>(conditions: Preconditions<X, Y>) => Precondition<A, B>;
/**
 * or async
 */
export declare const or: <A, B>(left: Precondition<A, B>, right: Precondition<A, B>) => (value: A) => Promise<Either<Sync.Failure<{}>, B>>;
/**
 * and async
 */
export declare const and: <A, B>(left: Precondition<A, A>, right: Precondition<A, B>) => (value: A) => Promise<any>;
/**
 * async wraps the sync api so we can apply asynchronous tests.
 */
export declare const async: <A, B>(s: Sync.Precondition<A, B>) => (value: A) => Promise<any>;
