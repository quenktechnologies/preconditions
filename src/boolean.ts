import { Type } from '@quenk/noni/lib/data/type';

import { Precondition } from './';
import { fail, succeed } from './result';

/**
 * isBoolean tests if a value is a boolean.
 */
export const isBoolean: Precondition<Type, boolean> = <A>(n: A) =>
    typeof n === 'boolean'
        ? succeed<A, boolean>(n)
        : fail<A, boolean>('isBoolean', n);

/**
 * toBoolean casts a value to a boolean.
 *
 * Basically anything that is not null or undefined results in true.
 */
export const toBoolean: Precondition<Type, boolean> = <A>(value: A) =>
    succeed<A, boolean>(Boolean(value));
