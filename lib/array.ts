import { Precondition } from './';
import { Type } from '@quenk/noni/lib/data/type';
import { Right, left } from '@quenk/noni/lib/data/either';
import { merge } from '@quenk/noni/lib/data/record';
import { ArrayFailure as AF } from './result/failure/array';
import { Failures, Failure } from './result/failure';
import { succeed, fail } from './result';

interface Reports<M, V> {

    failures: Failures<M>,

    values: V[]

}

/**
 * isArray tests if the value is an array
 */
export const isArray: Precondition<Type, Type[]> = <A>(a: Type) =>
    Array.isArray(a) ? succeed<Type, A[]>(a) : fail<Type, A[]>('isArray', a);

/**
 * notEmpty tests if an array has at least one member.
 */
export const notEmpty = <A>(value: A[]) => (value.length === 0) ?
    fail<A[], A[]>('notEmpty', value, { value }) : succeed<A[], A[]>(value);

/**
 * max sets a maximum number of elements the array can contain.
 */
export const max = <A>(target: number): Precondition<A[], A[]> => (value: A[]) =>
    (value.length > target) ?
        fail<A[], A[]>('max', value, { target, value }) :
        succeed<A[], A[]>(value);
/**
 * min sets a minimum number of elements the array can contain.
 */
export const min = <A>(target: number): Precondition<A[], A[]> => (value: A[]) =>
    (value.length < target) ?
        fail<A[], A[]>('min', value, { target, value }) :
        succeed<A[], A[]>(value);

/**
 * range tests whether an array's length falls within a specific min and max range.
 */
export const range = <A>(min: number, max: number) => (value: A[]) =>
    (value.length < min) ?
        fail('range.min', value, { min, max, value }) :
        (value.length > max) ?
            fail('range.max', value) :
            succeed(value);

/**
 * filter applies a precondition to each member of an array producing
 * an array where only the successful members are kept.
 */
export const filter = <A, B>(p: Precondition<A, B>)
    : Precondition<A[], B[]> => (value: A[]) =>
        succeed<A[], B[]>(
            value
                .map(p)
                .filter((e) => (e instanceof Right))
                .map(e => e.takeRight()));

/**
 * map applies a precondition to each member of an array.
 *
 * If the precondition fails for any of the members, 
 * the entire array is considered a failure.
 */
export const map = <A, B>(p: Precondition<A, B>)
    : Precondition<A[], B[]> => (value: A[]) =>
        review(value, value.reduce(mapReduce(p), reports()));

const review = <A, B>(value: A[], r: Reports<A, B>) =>
    (Object.keys(r.failures).length > 0) ?
        left<Failure<A[]>, B[]>(AF.create(r.failures, value, { value })) :
        succeed<A[], B[]>(r.values);

const mapReduce = <A, B>(p: Precondition<A, B>) =>
    (reports: Reports<A, B>, a: A, k: number) =>
        p(a).fold(onFailure(k, reports), onSuccess<A, B>(reports))

const reports = <A, B>(): Reports<A, B> =>
    ({ failures: {}, values: [] });

const onFailure = <A, B>(key: number, { failures, values }: Reports<A, B>) =>
    (f: Failure<A>): Reports<A, B> =>
        ({ values, failures: merge(failures, { [key]: f }) });

const onSuccess = <A, B>({ failures, values }: Reports<A, B>) => (b: B)
    : Reports<A, B> =>
    ({ failures, values: values.concat(b) })

/**
 * tuple tests whether the value supplied qualifies as a tuple.
 *
 * Each precondition in the list represents a precondition for its
 * corresponding tuple element.
 */
export const tuple = <A, B>(list: Precondition<A, B>[])
    : Precondition<A[], B[]> => (value: A[]) => {

        if (value.length !== list.length)
            return fail<A[], B[]>('tuple', value);

        let results = value.map((v, idx) => list[idx](v));

        let fails = results.filter(v => v.isLeft()).map(e => e.takeLeft());

        if (fails.length > 0) {

            let failMap =
                fails.reduce((p, c, k) => { p[k] = c; return p; },
                    <Failures<A>>{});

            return left<Failure<A[]>, B[]>(AF.create(failMap, value, { value }));

        }

        return succeed<A[], B[]>(results.map(e => e.takeRight()));

    }
