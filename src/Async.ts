import * as afpl from 'afpl';
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

    [key: string]: Precondition<A, B>

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
    (value: A): Result<A, B>

}

/**
 * Result async.
 */
export type Result<A, B> = Promise<Sync.Result<A, B>>

/**
 * @private
 */
export type Reports<A, B> = Promise<Sync.Reports<A, B>>

/**
 * fail async
 */
export const fail: <A, B>(m: string, v: A, ctx?: Sync.Context) =>
    Promise<Either<Sync.Failure<A>, B>> =
    <A, B>(message: string, value: A, ctx: Sync.Context = {}) =>
        Promise.resolve(Sync.fail<A, B>(message, value, ctx));

/**
 * mapFail async
 */
export const mapFail =
    <A extends Sync.Values<V>, V, B>(
        errors: Sync.Failures<V>,
        value: A,
        contexts: Sync.Contexts = {}) =>
        Promise.resolve(Sync.mapFail<A, V, B>(errors, value, contexts));

/**
 * valid async
 */
export const valid: <A, B>(b: B) => Promise<Either<Sync.Failure<A>, B>> =
    <A, B>(b: B) => Promise.resolve(Sync.valid<A, B>(b))

/**
 * map async
 */
export const map = <A extends Sync.Values<AB>, AB, B>(conditions: Preconditions<AB, AB>) =>
    (value: A) => {

        let init: Reports<AB, AB> =
            Promise.resolve({ failures: {}, values: {} });

        if (typeof value !== 'object') {

            return Promise.resolve(Sync.fail<A, B>('invalid', value));

        } else {

            return afpl.util.reduce(conditions, (
                p: Reports<AB, AB>,
                f: Precondition<AB, AB>,
                key: string) =>
                p.then((r: Sync.Reports<AB, AB>) =>
                    f(value[key])
                        .then((e: Sync.Result<AB, AB>) =>
                            Promise.resolve(e.cata(Sync.whenLeft(key, r),
                                Sync.whenRight(key, r))))), init)
                .then((r: Sync.Reports<AB, AB>) => {

                    if (Object.keys(r.failures).length > 0)
                        return Promise.resolve(Sync.mapFail<A, AB, B>(r.failures, value));
                    else
                        return Promise
                            .resolve(Sync.valid<A, B>(<B><any>r.values));

                });

        }
    }

/**
 * partial async
 */
export const partial = <A extends Sync.Values<AB>, AB, B>(conditions: Preconditions<AB, AB>)
    : Precondition<A, B> =>
    (value: A) => {

        let init: Reports<AB, AB> =
            Promise.resolve({ failures: {}, values: {} });


        if (typeof value !== 'object') {

            return Promise.resolve(Sync.fail<A, B>('invalid', value));

        } else {

            return afpl.util.reduce(value,
                (p: Reports<AB, AB>, x: AB, key: string) =>
                    p
                        .then((r: Sync.Reports<AB, AB>) =>
                            conditions.hasOwnProperty(key) ?

                                conditions[key](x)
                                    .then((e: Sync.Result<AB, AB>) =>
                                        Promise.resolve(
                                            e.cata(Sync.whenLeft(key, r),
                                                Sync.whenRight(key, r)))) :

                                Promise.resolve(r)), init)

                .then((r: Sync.Reports<AB, AB>) => {

                    if (Object.keys(r.failures).length > 0)
                        return Promise.resolve(Sync.mapFail<A, AB, B>(r.failures, value));
                    else
                        return Promise
                            .resolve(Sync.valid<A, B>(<B><any>r.values));

                });

        }
    }

/**
 * or async
 */
export const or = <A, B>(left: Precondition<A, B>, right: Precondition<A, B>) =>
    (value: A) => left(value).then(e =>
        e.cata(() => right(value), valid))

/**
 * and async
 */
export const and = <A, B>(left: Precondition<A, A>, right: Precondition<A, B>) =>
    (value: A) => left(value).then(e => e.cata(Promise.resolve, v => right(v)))

/**
 * async wraps the sync api so we can apply asynchronous tests.
 */
export const async = <A, B>(s: Sync.Precondition<A, B>) =>
    (value: A) => s(value).cata(Promise.resolve, Promise.resolve);
