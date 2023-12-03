/**
 * The precondition library provides an API for validating
 * whether some value meets a pre-condition before it is used
 * in a program.
 *
 * Users of this library are expected to design their own preconditions,
 * however some primitivies are provided to make things easier.
 */
import { Left, Right, left, right } from '@quenk/noni/lib/data/either';
import { Type, Pattern, test, isObject } from '@quenk/noni/lib/data/type';

import { Result, fail, succeed } from './result';
import { Failure, ModifiedFailure as MF, DualFailure } from './result/failure';

/**
 * Precondition represents some condition that must be satisfied
 * in order for data to be considered a valid type.
 *
 * A Precondition accepts a value of type <A> and returns an Either
 * where the left side contains information about why the precondition
 * failed or the right the resulting type and value.
 */
export type Precondition<A, B> = (value: A) => Result<A, B>;

/**
 * A map of key precondition pairs.
 */
export interface Preconditions<A, B> {
    [key: string]: Precondition<A, B>;
}

/**
 * constant forces the value to be the supplied value.
 */
export const constant =
    <A, B>(b: B): Precondition<A, B> =>
    (_: A) =>
        succeed<A, B>(b);

/**
 * when conditionally applies one of two preconditions depending
 * on the outcome of a test function.
 */
export const when =
    <A, B>(
        test: (a: A) => boolean,
        applied: Precondition<A, B>,
        otherwise: Precondition<A, B>
    ): Precondition<A, B> =>
    (value: A) =>
        test(value) === true ? applied(value) : otherwise(value);

/**
 * whenTrue conditionally applies "applied" or "otherwise" depending
 * on whether "condition" is true or not.
 */
export const whenTrue =
    <A, B>(
        condition: boolean,
        applied: Precondition<A, B>,
        otherwise: Precondition<A, B>
    ): Precondition<A, B> =>
    (value: A) =>
        condition === true ? applied(value) : otherwise(value);

/**
 * whenFalse (opposite of whenTrue).
 */
export const whenFalse =
    <A, B>(
        condition: boolean,
        applied: Precondition<A, B>,
        otherwise: Precondition<A, B>
    ): Precondition<A, B> =>
    (value: A) =>
        condition === false ? applied(value) : otherwise(value);

/**
 * eq tests if the value is equal (strictly) to the target.
 */
export const eq =
    <A, B>(target: B): Precondition<A, B> =>
    (value: A) =>
        <Type>target === value
            ? succeed<A, B>(target)
            : fail<A, B>('eq', value, { target });

/**
 * neq tests if the value is not equal (strictly) to the target.
 */
export const neq =
    <A, B>(target: B): Precondition<A, B> =>
    (value: A) =>
        <Type>target === value
            ? fail<A, B>('neq', value, { target })
            : succeed<A, B>(target);

/**
 * notNull will fail if the value is null or undefined.
 */
export const notNull = <A>(value: A): Result<A, A> =>
    value == null || (typeof value === 'string' && value === '')
        ? fail('notNull', value)
        : succeed(value);

/**
 * optional applies the precondition given only if the value is not null
 * or undefined.
 */
export const optional =
    <A, B>(p: Precondition<A, A | B>): Precondition<A, A | B> =>
    (value: A) =>
        value == null || (typeof value === 'string' && value === '')
            ? succeed<A, A>(value)
            : p(value);

/**
 * defaultValue assigns a default value if the value to the precondition is
 * nullable.
 */
export const defaultValue =
    <A>(fallback: A): Precondition<A, A> =>
    (value?: A) =>
        succeed(value == null ? fallback : value);

/**
 * identity always succeeds with the value it is applied to.
 */
export const identity = <A>(value: A) => succeed<A, A>(value);

/**
 * discard throws away a value by assigning it ot undefined.
 */
export const discard = <A>(_: A) => succeed<A, undefined>(undefined);

/**
 * reject always fails with reason no matter the value supplied.
 */
export const reject =
    <A, B>(reason: string): Precondition<A, B> =>
    (value: A) =>
        fail<A, B>(reason, value);

/**
 * or performs the equivalent of a logical 'or' between two preconditions.
 */
export const or =
    <A, B>(
        left: Precondition<A, B>,
        right: Precondition<A, B>
    ): Precondition<A, B> =>
    (value: A) =>
        left(value).orElse(f =>
            right(value).lmap(f2 => new DualFailure(value, f, f2))
        );

/**
 * and performs the equivalent of a logical 'and' between two preconditions.
 */
export const and =
    <A, B, C>(
        l: Precondition<A, B>,
        r: Precondition<B, C>
    ): Precondition<A, C> =>
    (value: A) => {
        let result = l(value);

        if (result instanceof Left) {
            return left<Failure<A>, C>(result.takeLeft());
        } else {
            let result2 = r(result.takeRight());

            if (result2 instanceof Left)
                return left<Failure<A>, C>(
                    MF.create(value, result2.takeLeft())
                );

            return right<Failure<A>, C>(result2.takeRight());
        }
    };

/**
 * every takes a set of preconditions and attempts to apply each
 * one after the other to the input.
 */
export const every =
    <A, B>(
        p: Precondition<A, B>,
        ...list: Precondition<B, B>[]
    ): Precondition<A, B> =>
    (value: A) => {
        let r = p(value);

        if (r instanceof Left) return <Result<A, B>>r;

        let r2 = list.reduce(
            (p: Result<B, B>, c) => p.chain(c),
            right<Failure<B>, B>(r.takeRight())
        );

        if (r2 instanceof Left)
            return left<Failure<A>, B>(MF.create(value, r2.takeLeft()));

        return right<Failure<A>, B>(r2.takeRight());
    };

/**
 * anyOf applies all of the preconditions provided until one succeeds.
 */
export const anyOf =
    <A, B>(...list: Precondition<A, B>[]): Precondition<A, B> =>
    (value: A) => {
        let result: Result<A, B> = fail('anyOf', value);

        for (let i = 0; i < list.length; i++) {
            result = list[i](value);

            if (result.isRight()) break;
        }

        return result;
    };

/**
 * exists requires the value to be enumerated in the supplied list.
 */
export const exists =
    <A>(list: A[]): Precondition<A, A> =>
    (value: A) =>
        list.indexOf(value) < 0
            ? fail<A, A>('exists', value, { value, list })
            : succeed<A, A>(value);

/**
 * isin requires the value passed to be a member of a provided list.
 */
export const isin =
    <A>(list: A[]): Precondition<A, A> =>
    (value: A) =>
        list.indexOf(value) > -1
            ? succeed<A, A>(value)
            : fail<A, A>('isin', value);

/**
 * match preforms a type/structure matching on the input
 * value in order to decide which precondition to apply.
 *
 * Preconditions must be wrapped in a 'caseOf' precondition.
 */
export const match =
    <A, B>(
        p: Precondition<A, B>,
        ...list: Precondition<A, B>[]
    ): Precondition<A, B> =>
    (value: A) =>
        list.reduce(
            (e, f) =>
                e instanceof Right
                    ? e
                    : e.orElse(r => (r.message === 'caseOf' ? f(value) : e)),
            p(value)
        );

/**
 * caseOf allows for the selective application of a precondition
 * based on the type or structure of the value.
 *
 * Pattern matching works as follows:
 * string -> Matches on the value of the string.
 * number -> Matches on the value of the number.
 * boolean -> Matches on the value of the boolean.
 * object -> Each key of the object is matched on the value, all must match.
 * function -> Treated as a constructor and results in an instanceof check.
 *             For String,Number and Boolean, this uses the typeof check.
 */
export const caseOf =
    <A, B>(t: Pattern<A>, p: Precondition<A, B>): Precondition<A, B> =>
    (value: A) =>
        test(value, t) ? p(value) : fail<A, B>('caseOf', value, { type: t });

/**
 * log the value to the console.
 */
export const log = <A>(value: A): Result<A, A> => (
    console.log(value), succeed(value)
);

/**
 * typeOf tests whether the value has the specified type.
 */
export const typeOf =
    <A>(type: string) =>
    (value: A) => {
        let result;
        if (type === 'array') result = Array.isArray(value);
        else if (type === 'object') result = isObject(value);
        else result = typeof value === type;
        return result
            ? succeed<A, A>(value)
            : fail<A, A>(type, value, { type });
    };

export { typeOf as type };

/**
 * tee applies each of the provided preconditions to a single value.
 *
 * This results in a list of values each corresponding to a value in the array
 * upon success. This precondition fails on the first failed precondition
 * encountered.
 */
export const tee =
    <A, B>(precs: Precondition<A, B>[]): Precondition<A, B[]> =>
    (value: A) => {
        let results: B[] = [];
        for (let i = 0; i < precs.length; i++) {
            let prec = precs[i];
            let result = prec(value);

            if (result.isLeft()) return <Result<A, B[]>>(<unknown>result);

            results.push(result.takeRight());
        }
        return succeed<A, B[]>(results);
    };
