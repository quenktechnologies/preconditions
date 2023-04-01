import { Type } from '@quenk/noni/lib/data/type';
import {
    Record,
    merge,
    reduce,
    empty,
    isRecord as _isRecord
} from '@quenk/noni/lib/data/record';
import { keys } from '@quenk/noni/lib/data/record';

import { fail as rfail } from './result/failure/record';
import { Failures, Failure } from './result/failure';
import { Result, succeed, fail } from './result';
import { Precondition, Preconditions } from './';

interface Reports<A, B, R extends Record<B>> {
    failures: Failures<A>;

    values: R;
}

/**
 * isRecord tests if the value is an js object (and not an Array).
 */
export const isRecord = <A>(value: Type): Result<Type, Record<A>> =>
    _isRecord(value)
        ? succeed<Type, Record<A>>(<Record<A>>value)
        : fail<Type, Record<A>>('isRecord', value);

/**
 * restrict applies a record of preconditions to an input object keeping
 * only those properties that have a matching precondition.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const restrict =
    <A, B, R extends Record<B>>(
        tests: Preconditions<A, B>
    ): Precondition<Record<A>, R> =>
    (value: Record<A>) => {
        let add2Reports = (
            r: Reports<A, B, R>,
            p: Precondition<A, B>,
            k: string
        ) => p(value[k]).fold(onFailure(k, r), onSuccess(k, r));

        let result = <Reports<A, B, R>>(
            reduce(tests, reports<A, B, R>(), add2Reports)
        );

        return review<A, B, R>(result, value);
    };

/**
 * disjoint applies a record of preconditions to a javascript object
 * producing a new object with the final value of each precondition
 * and the values of any additional properties in the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const disjoint =
    <A, B, R extends Record<B>>(
        tests: Preconditions<A, B>
    ): Precondition<Record<A>, R> =>
    (value: Record<A>) => {
        let add2Reports = (r: Reports<A, B, R>, v: A, k: string) =>
            Object.hasOwnProperty.call(tests, k)
                ? tests[k](v).fold(onFailure(k, r), onSuccess(k, r))
                : onSuccess(k, r)(<Type>v);

        let result = reduce(value, reports<A, B, R>(), add2Reports);

        return review<A, B, R>(result, value);
    };

/**
 * intersect applies only the properties in a record of preconditions
 * that exist in the target input object. The resulting value is an
 * object with properties that exist in the input object that have had a
 * matching precondition applied.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const intersect =
    <A, B, R extends Record<B>>(
        tests: Preconditions<A, B>
    ): Precondition<Record<A>, R> =>
    (value: Record<A>) => {
        let add2Reports = (r: Reports<A, B, R>, v: A, k: string) =>
            Object.hasOwnProperty.call(tests, k)
                ? tests[k](v).fold(onFailure(k, r), onSuccess(k, r))
                : onSuccess(k, r)(<Type>null);

        let result = reduce(value, reports<A, B, R>(), add2Reports);

        return review<A, B, R>(result, value);
    };

/**
 * union applies a record of preconditions to an input object.
 *
 * Union results in an object that has both the results of applied preconditions for
 * found properties and any additional properties on the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const union =
    <A, B, R extends Record<B>>(
        tests: Preconditions<A, B>
    ): Precondition<Record<A>, R> =>
    (value: Record<A>) => {
        let ks = keys(tests).concat(keys(value));

        let add2Reports = (r: Reports<A, B, R>, k: string) =>
            Object.hasOwnProperty.call(tests, k)
                ? tests[k](value[k]).fold(onFailure(k, r), onSuccess(k, r))
                : onSuccess(k, r)(<Type>value[k]);

        let results = ks.reduce(add2Reports, reports<A, B, R>());

        return review<A, B, R>(results, value);
    };

/**
 * map applies the same Precondition to each property of an object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
export const map =
    <A, B, R extends Record<B>>(
        condition: Precondition<A, B>
    ): Precondition<Record<A>, R> =>
    (value: Record<A>) => {
        let add2Reports = (r: Reports<A, B, R>, v: A, k: string) =>
            condition(v).fold(onFailure(k, r), onSuccess(k, r));

        let result = reduce(value, reports<A, B, R>(), add2Reports);

        return review<A, B, R>(result, value);
    };

const reports = <A, B, R extends Record<B>>(): Reports<A, B, R> => ({
    failures: {},
    values: <R>{}
});

const review = <A, B, R extends Record<B>>(
    reports: Reports<A, B, R>,
    value: Record<A>
): Result<Record<A>, R> =>
    !empty(reports.failures)
        ? rfail(reports.failures, value, { value })
        : succeed<Record<A>, R>(reports.values);

const onFailure =
    <A, B, R extends Record<B>>(
        key: string,
        { failures, values }: Reports<A, B, R>
    ) =>
    (f: Failure<A>): Reports<A, B, R> => ({
        values,
        failures: merge(failures, { [key]: f })
    });

const onSuccess =
    <A, B, R extends Record<B>>(
        key: string,
        { failures, values }: Reports<A, B, R>
    ) =>
    (v: B): Reports<A, B, R> =>
        v == null
            ? { failures, values }
            : {
                  failures,
                  values: merge(values, { [key]: v })
              };
