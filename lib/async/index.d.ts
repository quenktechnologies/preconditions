/**
 * The promise module provides primitives for async preconditions
 * via bluebirds Promise API.
 */
import * as sync from '../';
import { Pattern } from '@quenk/noni/lib/data/type';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Failure } from '../result/failure';
import { Result } from '../result';
/**
 * Precondition (async).
 */
export declare type Precondition<A, B> = (a: A) => Future<Result<A, B>>;
/**
 * Preconditions map (async).
 */
export interface Preconditions<A, B> {
    [key: string]: Precondition<A, B>;
}
/**
 * async wraps a sync api function so it can be used with other async
 * functions.
 */
export declare const async: <A, B>(p: sync.Precondition<A, B>) => Precondition<A, B>;
/**
 * or (async).
 */
export declare const or: <A, B>(l: Precondition<A, B>, r: Precondition<A, B>) => Precondition<A, B>;
/**
 * and (async).
 *
 * TODO: using the any type until Either is fixed in afpl.
 */
export declare const and: <A, B, C>(l: Precondition<A, B>, r: Precondition<B, C>) => Precondition<A, C>;
/**
 * every (async).
 */
export declare const every: <A, B>(p: Precondition<A, B>, ...list: Precondition<B, B>[]) => Precondition<A, B>;
/**
 * optional (async).
 */
export declare const optional: <A, B>(p: Precondition<A, A | B>) => Precondition<A, A | B>;
/**
 * caseOf (async).
 */
export declare const caseOf: <A, B>(t: Pattern<A>, p: Precondition<A, B>) => Precondition<A, B>;
/**
 * match (async version).
 */
export declare const match: <A, B>(p: Precondition<A, B>, ...list: Precondition<A, B>[]) => Precondition<A, B>;
/**
 * identity precondtion.
 *
 * Succeeds with whatever value is passed.
 */
export declare const identity: <A>(value: A) => Future<import("@quenk/noni/lib/data/either").Either<Failure<A>, A>>;
export declare const id: <A>(value: A) => Future<import("@quenk/noni/lib/data/either").Either<Failure<A>, A>>;
/**
 * discard (async).
 */
export declare const discard: any;
/**
 * reject always fails with reason no matter the value supplied.
 */
export declare const reject: <A>(reason: string) => Precondition<A, A>;
/**
 * log the value to the console.
 */
export declare const log: <A>(value: A) => import("@quenk/noni/lib/data/either").Either<Failure<A>, A>;
