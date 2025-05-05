/**
 * The promise module provides primitives for async preconditions
 * via bluebirds Promise API.
 */
import * as sync from '../';

import { test, Type } from '@quenk/noni/lib/data/type';
import { Future, parallel, pure } from '@quenk/noni/lib/control/monad/future';
import { Right, Left, left, right } from '@quenk/noni/lib/data/either';
import { Record } from '@quenk/noni/lib/data/record';

import { Failure, ModifiedFailure as MF, DualFailure } from '../result/failure';
import { Result, succeed, fail } from '../result';

/**
 * AsyncPrecondition (async).
 */
export type AsyncPrecondition<A, B> = (a: A) => Future<Result<A, B>>;

/**
 * AsyncPreconditions map (async).
 */
export type AsyncPreconditions<A, B> = Record<AsyncPrecondition<A, B>>;

// @deprecated
export {
    AsyncPrecondition as Precondition,
    AsyncPreconditions as Preconditions
};

/**
 * lift a sync precondition into an async one.
 */
export const lift =
    <A, B>(p: sync.Precondition<A, B>): AsyncPrecondition<A, B> =>
    (a: A) =>
        pure(p(a));

// @deprecated
export { lift as async };

/**
 * or (async).
 */
export const or =
    <A, B>(
        l: AsyncPrecondition<A, B>,
        r: AsyncPrecondition<A, B>
    ): AsyncPrecondition<A, B> =>
    (value: A) =>
        l(value).chain(e =>
            e.fold<Future<Result<A, B>>>(orFail(value, r), orSucc)
        );

const orFail =
    <A, B>(value: A, r: AsyncPrecondition<A, B>) =>
    (f: Failure<A>) =>
        r(value).map(e2 =>
            e2.lmap((f2): Failure<A> => new DualFailure(value, f, f2))
        );

const orSucc = <A, B>(v: B) => pure(succeed<A, B>(v));

/**
 * and (async).
 *
 * TODO: using the any type until Either is fixed in afpl.
 */
export const and =
    <A, B, C>(
        l: AsyncPrecondition<A, B>,
        r: AsyncPrecondition<B, C>
    ): AsyncPrecondition<A, C> =>
    (value: A) =>
        l(value).chain(e => {
            if (e instanceof Left) {
                return pure(left<Failure<A>, C>(e.takeLeft()));
            } else {
                return r(e.takeRight()).chain(e2 =>
                    pure(
                        e2 instanceof Left
                            ? left<Failure<A>, C>(
                                  MF.create(value, e2.takeLeft())
                              )
                            : right<Failure<A>, C>(e2.takeRight())
                    )
                );
            }
        });

/**
 * every (async).
 */
export const every =
    <A, B>(
        p: AsyncPrecondition<A, B>,
        ...list: AsyncPrecondition<B, B>[]
    ): AsyncPrecondition<A, B> =>
    (value: A) =>
        p(value).chain((r: Result<A, B>) => {
            if (r instanceof Left)
                return pure(left<Failure<A>, B>(r.takeLeft()));

            return list
                .reduce(
                    (p: Future<Result<B, B>>, c) =>
                        p.chain(e =>
                            e instanceof Left
                                ? pure(<Result<B, B>>e)
                                : c(e.takeRight())
                        ),
                    pure(right<Failure<B>, B>(r.takeRight()))
                )
                .chain((e: Result<B, B>) =>
                    e instanceof Left
                        ? pure(
                              left<Failure<A>, B>(
                                  MF.create(value, e.takeLeft())
                              )
                          )
                        : pure(right<Failure<A>, B>(e.takeRight()))
                );
        });

/**
 * optional (async).
 */
export const optional =
    <A, B>(p: AsyncPrecondition<A, A | B>): AsyncPrecondition<A, A | B> =>
    (value: A) =>
        isNon(value) ? pure(succeed<A, A | B>(value)) : p(value);

const isNon = <A>(value: A): boolean =>
    value == null || (typeof value === 'string' && value === '');

/**
 * caseOf (async).
 */
export const caseOf =
    <A, B>(t: Type, p: AsyncPrecondition<A, B>): AsyncPrecondition<A, B> =>
    (value: A) =>
        test(value, t)
            ? p(value)
            : pure(fail<A, B>('caseOf', value, { type: t }));

/**
 * match (async version).
 */
export const match =
    <A, B>(
        p: AsyncPrecondition<A, B>,
        ...list: AsyncPrecondition<A, B>[]
    ): AsyncPrecondition<A, B> =>
    (value: A) =>
        list.reduce(
            (pe, f) =>
                pe.chain((e: Result<A, B>) =>
                    e instanceof Right
                        ? pure(<Result<A, B>>e)
                        : pure(e.takeLeft()).chain((r: Failure<A>) =>
                              r.message === 'caseOf'
                                  ? f(value)
                                  : pure(
                                        fail<A, B>(r.message, value, r.context)
                                    )
                          )
                ),
            p(value)
        );

/**
 * identity precondtion.
 *
 * Succeeds with whatever value is passed.
 */
export const identity = <A>(value: A) => pure(succeed<A, A>(value));

export const id = identity;

/**
 * discard (async).
 */
export const discard = <A>(_: A) => pure(succeed<A, undefined>(undefined));

/**
 * reject always fails with reason no matter the value supplied.
 */
export const reject =
    <A>(reason: string): AsyncPrecondition<A, A> =>
    (value: A) =>
        pure(fail<A, A>(reason, value));

/**
 * log the value to the console.
 */
export const log = <A>(value: A): Result<A, A> => (
    console.log(value), succeed(value)
);

/**
 * tee (async version)
 *
 * See sync version for description.
 */
export const tee =
    <A, B>(precs: AsyncPrecondition<A, B>[]): AsyncPrecondition<A, B[]> =>
    (value: A) =>
        Future.do(async () => {
            let finalResults = [];
            let results = await parallel(precs.map(prec => prec(value)));
            for (let result of results) {
                if (result.isLeft()) return <Result<A, B[]>>(<unknown>result);

                finalResults.push(result.takeRight());
            }

            return succeed<A, B[]>(finalResults);
        });
