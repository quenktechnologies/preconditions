import { Precondition } from './';
import { failure, success } from './result';

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
 * isNumber tests if a value is a number.
 */
export const isNumber: Precondition<any, number> =
    <A>(n: A) => ((typeof n === 'number') && (!isNaN(n))) ?
        success<A, number>(n) :
        failure<A, number>('isNumber', n);

/**
 * toNumber casts a string to a number.
 */
export const toNumber: Precondition<any, number> = <A>(value: A) => {

    let n = Number(value);

    return isNaN(n) ? failure<A, number>('NaN', value, {}) : success<A, number>(n);

}

