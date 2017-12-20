import { Failure } from './Failure';
import { Either } from 'afpl/lib/monad/Either';
export { Failure };
/**
 * Precondition represents some condition that must be satisfied
 * in order for data to be considered a success type.
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
 * Context of a failure, used to explain error messages.
 */
export interface Context {
    [key: string]: any;
}
/**
 * Explanation of what went wrong with a Precondition.
 */
export declare type Explanation = string | object;
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
export declare const left: <A, B>(a: A) => Either<A, B>;
/**
 * right wraps a value in the right side of an Either
 */
export declare const right: <A, B>(b: B) => Either<A, B>;
/**
 * failure produces a new one to one Failure instance wrapped
 * in the left side of an Either.
 */
export declare const failure: <A, B>(message: string, value: A, ctx?: Context) => Either<Failure<A>, B>;
/**
 * success signals a precondition has passed and wraps the latest
 * version of the value in the left side of an Either.
 */
export declare const success: <A, B>(b: B) => Either<Failure<A>, B>;
/**
 * set the value to the value specified, no matter what
 */
export declare const set: <A, B>(b: B) => Precondition<A, B>;
/**
 * when conditionally applies one of two preconditions depending
 * on the outcome of a test function.
 */
export declare const when: <A, B>(test: (a: A) => boolean, applied: Precondition<A, B>, otherwise: Precondition<A, B>) => Precondition<A, B>;
/**
 * whenTrue conditionally applies applied or otherwise depending
 * on whether condition is true or not.
 */
export declare const whenTrue: <A, B>(condition: boolean, applied: Precondition<A, B>, otherwise: Precondition<A, B>) => Precondition<A, B>;
/**
 * whenFalse (opposite of whenTrue).
 */
export declare const whenFalse: <A, B>(condition: boolean, applied: Precondition<A, B>, otherwise: Precondition<A, B>) => Precondition<A, B>;
/**
 * equals tests if the value is equal to the value specified (strictly).
 */
export declare const equals: <A, B>(target: B) => Precondition<A, B>;
/**
 * notNull requires a value to be specified.
 */
export declare const notNull: <A>(value: A) => Either<Failure<A>, {}> | Either<Failure<{}>, A>;
/**
 * optional applies the tests given only if the value is != null
 */
export declare const optional: <A, B>(p: Precondition<A, A | B>) => Precondition<A, A | B>;
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
 * unwrap applies a precondition received from a function.
 */
export declare const unwrap: <A, B>(p: () => Precondition<A, B>) => (value: A) => Either<Failure<A>, B>;
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
 * match preforms a type/structure matching on the input
 * value in order to decide which precondition to apply.
 *
 * Preconditions must be wrapped in a 'caseOf' precondition.
 */
export declare const match: <A, B>(p: Precondition<A, B>, ...list: Precondition<A, B>[]) => Precondition<A, B>;
