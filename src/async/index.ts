import * as sync from '../';
import * as Promise from 'bluebird';
import { Pattern, kindOf } from '@quenk/kindof';
import { Failure as SyncFailure } from '../';
import { Either, Right } from 'afpl/lib/monad/Either';

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
        ctx: sync.Context = {}): Result<A, B> =>
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
 *
 * TODO: using the any type until Either is fixed in afpl.
 */
export const and = <A, B, C>(l: Precondition<A, B>, r: Precondition<B, C>)
    : Precondition<A | B, C> => (value: A) =>
        l(value).then((e: sync.Result<A, B>): Result<A | B, C> =>
            e
                .map(b => r(b))
                .orRight((f: sync.Failure<A>) => <any>failure<A, B>(f.message, value, f.context))
                .takeRight());

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
 * optional (async version).
 */
export const optional = <A, B>(p: Precondition<A, A | B>)
    : Precondition<A, A | B> =>
    (value: A) =>
        ((value == null) || (typeof value === 'string' && value === '')) ?
            success<A, A>(value) : p(value);

/**
 * caseOf (async version).
 */
export const caseOf = <A, B>(t: Pattern, p: Precondition<A, B>)
    : Precondition<A, B> => (value: A) =>
        kindOf(value, t) ? p(value) : failure<A, B>('caseOf', value, { type: t });

/**
 * match (async version).
 */
export const match = <A, B>(p: Precondition<A, B>, ...list: Precondition<A, B>[])
    : Precondition<A, B> =>
    (value: A) => list.reduce((pe, f) =>
        pe
            .then(e => (e instanceof Right) ? Promise.resolve(e) :
                Promise
                    .resolve(e.takeLeft())
                    .then(r => (r.message === 'caseOf') ?
                        f(value) :
                        failure<A, B>(r.message, value, r.context))), p(value));

/**
 * async wraps the sync api so they can be used with async preconditions safely.
 * @param <A> The type of the input value of the precondition.
 * @param <B> The type of the final value of the precondition.
 * @param a The input value.
 */
export const async = <A, B>(p: sync.Precondition<A, B>) => (a: A) => resolve(p(a));

/**
 * identity precondtion.
 *
 * Succeeds with whatever value is passed.
 */
export const identity = <A>(value: A) => success<A, A>(value);

export const id = identity;

/**
 * fail always fails with reason no matter the value supplied.
 */
export const fail = <A>(reason: string): Precondition<A, A> => (value: A) =>
    failure<A, A>(reason, value);

/**
 * resolve wraps a value in a Promise.
 */
export const resolve = Promise.resolve;

/**
 * reject wraps a value in a rejected Promise.
 */
export const reject = Promise.reject;
