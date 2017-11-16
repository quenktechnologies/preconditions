import * as Async from './Async';
import { Either } from 'afpl';
export { Async };
/**
 * Precondition represents some condition that must be satisfied
 * in order for data to be considered a valid type.
 *
 * The left type class represents the original type and the
 * right the final one.
 */
export interface Precondition<A, B> {
    (value: A): Result<A, B>;
}
/**
 * Result of a precondition.
 */
export declare type Result<A, B> = Either<Failure<A>, B>;
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
    explain(templates?: {
        [key: string]: string;
    }, c?: Context): Explanation;
}
/**
 * Contexts is a map of Contexts.
 */
export interface Contexts {
    [key: string]: Context;
}
/**
 * Context of a failure, used to explain error messages.
 */
export interface Context {
    [key: string]: any;
}
/**
 * Explanation of what wen wrong with a Precondition.
 */
export declare type Explanation = string | object;
export declare class ListFailure<A> extends Failure<A[]> {
    failures: Failures<A>;
    value: A[];
    contexts: Contexts;
    constructor(failures: Failures<A>, value: A[], contexts?: Contexts);
    explain(templates?: {
        [key: string]: string;
    }, c?: Context): Explanation;
}
/**
 * MapFailure is contains info on failures that occured while applying preconditions.
 */
export declare class MapFailure<A extends Values<V>, V> extends Failure<A> {
    failures: Failures<V>;
    value: A;
    contexts: Contexts;
    constructor(failures: Failures<V>, value: A, contexts?: Contexts);
    explain(templates?: {
        [key: string]: string;
    }, c?: Context): Explanation;
}
/**
 * Values is a map of values to apply a map {@link Precondition} to.
 */
export interface Values<V> {
    [key: string]: V;
}
/**
 * @private
 */
export interface Reports<M, V> {
    failures: Failures<M>;
    values: Values<V>;
}
/**
 * A map of key precondition pairs.
 *
 * The right type class should be the union
 * of all possible values (or any) and the
 * right th union of all possible outcomes.
 */
export interface Preconditions<A, B> {
    [key: string]: Precondition<A, B>;
}
/**
 * @private
 */
export declare const whenLeft: <M, V>(key: string, {failures, values}: Reports<M, V>) => (f: Failure<M>) => {
    values: Values<V>;
    failures: Failures<M>;
};
/**
 * @private
 */
export declare const whenRight: <M, V>(key: string, {failures, values}: Reports<M, V>) => (v: V) => {
    failures: Failures<M>;
    values: Values<V>;
};
/**
 * left wraps a value in the left side of an Either
 */
export declare const left: <A, B>(a: A) => Either<A, B>;
/**
 * right wraps a value in the right side of an Either
 */
export declare const right: <A, B>(b: B) => Either<A, B>;
/**
 * fail produces a new one to one Failure instance wrapped
 * in the left side of an Either.
 */
export declare const fail: <A, B>(message: string, value: A, ctx?: Context) => Either<Failure<A>, B>;
/**
 * mapFail produces a new MapFailure wrapped in the left side
 * of an Either from a map (object) of failures.
 */
export declare const mapFail: <A extends Values<V>, V, B>(errors: Failures<V>, value: A, contexts?: Contexts) => Either<MapFailure<A, V>, B>;
/**
 * listFail produces a new ListFailure wrapped in the left side
 * of an Either
 */
export declare const listFail: <A, B>(errors: Failures<A>, value: A[], contexts?: Contexts) => Either<ListFailure<A>, B[]>;
/**
 * valid signals a precondition has passed and wraps the latest
 * version of the value in the left side of an Either.
 */
export declare const valid: <A, B>(b: B) => Either<Failure<A>, B>;
/**
 * map accepts a javascript object whose properties are all preconditions
 * and returns a function that will apply each to the corresponding key.
 *
 * The A type class is the type of values the passed object is expected to
 * have and the B the resulting object/interface we get when all preconditions
 * pass.
 */
export declare const map: <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>) => Precondition<A, B>;
/**
 * partial is like map except it only applies to keys that exists
 * on the passed value.
 */
export declare const partial: <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>) => (value: A) => Either<Failure<A>, B>;
/**
 * or
 */
export declare const or: <A, B>(left: Precondition<A, B>, right: Precondition<A, B>) => Precondition<A, B>;
/**
 * and
 */
export declare const and: <A, B>(l: Precondition<A, A>, r: Precondition<A, B>) => Precondition<A, B>;
/**
 * every takes a set of preconditions and attempts to apply all
 * one after the other to the input
 */
export declare const every: <A, B>(p: Precondition<A, B>, ...list: Precondition<B, B>[]) => Precondition<A, B>;
/**
 * set the value to the value specified, no matter what
 */
export declare const set: <A, B>(b: B) => Precondition<A, B>;
/**
 * populated tests if an array or object is populated.
 */
export declare const populated: <A>(value: A) => Either<Failure<A>, A>;
/**
 * whenTrue does evaluates condition and decides
 * whether to return left if false or right if true.
 *
 * The evaluation is done before apply is called.
 */
export declare const whenTrue: <A, B>(condition: boolean, left: Precondition<A, B>, right: Precondition<A, B>) => Precondition<A, B>;
/**
 * each applies a precondition for each member of an array.
 */
export declare const each: <A, B>(p: Precondition<A, B>) => Precondition<A[], B[]>;
/**
 * matches tests if the value satisfies a regular expression.
 */
export declare const matches: (pattern: RegExp) => Precondition<string, string>;
export declare type Measureable = string | number | any[];
/**
 * range tests whether the length of an array, string or number falls within a range.
 */
export declare const range: <A extends Measureable>(min: number, max: number) => Precondition<A, A>;
/**
 * equals tests if the value is equal to the value specified (strictly).
 */
export declare const equals: <A, B>(target: B) => Precondition<A, B>;
/**
 * required requires a value to be specified
 */
export declare const required: <A>(value: A) => Either<Failure<A>, {}> | Either<Failure<{}>, A>;
/**
 * optional applies the tests given only if the value is != null
 */
export declare const optional: <A, B>(p: Precondition<A, A | B>) => Precondition<A, A | B>;
/**
 * upper transforms a string into uppercase
 */
export declare const upper: (s: string) => Either<Failure<string>, string>;
/**
 * lower transforms a string into lowercase
 */
export declare const lower: (s: string) => Either<Failure<string>, string>;
export declare const trim: (s: string) => Either<Failure<string>, string>;
/**
 * number tests if a value is a number
 */
export declare const number: <A>(n: A) => Either<Failure<A>, number>;
/**
 * string tests if a value is a string
 */
export declare const string: <A>(a: A) => Either<Failure<A>, string>;
/**
 * array tests if the value is an array
 */
export declare const array: <A, B>(a: A) => Either<Failure<A>, B[]>;
/**
 * object tests if the value is an js object.
 */
export declare const object: <A>(value: A) => Either<Failure<A>, A>;
/**
 * isin requires the value to be enumerated in the supplied list.
 */
export declare const isin: <A>(list: A[]) => Precondition<A, A>;
export declare const cast: <A, B>(f: (a: A) => B) => Precondition<A, B>;
