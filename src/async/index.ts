/**
 * The promise module provides primitives for async preconditions
 * via bluebirds Promise API.
 */
import * as sync from '../';
import * as Promise from 'bluebird';
import { Pattern, kindOf } from '@quenk/kindof';
import { Right, either, left, right } from '@quenk/noni/lib/data/either';
import { cons } from '@quenk/noni/lib/data/function';
import { Result as SyncResult } from '../result';
import { Failure as SyncFailure } from '../failure';
import { Result, failure, success } from './failure';

/**
 * Precondition (async version).
 */
export type Precondition<A, B> = (a: A) => Result<A, B>;

/**
 * async wraps the sync api so they can be used with async preconditions safely.
 */
export const async =
    <A, B>(p: sync.Precondition<A, B>) => (a: A) => Promise.resolve(p(a));

/**
 * or (async version).
 */
export const or = <A, B>(left: Precondition<A, B>, right: Precondition<A, B>)
    : Precondition<A, B> => (value: A) =>
        left(value).then((e: SyncResult<A, B>) =>
            (either<SyncFailure<A>, B, Result<A, B>>
                (cons(right(value)))(success)(e)));
/**
 * and (async version).
 *
 * TODO: using the any type until Either is fixed in afpl.
 */
export const and = <A, B, C>(l: Precondition<A, B>, r: Precondition<B, C>)
    : Precondition<A | B, C> => (value: A | B) =>
        l(<A>value).then((e: SyncResult<A, B>): Result<A | B, C> =>
            (<SyncResult<A, any>>e.map(b => r(b)))
                .orRight((f: SyncFailure<A>) => <any>failure<A | B, B>(f.message, value, f.context))
                .takeRight());

/**
 * every (async version).
 */
export const every =
    <A, B>(p: Precondition<A, B>, ...list: Precondition<B, B>[])
        : Precondition<A, B> => (value: A) =>
            p(value).then((e: SyncResult<A, B>) =>
                either<SyncFailure<any>, B, Result<any, B>>(evl)
                    (ev(list))(e));

const ev = <B>(list: Precondition<B, B>[]) => (b: B): Result<B, B> =>
    list.reduce((p: Result<B, B>, c: Precondition<B, B>) =>
        p.then(ev2(c)),
        Promise.resolve(right(b)));

const ev2 = <B>(p: Precondition<B, B>) => (e: SyncResult<B, B>) =>
    either<SyncFailure<B>, B, Result<B, B>>
        (evl)
        ((b: B) => p(b))(e);

const evl = <B>(f: SyncFailure<B>): Result<B, B> => Promise.resolve(left(f))

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
 * log the value to the console.
 */
export const log = <A>(value: A): Result<A, A> =>
    console.log(value) || success(value);
