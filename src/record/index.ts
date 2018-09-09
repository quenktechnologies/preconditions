import { Record, merge, reduce } from '@quenk/noni/lib/data/record';
import { either } from '@quenk/noni/lib/data/either';
import { Precondition } from '../';
import { Failure as F } from '../failure';
import { success, failure as fail } from '../failure';
import { combineKeys } from '../util';
import { Reports, review } from './failure';

/**
 * A map of key precondition pairs.
 *
 * The right type class should be the union
 * of all possible values (or any) and the 
 * right th union of all possible outcomes.
 */
export interface Preconditions<A, B> {

    [key: string]: Precondition<A, B>

}

/**
 * Predicate test.
 */
export type Predicate<A> = (a: A) => boolean;

/**
 * Predicates is a record of predicate tests.
 */
export interface Predicates<A> {

    [key: string]: Predicate<A>

}

/**
 * @private
 */
export const onFailure =
    <M, V>(key: string, { failures, values }: Reports<M, V>) =>
        (f: F<M>): Reports<M, V> => ({
            values,
            failures: merge(failures, { [key]: f })
        });

/**
 * @private
 */
export const onSuccess = <M, V>(
    key: string,
    { failures, values }: Reports<M, V>) =>
    (v: V): Reports<M, V> => (v == null) ?
        { failures, values } :
        ({
            failures,
            values: merge(values, { [key]: v })
        });

/**
 * isObject tests if the value is an js object (and not an Array).
 */
export const isObject = <A>(value: A) =>
    (typeof value === 'object' && (!Array.isArray(value))) ?
        success<any, A>(value) : fail<any, A>('isObject', value);

/**
 * restrict applies a record of preconditions to an input object keeping
 * only those properties that have a matching precondition.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const restrict = <P, A extends Record<P>, Q, B extends Record<Q>>
    (conditions: Preconditions<P, Q>): Precondition<A, B> => (value: A) => {

        let init: Reports<P, Q> = { failures: {}, values: {} };

        let reports =
            reduce(conditions, init,
                (r: Reports<P, Q>, p: Precondition<P, Q>, k: string) =>
                    either<any, any, any>
                        (onFailure(k, r))
                        (onSuccess(k, r))
                        (p(value[k])));

        return review<A, P, B>(reports, value);

    }

/**
 * disjoint applies a record of preconditions to a javascript object
 * producing a new object with the final value of each precondition
 * and the values of any additional properties in the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const disjoint = <P, A extends Record<P>, Q, B extends Record<Q>>
    (conditions: Preconditions<P, Q>): Precondition<A, B> => (value: A) => {

        let init: Reports<P, Q> = { failures: {}, values: {} };

        let reports = reduce(value, init, (r: Reports<P, Q>, x: P, k: string) =>
            (conditions.hasOwnProperty(k)) ?
                either<any, any, any>
                    (onFailure(k, r))
                    (onSuccess(k, r))
                    (conditions[k](x)) :
                onSuccess(k, r)(<any>x));

        return review<A, P, B>(reports, value);

    }

/**
 * intersect applies only the properties in a record of preconditions
 * that exist in the target input object. The resulting value is an
 * object with properties that exist in the input object that have had a
 * matching precondition applied.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const intersect = <P, A extends Record<P>, Q, B extends Record<Q>>
    (conditions: Preconditions<P, Q>): Precondition<A, B> => (value: A) => {

        let init: Reports<P, Q> = { failures: {}, values: {} };

        let reports = reduce(value, init, (r: Reports<P, Q>, x: P, k: string) =>
            (conditions.hasOwnProperty(k)) ?
                either<any, any, any>
                    (onFailure(k, r))
                    (onSuccess(k, r))
                    (conditions[k](x)) :
                onSuccess(k, r)(<any>null));

        return review<A, P, B>(reports, value);

    }

/**
 * union applies a record of preconditions to an input object.
 *
 * Union results in an object that has both the results of applied preconditions for
 * found properties and any additional properties on the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const union = <P, A extends Record<P>, Q, B extends Record<Q>>
    (conditions: Preconditions<P, Q>): Precondition<A, B> => (value: A) => {

        let keys = combineKeys(conditions, value);
        let init: Reports<P, Q> = { failures: {}, values: {} };

        let reports = keys.reduce((r: Reports<P, P>, k: string) =>
            conditions.hasOwnProperty(k) ?
                either<any, any, any>
                    (onFailure(k, r))
                    (onSuccess(k, r))
                    (conditions[k](value[k])) :
                onSuccess(k, r)(value[k]), init);

        return review<A, P, B>(reports, value);

    }

/**
 * map applies the same Precondition to each property of an object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const map = <P, A extends Record<P>, Q, B extends Record<Q>>
    (condition: Precondition<P, Q>): Precondition<A, B> => (value: A) => {

        let init: Reports<P, Q> = { failures: {}, values: {} };

        let reports = reduce(value, init,
            (r: Reports<P, Q>, x: P, k: string) =>

                either<any, any, any>
                    (onFailure(k, r))
                    (onSuccess(k, r))
                    (condition(x)));

        return review<A, P, B>(reports, value);

    }
