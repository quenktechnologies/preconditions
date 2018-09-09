import { Precondition } from './';
import { failure, success } from './failure';

/**
 * range tests whether a number falls within a specified range.
 */
export const range =
    (min: number, max: number): Precondition<number, number> =>
        (value: number) => (value < min) ?
            failure<number, number>('range.min', value, { min, max }) :
            (value > max) ?
                failure<number, number>('range.max', value, { min, max }) :
                success<number, number>(value)

/**
 * isFunction tests if a value is a function.
 */
export const isFunction: Precondition<any, Function> =
    <A>(f: A) => (typeof f === 'function') ?
        success<A, Function>(f) :
        failure<A, Function>('function', f);
