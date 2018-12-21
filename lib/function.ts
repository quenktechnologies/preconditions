import { Precondition } from './';
import { fail, succeed } from './result';

/**
 * range tests whether a number falls within a specified range.
 */
export const range =
    (min: number, max: number): Precondition<number, number> =>
        (value: number) => (value < min) ?
            fail<number, number>('range.min', value, { min, max }) :
            (value > max) ?
                fail<number, number>('range.max', value, { min, max }) :
                succeed<number, number>(value)

/**
 * isFunction tests if a value is a function.
 */
export const isFunction: Precondition<any, Function> =
    <A>(f: A) => (typeof f === 'function') ?
        succeed<A, Function>(f) :
        fail<A, Function>('function', f);
