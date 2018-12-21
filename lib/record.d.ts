import { Record } from '@quenk/noni/lib/data/record';
import { Failure } from './result/failure';
import { Precondition, Preconditions } from './';
/**
 * isRecord tests if the value is an js object (and not an Array).
 */
export declare const isRecord: <A>(value: A) => import("@quenk/noni/lib/data/either").Either<Failure<any>, A>;
/**
 * restrict applies a record of preconditions to an input object keeping
 * only those properties that have a matching precondition.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export declare const restrict: <A, AR extends Record<A>, B, BR extends Record<B>>(conditions: Preconditions<A, B>) => Precondition<AR, BR>;
/**
 * disjoint applies a record of preconditions to a javascript object
 * producing a new object with the final value of each precondition
 * and the values of any additional properties in the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export declare const disjoint: <A, AR extends Record<A>, B, BR extends Record<B>>(conditions: Preconditions<A, B>) => Precondition<AR, BR>;
/**
 * intersect applies only the properties in a record of preconditions
 * that exist in the target input object. The resulting value is an
 * object with properties that exist in the input object that have had a
 * matching precondition applied.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export declare const intersect: <A, AR extends Record<A>, B, BR extends Record<B>>(conditions: Preconditions<A, B>) => Precondition<AR, BR>;
/**
 * union applies a record of preconditions to an input object.
 *
 * Union results in an object that has both the results of applied preconditions for
 * found properties and any additional properties on the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export declare const union: <A, AR extends Record<A>, B, BR extends Record<B>>(conditions: Preconditions<A, B>) => Precondition<AR, BR>;
/**
 * map applies the same Precondition to each property of an object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export declare const map: <A, AR extends Record<A>, B, BR extends Record<B>>(condition: Precondition<A, B>) => Precondition<AR, BR>;
