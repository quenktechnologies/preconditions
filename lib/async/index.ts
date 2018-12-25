/**
 * The promise module provides primitives for async preconditions
 * via bluebirds Promise API.
 */
import * as sync from '../';
import { Pattern, test } from '@quenk/noni/lib/data/type';
import { Future, pure } from '@quenk/noni/lib/control/monad/future';
import { Right, Left, left, right } from '@quenk/noni/lib/data/either';
import { Failure, ModifiedFailure as MF, DualFailure } from '../result/failure';
import { Result, succeed, fail } from '../result';

/**
 * Precondition (async).
 */
export type Precondition<A, B> = (a: A) => Future<Result<A, B>>;

/**
 * Preconditions map (async).
 */
export interface Preconditions<A, B> {

    [key: string]: Precondition<A, B>

}

/**
 * async wraps a sync api function so it can be used with other async 
 * functions.
 */
export const async = <A, B>(p: sync.Precondition<A, B>)
    : Precondition<A, B> => (a: A) => pure(p(a));

/**
 * or (async).
 */
export const or = <A, B>(l: Precondition<A, B>, r: Precondition<A, B>)
    : Precondition<A, B> => (value: A) =>
        l(value).chain(e =>            e.fold<Future<Result<A, B>>>(orFail(value, r), orSucc));

const orFail = <A, B>(value: A, r: Precondition<A, B>) => (f: Failure<A>) =>
    r(value).map(e2 => e2.lmap((f2): Failure<A> => new DualFailure(value, f, f2)));

const orSucc = <A, B>(v: B) => pure(succeed<A, B>(v));

/**
 * and (async).
 *
 * TODO: using the any type until Either is fixed in afpl.
 */
export const and = <A, B, C>(l: Precondition<A, B>, r: Precondition<B, C>)
    : Precondition<A, C> => (value: A) =>
        l(value).chain(e => {

            if (e instanceof Left) {

                return pure(left<Failure<A>, C>(e.takeLeft()));

            } else {

                return r(e.takeRight())
                    .chain(e2 =>
                        pure((e2 instanceof Left) ?
                            left<Failure<A>, C>(MF.create(value, e2.takeLeft())) :
                            right<Failure<A>, C>(e2.takeRight())));

            }

        });

/**
 * every (async).
 */
export const every = <A, B>(p: Precondition<A, B>, ...list: Precondition<B, B>[])
    : Precondition<A, B> => (value: A) =>
        p(value)
            .chain((r: Result<A, B>) => {

                if (r instanceof Left)
                    return pure(left<Failure<A>, B>(r.takeLeft()));

                return list.reduce((p: Future<Result<B, B>>, c) =>
                    p.chain(e => (e instanceof Left) ?
                        pure(<Result<B, B>>e) :
                        c(e.takeRight())),
                    pure(right<Failure<B>, B>(r.takeRight())))
                    .chain((e: Result<B, B>) =>
                        (e instanceof Left) ?
                            pure(left<Failure<A>, B>(MF.create(value, e.takeLeft()))) :
                            pure(right<Failure<A>, B>(e.takeRight())));

            });



/**
 * optional (async).
 */
export const optional = <A, B>(p: Precondition<A, A | B>)
    : Precondition<A, A | B> => (value: A) =>
        isNon(value) ?
            pure(succeed<A, A | B>(value)) :
            p(value);

const isNon = <A>(value: A): boolean =>
    ((value == null) || (typeof value === 'string' && value === ''));

/**
 * caseOf (async).
 */
export const caseOf = <A, B>(t: Pattern, p: Precondition<A, B>)
    : Precondition<A, B> => (value: A) => test(value, t) ?
        p(value) :
        pure(fail<A, B>('caseOf', value, { type: t }));

/**
 * match (async version).
 */
export const match = <A, B>(p: Precondition<A, B>, ...list: Precondition<A, B>[])
    : Precondition<A, B> => (value: A) =>
        list.reduce((pe, f) =>
            pe
                .chain((e: Result<A, B>) => (e instanceof Right) ?
                    pure(<Result<A, B>>e) :
                    pure(e.takeLeft())
                        .chain((r: Failure<A>) => (r.message === 'caseOf') ?
                            f(value) :
                            pure(fail<A, B>(r.message, value, r.context)))), p(value));

/**
 * identity precondtion.
 *
 * Succeeds with whatever value is passed.
 */
export const identity = <A>(value: A) => pure(succeed<A, A>(value));

export const id = identity;

/**
 * reject always fails with reason no matter the value supplied.
 */
export const reject = <A>(reason: string): Precondition<A, A> => (value: A) =>
    pure(fail<A, A>(reason, value));

/**
 * log the value to the console.
 */
export const log = <A>(value: A): Result<A, A> =>
    (console.log(value), succeed(value));
