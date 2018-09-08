/**
 * The promise module provides primitives for async preconditions
 * via bluebirds Promise API.
 */
import * as sync from '../';
import * as Promise from 'bluebird';
import { Pattern } from '@quenk/kindof';
import { Failure as SyncFailure } from '../failure';
import { Result } from './failure';
/**
 * Precondition (async version).
 */
export declare type Precondition<A, B> = (a: A) => Result<A, B>;
/**
 * async wraps the sync api so they can be used with async preconditions safely.
 */
export declare const async: <A, B>(p: sync.Precondition<A, B>) => (a: A) => Promise<import("@quenk/noni/lib/data/either").Either<SyncFailure<A>, B>>;
/**
 * or (async version).
 */
export declare const or: <A, B>(left: Precondition<A, B>, right: Precondition<A, B>) => Precondition<A, B>;
/**
 * and (async version).
 *
 * TODO: using the any type until Either is fixed in afpl.
 */
export declare const and: <A, B, C>(l: Precondition<A, B>, r: Precondition<B, C>) => Precondition<A | B, C>;
/**
 * every (async version).
 */
export declare const every: <A, B>(p: Precondition<A, B>, ...list: Precondition<B, B>[]) => Precondition<A, B>;
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
 * identity precondtion.
 *
 * Succeeds with whatever value is passed.
 */
export declare const identity: <A>(value: A) => Promise<import("@quenk/noni/lib/data/either").Either<SyncFailure<A>, A>>;
export declare const id: <A>(value: A) => Promise<import("@quenk/noni/lib/data/either").Either<SyncFailure<A>, A>>;
/**
 * fail always fails with reason no matter the value supplied.
 */
export declare const fail: <A>(reason: string) => Precondition<A, A>;
/**
 * log the value to the console.
 */
export declare const log: <A>(value: A) => Promise<import("@quenk/noni/lib/data/either").Either<SyncFailure<{}>, A>>;
