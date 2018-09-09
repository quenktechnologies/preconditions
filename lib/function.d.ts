import { Precondition } from './';
/**
 * range tests whether a number falls within a specified range.
 */
export declare const range: (min: number, max: number) => Precondition<number, number>;
/**
 * isFunction tests if a value is a function.
 */
export declare const isFunction: Precondition<any, Function>;
