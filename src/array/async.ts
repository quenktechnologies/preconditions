import * as Promise from 'bluebird';
import * as sync from './';
import { merge } from 'afpl/lib/util';
import { Failure } from '../';
import { Precondition, success } from '../async';
import { Contexts, Failures } from '../object';
import { ArrayFailure } from './ArrayFailure';
import { Either } from 'afpl/lib/monad/Either';
import { Result as SyncResult, left } from '../';

export { Either, success };

/**
 * @private
 */
export type Reports<M, V> = Promise<sync.Reports<M, V>>

/**
 * failure
 */
export const failure =
    <A, B>(errors: Failures<A>, value: A[], contexts: Contexts) =>
        Promise.resolve(left<ArrayFailure<A>, B[]>(new ArrayFailure(errors, value, contexts)));

/**
 * filter (async version).
 */
export const filter = <A, B>(p: Precondition<A, B>): Precondition<A[], B[]> =>
    (value: A[]) =>
        Promise
            .all(value.map(p))
            .then(results =>
                Promise
                    .resolve(
                    results
                        .map((r: SyncResult<A, B>) =>
                            r
                                .orRight((): null => null)
                                .takeRight())
                        .filter(b => b != null)))
            .then(values => success<A[], B[]>(values));

/**
 * map (async version).
 */
export const map =
    <A, B>(p: Precondition<A, B>): Precondition<A[], B[]> =>
        (value: A[]) =>
            Promise
                .all(value.map(p))
                .then(results => results
                    .reduce(([fails, succs]: [Failures<A>, B[]], curr: SyncResult<A, B>, key) =>
                        curr.cata(
                            (f: Failure<A>) => [merge(fails, { [key]: f }), succs],
                            (b: B) => [fails, succs.concat(b)]), [<Failures<A>>{}, <B[]>[]]))

                .then(([fails, succs]: [Failures<A>, B[]]) => Object.keys(fails).length > 0 ?
                    failure<A, B>(fails, value, { value }) :
                    success<A[], B[]>(succs));


