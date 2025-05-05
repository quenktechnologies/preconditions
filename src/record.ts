import { Type } from '@quenk/noni/lib/data/type';
import {
    Record,
    merge as _merge,
    reduce,
    empty,
    isRecord as _isRecord,
    exclude as _exclude,
    map as _map,
    keys
} from '@quenk/noni/lib/data/record';
import { Value, Object } from '@quenk/noni/lib/data/jsonx';

import { fail as rfail } from './result/failure/record';
import { reduce as arrayReduce } from './array';
import { Failures, Failure } from './result/failure';
import { Result, succeed, fail } from './result';
import { Precondition, Preconditions, typeOf, and, tee, identity } from './';

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

export const map = <A, B>(
    prec: Precondition<A, B>
): Precondition<Record<A>, Record<B>> =>
    and(
        <Precondition<Record<A>, Record<A>>>typeOf('object'),
        (value: Record<A>) => {
            let fcount = 0;
            let failures: Record<Failure<A>> = {};
            let success: Record<B> = {};

            for (let [key, val] of Object.entries(value)) {
                let result = prec(val);

                if (result.isLeft()) {
                    fcount++;
                    failures[key] = result.takeLeft();
                } else {
                    (<Record<B>>success)[key] = result.takeRight();
                }
            }

            return fcount > 0
                ? rfail(failures, value, { value })
                : succeed<Record<A>, Record<B>>(success);
        }
    );

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
        failures: _merge(failures, { [key]: f })
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
                  values: _merge(values, { [key]: v })
              };

/**
 * merge the properties of the value into the provided object.
 *
 * Any conflicting properties resolve to the value's property.
 */
export const merge =
    <A extends object, B extends object>(target: B): Precondition<A, A & B> =>
    (value: A) => {
        console.error('TARGET', target);
        console.error('VALUE ', value);
        return succeed(_merge(target, value));
    };
/**
 * mergeRight is like merge except conflicts are resolved with the target's
 * property.
 */
export const mergeRight =
    <A extends object, B extends object>(target: B): Precondition<A, A & B> =>
    (value: A) =>
        succeed(_merge(value, target));

/**
 * exclude the specified keys from a record value.
 */
export const exclude =
    <A, R extends Record<A>>(keys: string | string[]): Precondition<R, R> =>
    (value: R) =>
        succeed(<R>_exclude(value, keys));

/**
 * schemaProperties is a special precondition used internally for precondition
 * generation from object type schema.
 *
 * @param props        - The preconditions parsed from the property section of
 *                       the object schema. If there are no properties, the
 *                       precondition generated will drop any property values
 *                       unless the "additionalProperties" section is specified.
 *
 * @param propsPrec    - A precondition to wrap the props record in. This
 *                       should be one of "restrict", "intersect", "union" etc.
 *
 * @param addPropsPrec - A precondition parsed from the "additionalProperties"
 *                       section. This is used to intercept any not explicitly
 *                       declared properties. Properties declared in the
 *                       properties section are not passed to this precondition.
 */
export const schemaProperties = (
    propsWrap: (
        props: Preconditions<Value, Value>
    ) => Precondition<Object, Object>,
    props: Preconditions<Value, Value>,
    addPropsPrec?: Precondition<Value, Value>
): Precondition<Value, Value> => {
    let finalPropPrec: Precondition<Object, Object> = empty(props)
        ? identity
        : propsWrap(props);

    if (!addPropsPrec) return <Precondition<Value, Value>>finalPropPrec;

    return <Precondition<Value, Value>>and(
        tee<Object, Object>([
            finalPropPrec,
            and(exclude(keys(props)), map(addPropsPrec))
        ]),
        arrayReduce<Object, Object>(() => ({}), merge)
    );
};
