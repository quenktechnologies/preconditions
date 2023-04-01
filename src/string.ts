import { Type } from '@quenk/noni/lib/data/type';

import { Precondition } from './';
import { fail, succeed } from './result';

/**
 * matches tests if the value satisfies a regular expression.
 */
export const matches =
    (pattern: RegExp): Precondition<string, string> =>
    (value: string) =>
        !pattern.test(value)
            ? fail<string, string>('matches', value, {
                  pattern: pattern.toString()
              })
            : succeed<string, string>(value);

/**
 * maxLength test.
 */
export const maxLength =
    (target: number): Precondition<string, string> =>
    (value: string) =>
        value.length > target
            ? fail<string, string>('maxLength', value, { target, value })
            : succeed<string, string>(value);
/**
 * minLength test.
 */
export const minLength =
    (target: number): Precondition<string, string> =>
    (value: string) =>
        value.length < target
            ? fail<string, string>('minLength', value, { target, value })
            : succeed<string, string>(value);

/**
 * range tests whether the length of string falls within a range.
 */
export const range =
    (min: number, max: number): Precondition<string, string> =>
    (value: string) =>
        value.length < min
            ? fail<string, string>('range.min', value, { min, max, value })
            : value.length > max
            ? fail<string, string>('range.max', value, { min, max, value })
            : succeed<string, string>(value);

/**
 * uppercase transforms a string into uppercase
 */
export const uppercase: Precondition<string, string> = (value: string) =>
    succeed<string, string>(value.toUpperCase());

export const upper = uppercase;

/**
 * lowercase transforms a string into lowercase
 */
export const lowercase: Precondition<string, string> = (value: string) =>
    succeed<string, string>(value.toLowerCase());

export const lower = lowercase;

/**
 * trim the whitespace from a string.
 */
export const trim: Precondition<string, string> = (value: string) =>
    succeed<string, string>(value.trim());

/**
 * split a string into an array.
 */
export const split =
    (token: string): Precondition<string, string[]> =>
    (value: string) =>
        succeed<string, string[]>(value.split(token));

/**
 * ne tests whether a string is empty or not.
 */
export const notEmpty: Precondition<string, string> = (value: string) =>
    value === ''
        ? fail<string, string>('notEmpty', value)
        : succeed<string, string>(value);

/**
 * isString tests if a value is a string.
 */
export const isString: Precondition<Type, string> = <A>(a: A) =>
    typeof a === 'string'
        ? succeed<A, string>(a)
        : fail<A, string>('isString', a);

/**
 * toString casts a value into a string.
 */
export const toString: Precondition<Type, string> = <A>(a: A) =>
    succeed<A, string>(String(a));
