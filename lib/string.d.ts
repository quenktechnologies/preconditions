import { Precondition } from './';
/**
 * matches tests if the value satisfies a regular expression.
 */
export declare const matches: (pattern: RegExp) => Precondition<string, string>;
/**
 * range tests whether the length of string falls within a range.
 */
export declare const range: (min: number, max: number) => Precondition<string, string>;
/**
 * upper transforms a string into uppercase
 */
export declare const upper: Precondition<string, string>;
/**
 * lower transforms a string into lowercase
 */
export declare const lower: Precondition<string, string>;
/**
 * trim the whitespace from a string.
 */
export declare const trim: Precondition<string, string>;
/**
 * notEmpty tests whether a string is empty or not.
 */
export declare const notEmpty: Precondition<string, string>;
/**
 * isString tests if a value is a string.
 */
export declare const isString: Precondition<any, string>;
/**
 * toString casts a value into a string.
 */
export declare const toString: Precondition<any, string>;
