"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var failure_1 = require("./failure");
/**
 * matches tests if the value satisfies a regular expression.
 */
exports.matches = function (pattern) {
    return function (value) { return (!pattern.test(value)) ?
        failure_1.failure('matches', value, { pattern: pattern.toString() }) :
        failure_1.success(value); };
};
/**
 * range tests whether the length of string falls within a range.
 */
exports.range = function (min, max) {
    return function (value) { return (value.length < min) ?
        failure_1.failure('range.min', value, { min: min, max: max, value: value }) :
        (value.length > max) ?
            failure_1.failure('range.max', value, { min: min, max: max, value: value }) :
            failure_1.success(value); };
};
/**
 * upper transforms a string into uppercase
 */
exports.upper = function (value) { return failure_1.success(value.toUpperCase()); };
/**
 * lower transforms a string into lowercase
 */
exports.lower = function (value) { return failure_1.success(value.toLowerCase()); };
/**
 * trim the whitespace from a string.
 */
exports.trim = function (value) { return failure_1.success(value.trim()); };
/**
 * notEmpty tests whether a string is empty or not.
 */
exports.notEmpty = function (value) { return value === '' ?
    failure_1.failure('notEmpty', value) :
    failure_1.success(value); };
/**
 * isString tests if a value is a string.
 */
exports.isString = function (a) { return (typeof a === 'string') ?
    failure_1.success(a) : failure_1.failure('isString', a); };
/**
 * toString casts a value into a string.
 */
exports.toString = function (a) { return failure_1.success(String(a)); };
//# sourceMappingURL=string.js.map