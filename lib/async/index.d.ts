import * as sync from '../';
import * as Promise from 'bluebird';
import { Pattern } from '@quenk/kindof';
import { Failure as SyncFailure } from '../';
import { Either } from 'afpl/lib/monad/Either';
export { Either };
/**
 *
 * Async provides types and functions for operating on data
 * asynchronously.
 *
 * Bluebird promises are used in place of native promises.
 */
/**
 * Precondition (async version).
 */
export declare type Precondition<A, B> = (a: A) => Result<A, B>;
/**
 * Result (async version).
 */
export declare type Result<A, B> = Promise<sync.Result<A, B>>;
export declare type Failure<A> = Promise<SyncFailure<A>>;
/**
 * failure flags an async precondtion as failing.
 * @param <A> The type of the original value.
 * @param <B> The type of the expected valid value.
 * @param message The error message.
 * @param a The original value.
 * @param ctx Context for the error message.
 */
export declare const failure: <A, B>(message: string, a: A, ctx: sync.Context) => Promise<Either<SyncFailure<A>, B>>;
/**
 * success flags an async precondition as succeeding.
 * @param <A> The type of the original value.
 * @param <B> The type of the expected valid value.
 * @param b The new value after applying the precondition.
 */
export declare const success: <A, B>(b: B) => Promise<Either<SyncFailure<A>, B>>;
/**
 * or (async version).
 */
export declare const or: <A, B>(left: Precondition<A, B>, right: Precondition<A, B>) => (value: A) => Promise<Either<SyncFailure<{}>, B>>;
/**
 * and (async version).
 */
export declare const and: <A, B, C>(left: Precondition<A, B>, right: Precondition<B, C>) => Precondition<A, C>;
/**
 * every (async version).
 */
export declare const every: <A, B>(p: Precondition<A, B>, ...list: Precondition<A | B, B>[]) => Precondition<A, B>;
/**
 * optional (async version).
 */
export declare const optional: <A, B>(p: Precondition<A, A | B>) => Precondition<A, A | B>;
/**
 * caseOf (async version).
 */
export declare const caseOf: <A, B>(t: Pattern, p: Precondition<A, B>) => Precondition<A, B>;
/**
 * match (async version).
 */
export declare const match: <A, B>(p: Precondition<A, B>, ...list: Precondition<A, B>[]) => Precondition<A, B>;
/**
 * async wraps the sync api so they can be used with async preconditions safely.
 * @param <A> The type of the input value of the precondition.
 * @param <B> The type of the final value of the precondition.
 * @param a The input value.
 */
export declare const async: <A, B>(p: sync.Precondition<A, B>) => (a: A) => Promise<Either<SyncFailure<A>, B>>;
/**
 * resolve wraps a value in a Promise.
 */
export declare const resolve: typeof Promise.resolve;
/**
 * reject wraps a value in a rejected Promise.
 */
export declare const reject: typeof Promise.reject;
