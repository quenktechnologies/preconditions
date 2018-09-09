import * as Promise from 'bluebird';
import { merge } from '@quenk/noni/lib/data/record';
import { left, either } from '@quenk/noni/lib/data/either';
import { Reports as SyncReports } from '../array/result';
import { Contexts, Failures } from '../record/result';
import { Failure } from '../array/result';
import { Failure as F } from '../result';
import { Precondition } from '../async';
import { Result as SyncResult } from '../result';
import { success } from './result';

/**
 * @private
 */
export type Reports<M, V> = Promise<SyncReports<M, V>>

/**
 * failure
 */
export const failure =
    <A, B>(errors: Failures<A>, value: A[], contexts: Contexts) =>
        Promise.resolve(left<Failure<A>, B[]>(new Failure(errors, value, contexts)));

/**
 * filter (async version).
 */
export const filter =
    <A, B>(p: Precondition<A, B>): Precondition<A[], B[]> => (value: A[]) =>
        Promise
            .all(value.map(p))
            .then(results =>
                Promise
                    .resolve(
                        results
                            .map((r: SyncResult<A, B>) =>
                                r
                                    .orRight((): any => null)
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
                      either<any,any,any>((f: F<A>) => [merge(fails, { [key]: f }), succs])
                            ((b: B) => [fails, succs.concat(b)])
                            (curr), [<Failures<A>>{}, <B[]>[]]))
                .then(([fails, succs]: [Failures<A>, B[]]) => Object.keys(fails).length > 0 ?
                    failure<A, B>(fails, value, { value }) :
                    success<A[], B[]>(succs));
