import PreconditionError from './PreconditionError';
import Func from './Func';

/**
 * number tests if the value supplied is a number.
 * @returns {Predicate}
 */
export function number() {

    return new Func(function number(value) {

        if (typeof value !== 'number')
            return new TypeError('number');

        return value;

    });

}

/**
 * string tests if the value is a string.
 * @returns {Predicate}
 */
export function string() {

    return new Func(function string(value) {

        if (typeof value !== 'string')
            return new TypeError('string');

return value;

    });

}

/**
 * array tests if the value is an array.
 * @returns {Predicate}
 */
export function array() {

    return new Func(function array(value) {

        if (!Array.isArray(value))
            return new TypeError('array');

return value;

    });

}

/**
 * object tests if the value is a js object.
 * @returns {Predicate}
 */
export function object() {

    return new Func(function object(value) {

        if (typeof value !== 'object')
            return new TypeError('object');

        if (Array.isArray(value))
            return new TypeError('object');

return value;

    });

}

/**
 * matches tests if the value satisfies a regular expression.
 * @param {RegExp} pattern
 * @returns {Predicate}
 */
export function matches(pattern) {

    return new Func(function matches(value) {

        if (!pattern.test(value))
            return new PreconditionError('matches', { pattern })

return value;

    });

}

/**
 * range tests if a string, number or array falls within a range
 * @param {number} min
 * @param {number} max
 * @returns {Predicate}
 */
export function range(min, max) {

    return new Func(function range(value) {

        var test = (typeof value === 'number') ?
            value :
            (value.length) ?
            value.length : null;

        if (test === null)
            throw new RangeError(
                `Can only check range on number, string or array! ` +
                `Got "${value}"`);

        if (test < min)
            return new PreconditionError('range', { min, max });

        if (test > max)
            return new PreconditionError('range', { min, max });

return value;

    });

}

/**
 * equals tests if the value is equal to the value specified (strictly).
 * @param {*} target
 */
export function equals(target) {

    return new Func(function equals(value) {

        if (value !== target)
            return new PreconditionError('equals', { target });

return value;

    });

}

/**
 * notNull requires a value to be specified
 * @returns {Predicate}
 */
export function notNull() {

    return new Func(function notNull(value) {

        if (value == null)
            return new Error('notNull');

return value;

    });

}

/**
 * isin requires the value to be enumerated in the supplied list.
 * @param {array} list
 * @returns {Predicate}
 */
export function isin(list) {

    return new Func(function isin(value) {

        if (list.indexOf(value) < 0)
            return new PreconditionError('isin', { list });

return value;

    });

}

/**
 * nullable tests whether the value is null or undefined.
 * @returns {Predicate}
 */
export function nullable() {

    return new Func(function nullable(value) {

        if (value != null)
            return new Error('nullable');

return value;

    });

}

/**
 * empty tests whether the value is empty; an empty string or array counts
 * as empty.
 */
export function empty() {

    return new Func(function empty(value) {

        if (value.length === 0)
            return new Error('empty');

return value;

    });

}

/**
 * length tests if the value is of a certain length.
 * @param {number} len
 */
export function length(len) {

    return new Func(function length(value) {

        if (value.length !== len)
            return new PreconditionError('length', { len });

return value;

    });

}

/**
 * func wraps a function in a Chainable so it can be used as a Predicate.
 * @param {function<null|Error>} cb
 */
export function func(cb) {

    return new Func(cb);

}
