import { Pattern } from '@quenk/noni/lib/data/type';
import { Result } from './result';
/**
 * Precondition represents some condition that must be satisfied
 * in order for data to be considered a valid type.
 *
 * A Precondition accepts a value of type <A> and returns an Either
 * where the left side contains information about why the precondition
 * failed or the right the resulting type and value.
 */
export declare type Precondition<A, B> = (value: A) => Result<A, B>;
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
 * constant forces the value to be the supplied value.
 */
export declare const constant: <A, B>(b: B) => Precondition<A, B>;
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
 * eq tests if the value is equal (strictly) to the target.
 */
export declare const eq: <A, B>(target: B) => Precondition<A, B>;
/**
 * neq tests if the value is not equal (strictly) to the target.
 */
export declare const neq: <A, B>(target: B) => Precondition<A, B>;
/**
 * notNull will fail if the value is null or undefined.
 */
export declare const notNull: <A>(value: A) => Result<A, A>;
/**
 * optional applies the precondition given only if the value is not null
 * or undefined.
 */
export declare const optional: <A, B>(p: Precondition<A, A | B>) => Precondition<A, A | B>;
/**
 * identity always succeeds with the value it is applied to.
 */
export declare const identity: <A>(value: A) => Result<A, A>;
/**
 * discard throws away a value by assigning it ot undefined.
 */
export declare const discard: <A>(_: A) => Result<A, undefined>;
/**
 * reject always fails with reason no matter the value supplied.
 */
export declare const reject: <A, B>(reason: string) => Precondition<A, B>;
/**
 * or performs the equivalent of a logical 'or' between two preconditions.
 */
export declare const or: <A, B>(left: Precondition<A, B>, right: Precondition<A, B>) => Precondition<A, B>;
/**
 * and performs the equivalent of a logical 'and' between two preconditions.
 */
export declare const and: <A, B, C>(l: Precondition<A, B>, r: Precondition<B, C>) => Precondition<A, C>;
/**
 * every takes a set of preconditions and attempts to apply each
 * one after the other to the input.
 */
export declare const every: <A, B>(p: Precondition<A, B>, ...list: Precondition<B, B>[]) => Precondition<A, B>;
/**
 * anyOf applies all of the preconditions provided until one succeeds.
 */
export declare const anyOf: <A, B>(...list: Precondition<A, B>[]) => Precondition<A, B>;
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
export declare const caseOf: <A, B>(t: Pattern<A>, p: Precondition<A, B>) => Precondition<A, B>;
/**
 * log the value to the console.
 */
export declare const log: <A>(value: A) => Result<A, A>;
