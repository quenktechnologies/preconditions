import * as afpl from 'afpl';
import * as Async from './Async';
export { Async };
/**
 * Precondition represents some condition that must be satisfied
 * in order for data to be considered a valid type.
 */
export interface Precondition<A, B> {
    (value: A): Result<A, B>;
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
export interface Values<V> {
    [key: string]: V;
}
export interface Reports<M, V> {
    failures: Failures<M>;
    values: Values<V>;
}
/**
 * A map of key precondition pairs
 */
export interface Preconditions<A, B> {
    [key: string]: Precondition<A, B>;
}
export declare const whenLeft: <M, V>(k: string, r: Reports<M, V>) => (f: Failure<M>) => Reports<M, V>;
export declare const whenRight: <M, V>(k: string, r: Reports<M, V>) => (v: V) => Reports<M, V>;
export declare const left: <A, B>(a: A) => afpl.Either<A, B>;
export declare const right: <A, B>(b: B) => afpl.Either<A, B>;
export declare const fail: <A, B>(m: string, v: A, ctx?: Context) => afpl.Either<Failure<A>, B>;
export declare const mapFail: <A, B>(e: Failures<A>, v: Values<A>, c?: Contexts) => afpl.Either<MapFailure<A>, B>;
export declare const valid: <A, B>(b: B) => afpl.Either<Failure<A>, B>;
/**
 * map accepts a javascript object whose properties are all preconditions
 * and returns a function that will apply each to input.
 */
export declare const map: <A, B>(conditions: Preconditions<any, any>) => Precondition<Values<A>, B>;
/**
 * partial is like map except it only applies to keys that exists
 */
export declare const partial: <A, B>(conditions: Preconditions<any, any>) => Precondition<Values<A>, B>;
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
 * whenTrue does evaluates condition and decides
 * whether to return left if false or right if true.
 *
 * The evaluation is done before apply is called.
 */
export declare const whenTrue: <A, B>(c: boolean, l: Precondition<A, B>, r: Precondition<A, B>) => (value: A) => Result<A, B>;
/**
 * number tests if the value supplied is a number.
 */
export declare const number: <A>() => Precondition<A, number>;
/**
 * string tests if the value is a string.
 */
export declare const string: () => Precondition<any, string>;
/**
 * list tests if the value is an array.
 */
export declare const list: <A, B>() => Precondition<A, B[]>;
/**
 * each applies a precondition for each member of an array.
 */
export declare const each: <A, B>(p: Precondition<A, B>) => Precondition<A[], B[]>;
/**
 * isin requires the value to be enumerated in the supplied list.
 */
export declare const isin: <A>(list: A[]) => Precondition<A, A>;
/**
 * object tests if the value is an js object.
 */
export declare const object: <A>() => Precondition<A, A>;
/**
 * matches tests if the value satisfies a regular expression.
 */
export declare const matches: (pattern: RegExp) => Precondition<string, string>;
/**
 * Measurable types.
 */
export declare type Measurable<A> = string | number | A[];
/**
 * range tests if a string, number or array falls within a range
 */
export declare const range: <A>(min: number, max: number) => Precondition<Measurable<A>, Measurable<A>>;
/**
 * equals tests if the value is equal to the value specified (strictly).
 */
export declare const equals: <A, B>(target: B) => Precondition<A, B>;
/**
 * required requires a value to be specified
 */
export declare const required: <A>() => Precondition<A, A>;
/**
 * optional applies the tests given only if the value is != null
 */
export declare const optional: <A, B>(t: Precondition<A, B>) => (v: A) => Precondition<A, B>;
