import { Precondition, failure, success } from '../';

/**
 * matches tests if the value satisfies a regular expression.
 */
export const matches = (pattern: RegExp): Precondition<string, string> =>
    (value: string) => (!pattern.test(value)) ?
        failure<string, string>('matches', value, { pattern: pattern.toString() }) :
        success<string, string>(value)

/**
 * range tests whether the length of string falls within a range.
 */
export const range = (min: number, max: number): Precondition<string, string> =>
    (value: string) => (value.length < min) ?
        failure<string, string>('range.min', value, { min, max, value }) :
        (value.length > max) ?
            failure<string, string>('range.max', value, { min, max, value }) :
            success<string, string>(value);

/**
 * upper transforms a string into uppercase
 */
export const upper: Precondition<string, string> =
    (value: string) => success<string, string>(value.toUpperCase());

/**
 * lower transforms a string into lowercase
 */
export const lower: Precondition<string, string> =
    (value: string) => success<string, string>(value.toLowerCase());


/**
 * trim the whitespace from a string.
 */
export const trim: Precondition<string, string> =
    (value: string) => success<string, string>(value.trim());

/**
 * notEmpty tests whether a string is empty or not.
 */
export const notEmpty: Precondition<string, string> =
    (value: string) => value === '' ?
        failure<string, string>('notEmpty', value) :
        success<string, string>(value);

/**
 * isString tests if a value is a string.
 */
export const isString: Precondition<any, string> =
    <A>(a: A) => (typeof a === 'string') ?
        success<A, string>(a) : failure<A, string>('string', a);

/**
 * toString casts a value into a string.
 */
export const toString: Precondition<any, string> =
    <A>(a: A) => success<A, string>(String(a));

