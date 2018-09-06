import { Precondition, failure, success } from './';

/**
 * isBoolean tests if a value is a boolean.
 */
export const isBoolean: Precondition<any, boolean> =
    <A>(n: A) => (typeof n === 'boolean') ?
        success<A, boolean>(n) :
        failure<A, boolean>('isBoolean', n);

/**
 * toBoolean casts a value to a boolean.
 *
 * Basically anything that is not null or undefined results in true.
 */
export const toBoolean: Precondition<any, boolean> = <A>(value: A) =>
    ((value == null) || (<any>value === false)) ?
        success<A, boolean>(false) :
        success<A, boolean>(true);
