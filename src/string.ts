import { Type, isString as _isString } from '@quenk/noni/lib/data/type';

import { Precondition } from './';
import { fail, succeed } from './result';

/**
 * matches tests if the value satisfies a regular expression.
 */
export const matches = (
    pattern: RegExp | string
): Precondition<string, string> => {
    let regex = _isString(pattern) ? new RegExp(pattern) : pattern;
    return (value: string) =>
        !regex.test(value)
            ? fail<string, string>('matches', value, {
                  pattern: pattern.toString()
              })
            : succeed<string, string>(value);
};

export { matches as pattern };

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
    (value: string) => {
        let val = value === '' || value === token ? [] : value.split(token);
        return succeed<string, string[]>(val);
    };

/**
 * nonEmpty rejects empty strings.
 */
export const nonEmpty: Precondition<string, string> = (value: string) =>
    value === ''
        ? fail<string, string>('nonEmpty', value)
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
    succeed<A, string>(a == null ? '' : String(a));
