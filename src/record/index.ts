import { merge, reduce } from '@quenk/noni/lib/data/record';
import { either } from '@quenk/noni/lib/data/either';
import { Precondition } from '../';
import { Failure as F } from '../failure';
import { success, failure as fail } from '../result';
import { combineKeys} from '../util';
import { Reports, review } from './result';

/**
 * Values is a map of values to apply a map [[Precondition]] to.
 */
export interface Values<V> {

    [key: string]: V

}

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
export const onSuccess =
    <M, V>(
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
export const isObject =
    <A>(value: A) =>
        (typeof value === 'object' && (!Array.isArray(value))) ?
            success<any, A>(value) : fail<any, A>('isObject', value);

/**
 * where applies a precondition to an object, only if a record
 * of predicates all pass.
 * 
 */
export const where = <A extends Values<AB>, AB, B>(
    tests: Predicates<A>,
    p: Precondition<A, B>,
    otherwise: Precondition<A, B>): Precondition<A, B> =>
    (value: A) => Object.keys(tests).every(k => tests[k](value)) ? p(value) : otherwise(value);

/**
 * restrict applies a record of preconditions to an input object keeping
 * only those properties that have a matching precondition.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const restrict = <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>)
    : Precondition<A, B> => (value: A) => {

        let init: Reports<AB, AB> = { failures: {}, values: {} };

        let reports =
            reduce(conditions, init,
                (r: Reports<AB, AB>, p: Precondition<AB, AB>, k: string) =>
                    either(onFailure(k, r))(onSuccess(k, r))(p(value[k])));

        return review<A, AB, B>(reports, value);

    }

/**
 * disjoint applies a record of preconditions to a javascript object
 * producing a new object with the final value of each precondition
 * and the values of any additional properties in the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const disjoint = <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>)
    : Precondition<A, B> => (value: A) => {

        let init: Reports<AB, AB> = { failures: {}, values: {} };

        let reports = reduce(value, init,
            (r: Reports<AB, AB>, x: AB, k: string) =>
                (conditions.hasOwnProperty(k)) ?
                    either(onFailure(k, r))(onSuccess(k, r))(conditions[k](x)) :
                    onSuccess(k, r)(x));

        return review<A, AB, B>(reports, value);

    }

/**
 * intersect applies only the properties in a record of preconditions
 * that exist in the target input object. The resulting value is an
 * object with properties that exist in the input object that have had a
 * matching precondition applied.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const intersect =
    <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>): Precondition<A, B> =>
        (value: A) => {

            let init: Reports<AB, AB> = { failures: {}, values: {} };

            let reports = reduce(value, init,
                (r: Reports<AB, AB>, x: AB, k: string) =>
                    (conditions.hasOwnProperty(k)) ?
                        either(onFailure(k, r))(onSuccess(k, r))(conditions[k](x)) :
                        onSuccess(k, r)(null));

            return review<A, AB, B>(reports, value);

        }

/**
 * union applies a record of preconditions to an input object.
 *
 * Union results in an object that has both the results of applied preconditions for
 * found properties and any additional properties on the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const union =
    <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>): Precondition<A, B> =>
        (value: A) => {

            let keys = combineKeys(conditions, value);
            let init: Reports<AB, AB> = { failures: {}, values: {} };

            let reports = keys.reduce((r: Reports<AB, AB>, k: string) =>
                conditions.hasOwnProperty(k) ?
                    either(onFailure(k, r))(onSuccess(k, r))(conditions[k](value[k])) :
                    onSuccess(k, r)(value[k]), init);

            return review<A, AB, B>(reports, value);

        }

/**
 * map applies the same Precondition to each property of an object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const map =
    <A extends Values<AB>, AB, B>(condition: Precondition<AB, AB>): Precondition<A, B> =>
        (value: A) => {

            let init: Reports<AB, AB> = { failures: {}, values: {} };

            let reports = reduce(value, init,
                (r: Reports<AB, AB>, x: AB, k: string) =>

                    either(onFailure(k, r))(onSuccess(k, r))(condition(x)));

            return review<A, AB, B>(reports, value);

        }
