import * as util from 'afpl/lib/util';
import { Precondition, Failure, Context, failure as fail, success, left } from '../';
import { ObjectFailure } from './ObjectFailure';
import { Either } from 'afpl/lib/monad/Either';

export { ObjectFailure, ObjectFailure as Failure, Either, success };

/**
 * Failures is a map of Failures.
 */
export interface Failures<A> {

    [key: string]: Failure<A>

}

/**
 * Contexts is a map of Contexts.
 */
export interface Contexts {

    [key: string]: Context

}

/**
 * Values is a map of values to apply a map {@link Precondition} to.
 */
export interface Values<V> {

    [key: string]: V

}

/**
 * @private
 */
export interface Reports<M, V> {

    failures: Failures<M>
    values: Values<V>

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
        (f: Failure<M>): Reports<M, V> => ({
            values,
            failures: util.merge<Failures<M>, Failures<M>>(failures, {
                [key]: f
            })
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
                values: util.merge<Values<V>, Values<V>>(values, {
                    [key]: v
                })
            });

/**
 * @private
 */
export const review = <A extends Values<AB>, AB, B>(reports: Reports<AB, AB>, value: A) =>
    (Object.keys(reports.failures).length > 0) ?
        failure<A, AB, B>(reports.failures, value, { value }) :
        success<A, B>(<B><any>reports.values);

/**
 * keysUnion creates an array of keys from the keys of two objects.
 */
export const keysUnion = (o1: object, o2: object): string[] =>
    Object
        .keys(o1)
        .concat(Object.keys(o2))
        .filter((k, i, l) => l.indexOf(k) == i);

/**
 * failure produces a new failure wrapped in the left side
 * of an Either from a map (object) of failures.
 */
export const failure =
    <A extends Values<V>, V, B>(errors: Failures<V>, value: A, contexts: Contexts) =>
        left<ObjectFailure<A, V>, B>(new ObjectFailure(errors, value, contexts));

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
 *
 * @param <A> The type of the input object.
 * @param <AB> An ADT representing the input property values and final property values.
 * @param <B> The type of the final object.
 * @param conditions A record of Preconditions to apply to the input object.
 */
export const restrict = <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>)
    : Precondition<A, B> => (value: A) => {

        let init: Reports<AB, AB> = { failures: {}, values: {} };

        let reports = util.reduce<Precondition<AB, AB>, Reports<AB, AB>>(
            conditions,
            (r: Reports<AB, AB>, p: Precondition<AB, AB>, k: string) =>
                p(value[k]).cata(onFailure(k, r), onSuccess(k, r)), init);

        return review<A, AB, B>(reports, value);

    }

/**
 * disjoint applies a record of preconditions to a javascript object
 * producing a new object with the final value of each precondition
 * and the values of any additional properties in the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 * @param <A> The type of the input object.
 * @param <AB> An ADT representing the input property values and final property values.
 * @param <B> The type of the final object.
 * @param conditions A record of preconditions to apply to an input object. 
 */
export const disjoint = <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>)
    : Precondition<A, B> => (value: A) => {

        let init: Reports<AB, AB> = { failures: {}, values: {} };

        let reports = util.reduce(value,
            (r: Reports<AB, AB>, x: AB, k: string) =>
                (conditions.hasOwnProperty(k)) ?
                    conditions[k](x)
                        .cata(onFailure(k, r), onSuccess(k, r)) :
                    onSuccess(k, r)(x), init);

        return review<A, AB, B>(reports, value);

    }

/**
 * intersect applies only the properties in a record of preconditions
 * that exist in the target input object. The resulting value is an
 * object with properties that exist in the input object that have had a
 * matching precondition applied.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 * @param <A> The type of the input value.
 * @param <AB> An ADT representing the domain of intial key values and final key values.
 * @param <B> The type of the final value.
 * @param conditions A record of Preconditions to apply to the input value.
 */
export const intersect =
    <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>): Precondition<A, B> =>
        (value: A) => {

            let init: Reports<AB, AB> = { failures: {}, values: {} };

            let reports = util.reduce(value,
                (r: Reports<AB, AB>, x: AB, k: string) =>
                    (conditions.hasOwnProperty(k)) ?
                        conditions[k](x)
                            .cata(onFailure(k, r), onSuccess(k, r)) :
                        onSuccess(k, r)(null), init);

            return review<A, AB, B>( reports, value);

        }

/**
 * union applies a record of preconditions to an input object.
 *
 * Union results in an object that has both the results of applied preconditions for
 * found properties and any additional properties on the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 * @param <A> The type of the input value.
 * @param <AB> An ADT representing the domain of intial key values and final key values.
 * @param <B> The type of the final value.
 * @param condition The precondition to apply to the input value.
 */
export const union =
    <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>): Precondition<A, B> =>
        (value: A) => {

            let keys = keysUnion(conditions, value);
            let init: Reports<AB, AB> = { failures: {}, values: {} };

            let reports = keys.reduce((r: Reports<AB, AB>, k: string) =>
                conditions.hasOwnProperty(k) ?
                    conditions[k](value[k]).cata(onFailure(k, r), onSuccess(k, r)) :
                    onSuccess(k, r)(value[k]), init);

            return review<A, AB, B>(reports, value);

        }

/**
 * map applies the same Precondition to each property of an object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 * @param <A> The type of the input value.
 * @param <AB> An ADT representing the domain of intial key values and final key values.
 * @param <B> The type of the final value.
 * @param condition The precondition to apply to the input value.
 */
export const map =
    <A extends Values<AB>, AB, B>(condition: Precondition<AB, AB>): Precondition<A, B> =>
        (value: A) => {

            let init: Reports<AB, AB> = { failures: {}, values: {} };

            let reports = util.reduce(value,
                (r: Reports<AB, AB>, x: AB, k: string) =>
                    condition(x).cata(onFailure(k, r), onSuccess(k, r)), init);

            return review<A, AB, B>( reports, value);

        }

