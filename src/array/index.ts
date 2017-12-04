import * as util from 'afpl/lib/util';
import { Precondition, Failure, success, failure as fail, left } from '../';
import { Contexts, Failures } from '../object';
import { ArrayFailure } from './ArrayFailure';
import { Either } from 'afpl/lib/monad/Either';

export { ArrayFailure, success };
export { Either };

/**
 * @private
 */
export interface Reports<M, V> {

    failures: Failures<M>
    values: V[]

}

/**
 * failure
 */
export const failure =
    <A, B>(errors: Failures<A>, value: A[], contexts: Contexts) =>
        left<ArrayFailure<A>, B[]>(new ArrayFailure(errors, value, contexts));

export const onFailure = <A, B>(key: number, { failures, values }: Reports<A, B>) => (f: Failure<A>) =>
    ({ values, failures: util.merge(failures, { [key]: f }) });

export const onSuccess = <A, B>({ failures, values }: Reports<A, B>) => (b: B) =>
    ({ failures, values: values.concat(b) })

/**
 * @private
 */
export const review = <A, B>(value: A[], r: Reports<A, B>) =>
    (Object.keys(r.failures).length > 0) ?
        failure<A, B>(r.failures, value, { value }) :
        success<A[], B[]>(r.values);

/**
 * isArray tests if the value is an array
 */
export const isArray: Precondition<any, any[]> =
    <A>(a: any) => Array.isArray(a) ?
        success<any, A[]>(a) :
        fail<any, A[]>('isArray', a);

/**
 * notEmpty tests if an array has at least one member.
 */
export const notEmpty = <A>(value: A[]) => (value.length === 0) ?
    fail<A[], A[]>('notEmpty', value, { value }) : success<A[], A[]>(value);

/**
 * range tests whether an array falls within a specific min and max range.
 */
export const range = <A>(min: number, max: number) => (value: A[]) =>
    (value.length < min) ?
        fail('range.min', value, { min, max, value }) :
        (value.length > max) ?
            fail('range.max', value) :
            success(value);

/**
 * filter applies a precondition to each member of an array producing
 * an array where only the successful members are retained.
 *
 * @param <A> The type of the input object.
 * @param <B> The type of the final object.
 * @param p The precondition to apply to each member.
 */
export const filter = <A, B>(p: Precondition<A, B>): Precondition<A[], B[]> =>
    (value: A[]) => success<A[], B[]>(value.map(a =>
        p(a).cata(() => null, b => b)).filter(x => x != null));

/**
 * map applies a precondition to each member of an array.
 *
 * If the precondition fails for any of the members, 
 * the entire array is considered a failure.
 * @param <A> The type of the input object.
 * @param <B> The type of the final object.
 * @param p The precondition to apply to each member.
 */
export const map =
    <A, B>(p: Precondition<A, B>): Precondition<A[], B[]> =>
        (value: A[]) =>
            review(value, value.reduce((reports, a, k) =>
                p(a).cata(
                    onFailure(k, reports),
                    onSuccess(reports)
                ), { failures: {}, values: [] }));

