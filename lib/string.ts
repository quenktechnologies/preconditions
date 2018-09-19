import { Precondition } from './';
import { failure, success } from './result';

/**
 * matches tests if the value satisfies a regular expression.
 */
export const matches = (pattern: RegExp): Precondition<string, string> =>
    (value: string) => (!pattern.test(value)) ?
        failure<string, string>('matches', value, { pattern: pattern.toString() }) :
        success<string, string>(value)

/**
 * gt string length test.
 */
export const gt = (target: number): Precondition<string, string> => (value: string) =>
  (value.length > target) ?
        success<string, string>(value) :
        failure<string, string>('gt', value, { target, value }) ;
/**
 * lt string length test.
 */
export const lt = (target: number): Precondition<string, string> => (value: string) =>
  (value.length < target) ?
        success<string, string>(value) :
        failure<string, string>('lt', value, { target, value }) ;

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
 * uppercase transforms a string into uppercase
 */
export const uppercase: Precondition<string, string> =
    (value: string) => success<string, string>(value.toUpperCase());

export const upper = uppercase;

/**
 * lowercase transforms a string into lowercase
 */
export const lowercase: Precondition<string, string> =
    (value: string) => success<string, string>(value.toLowerCase());

export const lower = lowercase;

/**
 * trim the whitespace from a string.
 */
export const trim: Precondition<string, string> =
    (value: string) => success<string, string>(value.trim());

/**
 * split a string into an array.
 */
export const split = (token: string): Precondition<string, string[]> =>
    (value: string) => success<string, string[]>(value.split(token));

/**
 * ne tests whether a string is empty or not.
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
        success<A, string>(a) : failure<A, string>('isString', a);

/**
 * toString casts a value into a string.
 */
export const toString: Precondition<any, string> =
    <A>(a: A) => success<A, string>(String(a));

