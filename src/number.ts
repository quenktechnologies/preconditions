import { Type } from '@quenk/noni/lib/data/type';

import { Precondition } from './';
import { fail, succeed } from './result';

/**
 * gt test.
 */
export const gt =
    (target: number): Precondition<number, number> =>
    (value: number) =>
        value > target
            ? succeed<number, number>(value)
            : fail<number, number>('gt', value, { target, value });
/**
 * lt test.
 */
export const lt =
    (target: number): Precondition<number, number> =>
    (value: number) =>
        value < target
            ? succeed<number, number>(value)
            : fail<number, number>('lt', value, { target, value });

/**
 * range tests whether a number falls within a specified range.
 */
export const range =
    (min: number, max: number): Precondition<number, number> =>
    (value: number) =>
        value < min
            ? fail<number, number>('range.min', value, { min, max })
            : value > max
            ? fail<number, number>('range.max', value, { min, max })
            : succeed<number, number>(value);

/**
 * min tests whether a value is more than or equal to the desired target.
 */
export const min =
    (target: number): Precondition<number, number> =>
    value =>
        value >= target
            ? succeed<number, number>(value)
            : fail<number, number>('min', value, { target, value });

/**
 * max tests whether a value is less than or equal to the desired target.
 */
export const max =
    (target: number): Precondition<number, number> =>
    value =>
        value <= target
            ? succeed<number, number>(value)
            : fail<number, number>('max', value, { target, value });

/**
 * isNumber tests if a value is a number.
 */
export const isNumber: Precondition<Type, number> = <A>(n: A) =>
    typeof n === 'number' && !isNaN(n)
        ? succeed<A, number>(n)
        : fail<A, number>('isNumber', n);

/**
 * toNumber casts a string to a number.
 */
export const toNumber: Precondition<Type, number> = <A>(value: A) => {
    if (value === null) return succeed(0);
    else if (Array.isArray(value)) return fail('NaN', value, {});

    let n = Number(value);
    return isNaN(n) ? fail<A, number>('NaN', value, {}) : succeed<A, number>(n);
};
