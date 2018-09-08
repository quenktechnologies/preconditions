/**
 * The precondition library provides an API for validating
 * whether some value meets a pre-condition before it is used
 * in a program.
 *
 * Users of this library are expected to design their own preconditions,
 * however some primitivies are provided to make things easier.
 */
import { Right, left, right, either } from '@quenk/noni/lib/data/either';
import { Result, failure, success } from './result';
import { Failure } from './failure';

/**
 * Precondition represents some condition that must be satisfied
 * in order for data to be considered a valid type.
 *
 * A Precondition accepts a value of type <A> and returns an Either
 * where the left side contains information about why the precondition
 * failed and the right the resulting type.
 */
export type Precondition<A, B> = (value: A) => Result<A, B>;

/**
 * Type is used by caseOf to pattern match a value.
 */
export type Type<T>
    = string
    | number
    | boolean
    | object
    | { [key: string]: any }
    | { new(): T }
    ;

/**
 * left wraps a value in the left side of an Either
 */
//export const left: <A, B>(a: A) => Either<A, B> = Either.left;

/**
 * right wraps a value in the right side of an Either
 */
//export const right: <A, B>(b: B) => Either<A, B> = Either.right;

/**
 * set the value to the supplied value.
 */
export const set =
    <A, B>(b: B): Precondition<A, B> => (_: A) => success<A, B>(b);

export const cons = set;

/**
 * when conditionally applies one of two preconditions depending
 * on the outcome of a test function.
 */
export const when = <A, B>(
    test: (a: A) => boolean,
    applied: Precondition<A, B>,
    otherwise: Precondition<A, B>): Precondition<A, B> =>
    (value: A) => (test(value) === true) ? applied(value) : otherwise(value);

/**
 * whenTrue conditionally applies "applied" or "otherwise" depending
 * on whether "condition" is true or not.
 */
export const whenTrue =
    <A, B>(
        condition: boolean,
        applied: Precondition<A, B>,
        otherwise: Precondition<A, B>): Precondition<A, B> =>
        (value: A) => (condition === true) ? applied(value) : otherwise(value);

/**
 * whenFalse (opposite of whenTrue).
 */
export const whenFalse = <A, B>(
    condition: boolean,
    applied: Precondition<A, B>,
    otherwise: Precondition<A, B>): Precondition<A, B> =>
    (value: A) => (condition === false) ? applied(value) : otherwise(value);

/**
 * equals tests if the value is equal (strictly) to the value specified.
 */
export const equals = <A, B>(target: B): Precondition<A, B> =>
    (value: A) => (<any>target === value) ?
        success<A, B>(target) :
        failure<A, B>('equals', value, { target });

/**
 * notNull will fail if the value is null or undefined.
 */
export const notNull = <A>(value: A) =>
    ((value == null) || ((typeof value === 'string') && (value === ''))) ?
        failure('notNull', value) :
        success(value)

/**
 * optional applies the precondition given only if the value is not null
 * or undefined.
 */
export const optional = <A, B>(p: Precondition<A, A | B>)
    : Precondition<A, A | B> =>
    (value: A) =>
        ((value == null) || (typeof value === 'string' && value === '')) ?
            success<A, A>(value) : p(value);

/**
 * identity always succeeds with the value it is applied to.
 */
export const identity = <A>(value: A) => success<A, A>(value);

export const id = identity;

/**
 * fail always fails with reason no matter the value supplied.
 */
export const fail = <A>(reason: string): Precondition<A, A> => (value: A) =>
    failure<A, A>(reason, value);

/**
 * or performs the equivalent of a logical 'or' between two preconditions.
 */
export const or =
    <A, B>(left: Precondition<A, B>, right: Precondition<A, B>)
        : Precondition<A, B> =>
        (value: A) => left(value).orElse(() => right(value));

/**
 * and performs the equivalent of a logical 'and' between two preconditions.
 */
export const and =
    <A, B>(l: Precondition<A, A>, r: Precondition<A, B>)
        : Precondition<A, B> =>
        (value: A) => <Result<A, B>>(l(value).chain(r));

/**
 * every takes a set of preconditions and attempts to apply each
 * one after the other to the input.
 */
export const every = <A, B>(p: Precondition<A, B>, ...list: Precondition<B, B>[])
    : Precondition<A, B> => (value: A) =>
        either<Failure<A>, B, Result<A, B>>
            ((f: Failure<A>) => left(f))
((v: B) => <Result<A,B>>list.reduce((e, f) => e.chain(f), right(<B>v)))
            (p(value));

/**
 * exists requires the value to be enumerated in the supplied list.
 */
export const exists = <A>(list: A[]): Precondition<A, A> => (value: A) =>
    (list.indexOf(value) < 0) ?
        failure<A, A>('exists', value, { value, list }) :
        success<A, A>(value)

/**
 * isin requires the value passed to be a member of a provided list.
 */
export const isin = <A>(list: A[]): Precondition<A, A> => (value: A) =>
    list.indexOf(value) > -1 ?
        success<A, A>(value) :
        failure<A, A>('isin', value);

/**
 * match preforms a type/structure matching on the input
 * value in order to decide which precondition to apply.
 *
 * Preconditions must be wrapped in a 'caseOf' precondition.
 */
export const match = <A, B>(p: Precondition<A, B>, ...list: Precondition<A, B>[])
    : Precondition<A, B> => (value: A) => list.reduce((e, f) =>
        (e instanceof Right) ?
            e :
            e.orElse(r => (r.message === 'caseOf') ?
                f(value) : e), p(value));

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
    <A, B>(t: Type<A>, p: Precondition<A, B>): Precondition<A, B> => (value: A) =>
        _kindOf(t, value) ? p(value) : failure<A, B>('caseOf', value, { type: t });

const _prims = ['string', 'number', 'boolean'];

const _kindOf = <A>(t: Type<A>, value: A): boolean =>
    ((_prims.indexOf(typeof t) > -1) && (value === t)) ?
        true :
        ((typeof t === 'function') &&
            (((<Function>t === String) && (typeof value === 'string')) ||
                ((<Function>t === Number) && (typeof value === 'number')) ||
                ((<Function>t === Boolean) && (typeof value === 'boolean')) ||
                ((<Function>t === Array) && (Array.isArray(value))) ||
                (value instanceof <Function>t))) ?
            true :
            ((typeof t === 'object') && (typeof value === 'object')) ?
                Object
                    .keys(t)
                    .every(k => value.hasOwnProperty(k) ?
                        _kindOf((<any>t)[k], (<any>value)[k]) : false) :
                false;
