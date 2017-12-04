import { Precondition } from '../';
/**
 * range tests whether a number falls within a specified range.
 */
export declare const range: (min: number, max: number) => Precondition<number, number>;
/**
 * isNumber tests if a value is a number.
 */
export declare const isNumber: Precondition<any, number>;
/**
 * toNumber casts a string to a number.
 */
export declare const toNumber: Precondition<any, number>;
