import * as afpl from 'afpl';
import * as Async from './Async';
export { Async };
/**
 * Precondition represents some condition that must be satisfied
 * in order for data to be considered valid.
 *
 * Implement it to validate, filter or transform input.
 */
export interface Precondition<A, B> {
    /**
     * apply this Precondition
     * Returning an instance of Error indicates the Precondition failed.
     */
    apply(value: A): Result<A, B>;
}
/**
 * Result is the result of a precondition.
 */
export declare type Result<A, B> = afpl.Either<Failure<A>, B>;
/**
 * Failures is a map of Failures.
 */
export interface Failures<A> {
    [key: string]: Failure<A>;
}
/**
 * Failure means a precondition did not go so well.
 */
export declare class Failure<A> {
    message: string;
    value: A;
    context: Context;
    constructor(message: string, value?: A, context?: Context);
    expand(templates?: {
        [key: string]: string;
    }, c?: Context): Expansion;
}
/**
 * Contexts is a map of Contexts.
 */
export interface Contexts {
    [key: string]: Context;
}
/**
 * Context of a failure, used to expand error messages.
 */
export interface Context {
    [key: string]: any;
}
export declare type Expansion = string | object;
export declare class ListFailure<A> extends Failure<A[]> {
    failures: Failures<A>;
    value: A[];
    contexts: Contexts;
    constructor(failures: Failures<A>, value: A[], contexts?: Contexts);
    expand(templates?: {
        [key: string]: string;
    }, c?: Context): Expansion;
}
/**
 * MapFailure is contains info on failures that occured while applying preconditions.
 */
export declare class MapFailure<A> extends Failure<Values<A>> {
    failures: Failures<A>;
    value: Values<A>;
    contexts: Contexts;
    constructor(failures: Failures<A>, value: Values<A>, contexts?: Contexts);
    expand(templates?: {
        [key: string]: string;
    }, c?: Context): Expansion;
}
/**
 * Values is the map of values to apply the preconditions to.
 */
export interface Values<A> {
    [key: string]: A;
}
export interface Reports<A, B> {
    failures: Failures<A>;
    values: Values<B>;
}
/**
 * A map of key precondition pairs
 */
export interface Preconditions<A, B> {
    [key: string]: Precondition<A, B>;
}
export declare class Func<A, B> implements Precondition<A, B> {
    f: (value: A) => Result<A, B>;
    constructor(f: (value: A) => Result<A, B>);
    apply(value: A): Result<A, B>;
}
/**
 * Map of preconditions.
 *
 * A map applies a precondition for each property declared on it.
 * Do not declare any key values that do not implement Precondition.
 */
export declare class Map<A, B> implements Precondition<Values<A>, Values<B>> {
    getConditions(): Preconditions<A, B>;
    apply(value: Values<A>): Result<Values<A>, Values<B>>;
}
/**
 * Hash is like Map except you specify the preconditions by passing
 * a plain old javascript object.
 */
export declare class Hash<A, B> extends Map<A, B> {
    conditions: Preconditions<A, B>;
    constructor(conditions: Preconditions<A, B>);
    getConditions(): Preconditions<A, B>;
}
export declare const left: <A, B>(a: A) => afpl.Either<A, B>;
export declare const right: <A, B>(b: B) => afpl.Either<A, B>;
export declare const fail: <A, B>(m: string, v: A, ctx?: Context) => afpl.Either<Failure<A>, B>;
export declare const mapFail: <A, B>(e: Failures<A>, v: Values<A>, c?: Contexts) => afpl.Either<MapFailure<A>, B>;
export declare const valid: <A, B>(b: B) => afpl.Either<Failure<A>, B>;
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
/**
 * decide does evaluates condition and decides
 * whether to return left if true or right if false.
 *
 * The evaluation is done before apply is called.
 */
export declare const decide: <A, B>(condition: boolean, left: Precondition<A, B>, right: Precondition<A, B>) => Precondition<A, B>;
/**
 * number tests if the value supplied is a number.
 */
export declare const number: () => Precondition<{}, {}>;
/**
 * string tests if the value is a string.
 */
export declare const string: <A>() => Precondition<{}, {}>;
/**
 * list tests if the value is an array.
 */
export declare const list: <A>() => Precondition<{}, {}>;
/**
 * each applies a precondition for each member of an array.
 */
export declare const each: <A, B>(p: Precondition<A, B>) => Precondition<{}, any>;
/**
 * object tests if the value is a js object.
 */
export declare const object: <A>() => Precondition<{}, {}>;
/**
 * matches tests if the value satisfies a regular expression.
 */
export declare const matches: (pattern: RegExp) => Precondition<{}, {}>;
/**
 * range tests if a string, number or array falls within a range
 */
export declare const range: <A>(min: number, max: number) => Precondition<{}, {}>;
/**
 * equals tests if the value is equal to the value specified (strictly).
 */
export declare const equals: <A, B>(target: B) => Precondition<{}, {}>;
/**
 * notNull requires a value to be specified
 */
export declare const notNull: <A>() => Precondition<{}, {}>;
/**
 * isin requires the value to be enumerated in the supplied list.
 */
export declare const isin: <A>(list: A[]) => Precondition<{}, {}>;
/**
 * nullable tests whether the value is null or undefined.
 * @returns {Predicate}
 */
export declare const nullable: <A>() => Precondition<{}, A>;
/**
 * length tests if the value is of a certain length.
 */
export declare const length: <A>(len: number) => Precondition<{}, {}>;
