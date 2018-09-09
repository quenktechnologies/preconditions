import { Record } from '@quenk/noni/lib/data/record';
import { Precondition } from '../';
import { Failure as F } from '../failure';
import { Reports } from './failure';
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
 * Predicate test.
 */
export declare type Predicate<A> = (a: A) => boolean;
/**
 * Predicates is a record of predicate tests.
 */
export interface Predicates<A> {
    [key: string]: Predicate<A>;
}
/**
 * @private
 */
export declare const onFailure: <M, V>(key: string, { failures, values }: Reports<M, V>) => (f: F<M>) => Reports<M, V>;
/**
 * @private
 */
export declare const onSuccess: <M, V>(key: string, { failures, values }: Reports<M, V>) => (v: V) => Reports<M, V>;
/**
 * isObject tests if the value is an js object (and not an Array).
 */
export declare const isObject: <A>(value: A) => import("@quenk/noni/lib/data/either").Either<F<any>, A>;
/**
 * restrict applies a record of preconditions to an input object keeping
 * only those properties that have a matching precondition.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export declare const restrict: <P, A extends Record<P>, Q, B extends Record<Q>>(conditions: Preconditions<P, Q>) => Precondition<A, B>;
/**
 * disjoint applies a record of preconditions to a javascript object
 * producing a new object with the final value of each precondition
 * and the values of any additional properties in the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export declare const disjoint: <P, A extends Record<P>, Q, B extends Record<Q>>(conditions: Preconditions<P, Q>) => Precondition<A, B>;
/**
 * intersect applies only the properties in a record of preconditions
 * that exist in the target input object. The resulting value is an
 * object with properties that exist in the input object that have had a
 * matching precondition applied.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export declare const intersect: <P, A extends Record<P>, Q, B extends Record<Q>>(conditions: Preconditions<P, Q>) => Precondition<A, B>;
/**
 * union applies a record of preconditions to an input object.
 *
 * Union results in an object that has both the results of applied preconditions for
 * found properties and any additional properties on the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export declare const union: <P, A extends Record<P>, Q, B extends Record<Q>>(conditions: Preconditions<P, Q>) => Precondition<A, B>;
/**
 * map applies the same Precondition to each property of an object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export declare const map: <P, A extends Record<P>, Q, B extends Record<Q>>(condition: Precondition<P, Q>) => Precondition<A, B>;
