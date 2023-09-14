import { Type } from '@quenk/noni/lib/data/type';
import { Right, left } from '@quenk/noni/lib/data/either';

import { ArrayFailure as AF } from './result/failure/array';
import { Failures, Failure } from './result/failure';
import { succeed, fail } from './result';
import { Precondition } from './';

/**
 * isArray tests if the value is an array
 */
export const isArray: Precondition<Type, Type[]> = <A>(a: Type) =>
    Array.isArray(a) ? succeed<Type, A[]>(a) : fail<Type, A[]>('isArray', a);

/**
 * notEmpty tests if an array has at least one member.
 */
export const nonEmpty = <A>(value: A[]) =>
    value.length === 0
        ? fail<A[], A[]>('nonEmpty', value, { value })
        : succeed<A[], A[]>(value);

/**
 * maxItems sets a maximum number of elements the array can contain.
 */
export const maxItems =
    <A>(target: number): Precondition<A[], A[]> =>
    (value: A[]) =>
        value.length > target
            ? fail<A[], A[]>('maxItems', value, { target, value })
            : succeed<A[], A[]>(value);

/**
 * minItems sets a minimum number of elements the array can contain.
 */
export const minItems =
    <A>(target: number): Precondition<A[], A[]> =>
    (value: A[]) =>
        value.length < target
            ? fail<A[], A[]>('minItems', value, { target, value })
            : succeed<A[], A[]>(value);

/**
 * range tests whether an array's length falls within a specific min and max range.
 */
export const range =
    <A>(min: number, max: number) =>
    (value: A[]) =>
        value.length < min
            ? fail('range.min', value, { min, max, value })
            : value.length > max
            ? fail('range.max', value)
            : succeed(value);

/**
 * filter applies a precondition to each member of an array producing
 * an array where only the successful members are kept.
 */
export const filter =
    <A, B>(p: Precondition<A, B>): Precondition<A[], B[]> =>
    (value: A[]) =>
        succeed<A[], B[]>(
            value
                .map(p)
                .filter(e => e instanceof Right)
                .map(e => e.takeRight())
        );

/**
 * map applies a precondition to each member of an array.
 *
 * If the precondition fails for any of the members,
 * the entire array is considered a failure.
 */
export const map =
    <A, B>(p: Precondition<A, B>): Precondition<A[], B[]> =>
    (value: A[]) => {
        let failed = 0;
        let failures: Failures<A> = {};
        let values = [];
        for (let i = 0; i < value.length; i++) {
            let result = p(value[i]);
            if (result.isLeft()) {
                failed++;
                failures[i] = result.takeLeft();
            } else {
                values[i] = result.takeRight();
            }
        }
        return failed === 0
            ? succeed<A[], B[]>(values)
            : left(AF.create(failures, value, { value }));
    };

/**
 * tuple tests whether the value supplied qualifies as a tuple.
 *
 * Each precondition in the list represents a precondition for its
 * corresponding tuple element.
 */
export const tuple =
    <A, B>(list: Precondition<A, B>[]): Precondition<A[], B[]> =>
    (value: A[]) => {
        if (value.length !== list.length) return fail<A[], B[]>('tuple', value);

        let results = value.map((v, idx) => list[idx](v));

        let fails = results.filter(v => v.isLeft()).map(e => e.takeLeft());

        if (fails.length > 0) {
            let failMap = fails.reduce((p, c, k) => {
                p[k] = c;
                return p;
            }, <Failures<A>>{});

            return left<Failure<A[]>, B[]>(
                AF.create(failMap, value, { value })
            );
        }

        return succeed<A[], B[]>(results.map(e => e.takeRight()));
    };
