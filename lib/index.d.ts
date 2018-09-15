import { Result, Failure } from './result';
/**
 * Precondition represents some condition that must be satisfied
 * in order for data to be considered a valid type.
 *
 * A Precondition accepts a value of type <A> and returns an Either
 * where the left side contains information about why the precondition
 * failed and the right the resulting type.
 */
export declare type Precondition<A, B> = (value: A) => Result<A, B>;
/**
 * Type is used by caseOf to pattern match a value.
 */
export declare type Type<T> = string | number | boolean | object | {
    [key: string]: any;
} | {
    new (): T;
};
/**
 * left wraps a value in the left side of an Either
 */
/**
 * right wraps a value in the right side of an Either
 */
/**
 * set the value to the supplied value.
 */
export declare const set: <A, B>(b: B) => Precondition<A, B>;
export declare const cons: <A, B>(b: B) => Precondition<A, B>;
/**
 * when conditionally applies one of two preconditions depending
 * on the outcome of a test function.
 */
export declare const when: <A, B>(test: (a: A) => boolean, applied: Precondition<A, B>, otherwise: Precondition<A, B>) => Precondition<A, B>;
/**
 * whenTrue conditionally applies "applied" or "otherwise" depending
 * on whether "condition" is true or not.
 */
export declare const whenTrue: <A, B>(condition: boolean, applied: Precondition<A, B>, otherwise: Precondition<A, B>) => Precondition<A, B>;
/**
 * whenFalse (opposite of whenTrue).
 */
export declare const whenFalse: <A, B>(condition: boolean, applied: Precondition<A, B>, otherwise: Precondition<A, B>) => Precondition<A, B>;
/**
 * equals tests if the value is equal (strictly) to the value specified.
 */
export declare const equals: <A, B>(target: B) => Precondition<A, B>;
/**
 * notNull will fail if the value is null or undefined.
 */
export declare const notNull: <A>(value: A) => import("@quenk/noni/lib/data/either").Either<Failure<A>, A>;
/**
 * optional applies the precondition given only if the value is not null
 * or undefined.
 */
export declare const optional: <A, B>(p: Precondition<A, A | B>) => Precondition<A, A | B>;
/**
 * identity always succeeds with the value it is applied to.
 */
export declare const identity: <A>(value: A) => import("@quenk/noni/lib/data/either").Either<Failure<A>, A>;
export declare const id: <A>(value: A) => import("@quenk/noni/lib/data/either").Either<Failure<A>, A>;
/**
 * fail always fails with reason no matter the value supplied.
 */
export declare const fail: <A, B>(reason: string) => Precondition<A, B>;
/**
 * or performs the equivalent of a logical 'or' between two preconditions.
 */
export declare const or: <A, B>(left: Precondition<A, B>, right: Precondition<A, B>) => Precondition<A, B>;
/**
 * and performs the equivalent of a logical 'and' between two preconditions.
 */
export declare const and: <A, B>(l: Precondition<A, A>, r: Precondition<A, B>) => Precondition<A, B>;
/**
 * every takes a set of preconditions and attempts to apply each
 * one after the other to the input.
 */
export declare const every: <A, B>(p: Precondition<A, B>, ...list: Precondition<B, B>[]) => Precondition<A, B>;
/**
 * exists requires the value to be enumerated in the supplied list.
 */
export declare const exists: <A>(list: A[]) => Precondition<A, A>;
/**
 * isin requires the value passed to be a member of a provided list.
 */
export declare const isin: <A>(list: A[]) => Precondition<A, A>;
/**
 * match preforms a type/structure matching on the input
 * value in order to decide which precondition to apply.
 *
 * Preconditions must be wrapped in a 'caseOf' precondition.
 */
export declare const match: <A, B>(p: Precondition<A, B>, ...list: Precondition<A, B>[]) => Precondition<A, B>;
/**
 * caseOf allows for the selective application of a precondition
 * based on the type or structure of the value.
 *
 * Pattern matching works as follows:
 * string -> Matches on the value of the string.
 * number -> Matches on the value of the number.
 * boolean -> Matches on the value of the boolean.
 * object -> Each key of the object is matched on the value, all must match.
 * function -> Treated as a constructor and results in an instanceof check.
 *             For String,Number and Boolean, this uses the typeof check.
 */
export declare const caseOf: <A, B>(t: Type<A>, p: Precondition<A, B>) => Precondition<A, B>;
/**
 * log the value to the console.
 */
export declare const log: <A>(value: A) => import("@quenk/noni/lib/data/either").Either<Failure<A>, A>;
