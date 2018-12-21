import { Type } from '@quenk/noni/lib/data/type';
import { Record, merge, reduce } from '@quenk/noni/lib/data/record';
import { keys } from '@quenk/noni/lib/data/record';
import { fail as rfail } from './result/failure/record';
import { Failures, Failure } from './result/failure';
import { Result, succeed, fail } from './result';
import { Precondition, Preconditions } from './';

interface Reports<A, B, BR extends Record<B>> {

    failures: Failures<A>

    values: BR

}

/**
 * isRecord tests if the value is an js object (and not an Array).
 */
export const isRecord = <A>(value: A) =>
    (typeof value === 'object' && (!Array.isArray(value))) ?
        succeed<Type, A>(value) : fail<Type, A>('isRecord', value);

/**
 * restrict applies a record of preconditions to an input object keeping
 * only those properties that have a matching precondition.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const restrict = <A, AR extends Record<A>, B, BR extends Record<B>>
    (conditions: Preconditions<A, B>): Precondition<AR, BR> => (value: AR) => {

        let init: Reports<A, B, BR> = reports();

        let rs = reduce(conditions, init,
            (r: Reports<A, B, BR>, p: Precondition<A, B>, k: string) =>
                p(value[k]).fold(onFailure(k, r), onSuccess(k, r)));

        return review<A, AR, B, BR>(rs, value);

    }

/**
 * disjoint applies a record of preconditions to a javascript object
 * producing a new object with the final value of each precondition
 * and the values of any additional properties in the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const disjoint = <A, AR extends Record<A>, B, BR extends Record<B>>
    (conditions: Preconditions<A, B>): Precondition<AR, BR> => (value: AR) => {

        let init: Reports<A, B, BR> = reports();

        let rs = reduce(value, init, (r: Reports<A, B, BR>, x: A, k: string) =>
            (conditions.hasOwnProperty(k)) ?
                conditions[k](x).fold(onFailure(k, r), onSuccess(k, r)) :
                onSuccess(k, r)(<Type>x));

        return review<A, AR, B, BR>(rs, value);

    }

/**
 * intersect applies only the properties in a record of preconditions
 * that exist in the target input object. The resulting value is an
 * object with properties that exist in the input object that have had a
 * matching precondition applied.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const intersect = <A, AR extends Record<A>, B, BR extends Record<B>>
    (conditions: Preconditions<A, B>): Precondition<AR, BR> => (value: AR) => {

        let init: Reports<A, B, BR> = reports();

        let rs = reduce(value, init, (r: Reports<A, B, BR>, x: A, k: string) =>
            (conditions.hasOwnProperty(k)) ?
                conditions[k](x).fold(onFailure(k, r), onSuccess(k, r)) :
                onSuccess(k, r)(<Type>null));

        return review<A, AR, B, BR>(rs, value);

    }

/**
 * union applies a record of preconditions to an input object.
 *
 * Union results in an object that has both the results of applied preconditions for
 * found properties and any additional properties on the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const union = <A, AR extends Record<A>, B, BR extends Record<B>>
    (conditions: Preconditions<A, B>): Precondition<AR, BR> => (value: AR) => {

        let ks = keys(conditions).concat(keys(value));
        let init: Reports<A, B, BR> = reports();

        let rs = ks.reduce((r: Reports<A, B, BR>, k: string) =>
            conditions.hasOwnProperty(k) ?
                conditions[k](value[k]).fold(onFailure(k, r), onSuccess(k, r)) :
                onSuccess(k, r)(<Type>value[k]), init);

        return review<A, AR, B, BR>(rs, value);

    }

/**
 * map applies the same Precondition to each property of an object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const map = <A, AR extends Record<A>, B, BR extends Record<B>>
    (condition: Precondition<A, B>): Precondition<AR, BR> => (value: AR) => {

        let init: Reports<A, B, BR> = reports();

        let rs = reduce(value, init, (r: Reports<A, B, BR>, x: A, k: string) =>
            condition(x).fold(onFailure(k, r), onSuccess(k, r)));

        return review<A, AR, B, BR>(rs, value);

    }

const reports = <A, B, BR extends Record<B>>
    (): Reports<A, B, BR> => ({ failures: {}, values: <BR>{} });

const review = <A, AR extends Record<A>, B, BR extends Record<B>>
    (reports: Reports<A, B, BR>, value: AR): Result<AR, BR> =>
    (Object.keys(reports.failures).length > 0) ?
        rfail(reports.failures, value, { value }) :
        succeed<AR, BR>(reports.values);

const onFailure = <A, B, BR extends Record<B>>
    (key: string, { failures, values }: Reports<A, B, BR>) =>
    (f: Failure<A>): Reports<A, B, BR> => ({
        values,
        failures: merge(failures, { [key]: f })
    });

const onSuccess = <A, B, BR extends Record<B>>
    (key: string, { failures, values }: Reports<A, B, BR>) => (v: B)
        : Reports<A, B, BR> =>
        (v == null) ?
            { failures, values } :
            ({
                failures,
                values: merge(values, { [key]: v })
            });
