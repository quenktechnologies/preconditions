import * as sync from '../';
import * as Promise from 'bluebird';
import { Failure as SyncFailure } from '../';
import { Either } from 'afpl';

export { Either }; //shuts typescript up.

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
export type Precondition<A, B> = (a: A) => Result<A, B>;

/**
 * Result (async version).
 */
export type Result<A, B> = Promise<sync.Result<A, B>>

export type Failure<A> = Promise<SyncFailure<A>>;

/**
 * failure flags an async precondtion as failing.
 * @param <A> The type of the original value.
 * @param <B> The type of the expected valid value.
 * @param message The error message.
 * @param a The original value.
 * @param ctx Context for the error message.
 */
export const failure =
    <A, B>(
        message: string,
        a: A,
        ctx: sync.Context): Result<A, B> =>
        resolve(sync.failure<A, B>(message, a, ctx));

/**
 * success flags an async precondition as succeeding.
 * @param <A> The type of the original value.
 * @param <B> The type of the expected valid value.
 * @param b The new value after applying the precondition.
 */
export const success = <A, B>(b: B) => resolve(sync.success<A, B>(b));

/**
 * or (async version).
 */
export const or = <A, B>(left: Precondition<A, B>, right: Precondition<A, B>) =>
    (value: A) => left(value).then(e => e.cata(() => right(value), success));

/**
 * and (async version).
 */
export const and = <A, B, C>(
    left: Precondition<A, B>,
    right: Precondition<B, C>): Precondition<A, C> =>
    (value: A) => left(value).then(e => e.cata(Promise.resolve, v => right(v)));

/**
 * every (async version).
 */
export const every = <A, B>(p: Precondition<A, B>, ...list: Precondition<A | B, B>[])
    : Precondition<A, B> => (value: A) =>
        list.reduce((promise, condition: Precondition<B, B>) =>
            promise
                .then(e => e.cata<any>(
                    f => Promise.resolve(sync.left(f)),
                    b => condition(b)
                )), p(value));

/**
 * async wraps the sync api so they can be used with async preconditions safely.
 * @param <A> The type of the input value of the precondition.
 * @param <B> The type of the final value of the precondition.
 * @param a The input value.
 */
export const async = <A, B>(p: sync.Precondition<A, B>) => (a: A) => resolve(p(a));

/**
 * resolve wraps a value in a Promise.
 */
export const resolve = Promise.resolve;

/**
 * reject wraps a value in a rejected Promise.
 */
export const reject = Promise.reject;
