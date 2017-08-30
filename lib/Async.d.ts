import * as afpl from 'afpl';
import * as Sync from './Map';
import * as Promise from 'bluebird';
/**
 * A map of key precondition pairs
 */
export interface Preconditions<A, B> {
    [key: string]: Precondition<A, B>;
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
    apply(value: A): Result<A, B>;
}
export declare type Result<A, B> = Promise<Sync.Result<A, B>>;
/**
 * And
 */
export declare class And<A, B> implements Precondition<A, B> {
    left: Precondition<A, A>;
    right: Precondition<A, B>;
    constructor(left: Precondition<A, A>, right: Precondition<A, B>);
    apply(value: A): Result<A, B>;
}
export declare class Func<A, B> implements Precondition<A, B> {
    f: (value: A) => Result<A, B>;
    constructor(f: (value: A) => Result<A, B>);
    apply(value: A): Result<A, B>;
}
export declare type Reports<A, B> = Promise<Sync.Reports<A, B>>;
/**
 * Map for async preconditions
 */
export declare class Map<A, B> implements Precondition<Sync.Values<A>, Sync.Values<B>> {
    getConditions(): Preconditions<A, B>;
    apply(value: Sync.Values<A>): Result<Sync.Values<A>, Sync.Values<B>>;
}
/**
 * Hash is like Map except you specify the preconditions by passing
 * a plain old javascript object.
 */
export declare class Hash<A, B> extends Map<A, B> {
    private conditions;
    constructor(conditions: Preconditions<A, B>);
    getConditions(): Preconditions<A, B>;
}
export declare const fail: <A, B>(m: string, v: A, ctx?: Sync.Context) => Promise<afpl.Either<Sync.Failure<A>, B>>;
export declare const mapFail: <A, B>(e: Sync.Failures<A>, v: Sync.Values<A>, c?: Sync.Contexts) => Promise<afpl.Either<Sync.MapFailure<A>, B>>;
export declare const valid: <A, B>(b: B) => Promise<afpl.Either<Sync.Failure<A>, B>>;
/**
 * func
 */
export declare const func: <A, B>(f: (value: A) => Result<A, B>) => Precondition<A, B>;
/**
 * or
 */
export declare const or: <A, B>(l: Precondition<A, B>, r: Precondition<A, B>) => Precondition<A, B>;
/**
 * and
 */
export declare const and: <A, B>(l: Precondition<A, A>, r: Precondition<A, B>) => Precondition<A, B>;
/**
 * set
 */
export declare const set: <A, B>(v: B) => Precondition<A, B>;
export declare const wrap: <A, B>(s: Sync.Precondition<A, B>) => Precondition<A, {}>;
