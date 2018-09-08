import { Precondition } from '../';
import { either } from '@quenk/noni/lib/data/either';
import { id } from '@quenk/noni/lib/data/function';
import { merge } from '@quenk/noni/lib/data/record';
import { success, failure as fail } from '../result';
import { Failure } from '../failure';
import { Reports, review } from './failure';

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
 * an array where only the successful members are kept.
 */
export const filter =
    <A, B>(p: Precondition<A, B>): Precondition<A[], B[]> => (value: A[]) =>
        success<A[], B[]>(
          value.map(a => (either(() => null)(id)(p(a))))
          .filter((x: B) => x != null));

/**
 * map applies a precondition to each member of an array.
 *
 * If the precondition fails for any of the members, 
 * the entire array is considered a failure.
 */
export const map =
    <A, B>(p: Precondition<A, B>): Precondition<A[], B[]> =>
        (value: A[]) => review(value, value.reduce((reports, a, k) =>
            (either(onFailure(k, reports))(onSuccess(reports))(p(a))),
            { failures: {}, values: [] }));

export const onFailure =
    <A, B>(key: number, { failures, values }: Reports<A, B>) => (f: Failure<A>) =>
        ({ values, failures: merge(failures, { [key]: f }) });

export const onSuccess =
    <A, B>({ failures, values }: Reports<A, B>) => (b: B) =>
        ({ failures, values: values.concat(b) })


