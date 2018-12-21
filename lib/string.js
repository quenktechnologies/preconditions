"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var result_1 = require("./result");
/**
 * matches tests if the value satisfies a regular expression.
 */
exports.matches = function (pattern) {
    return function (value) { return (!pattern.test(value)) ?
        result_1.fail('matches', value, { pattern: pattern.toString() }) :
        result_1.succeed(value); };
};
/**
 * maxLength test.
 */
exports.maxLength = function (target) { return function (value) {
    return (value.length > target) ?
        result_1.fail('maxLength', value, { target: target, value: value }) :
        result_1.succeed(value);
}; };
/**
 * minLength test.
 */
exports.minLength = function (target) { return function (value) {
    return (value.length < target) ?
        result_1.fail('minLength', value, { target: target, value: value }) :
        result_1.succeed(value);
}; };
/**
 * range tests whether the length of string falls within a range.
 */
exports.range = function (min, max) {
    return function (value) { return (value.length < min) ?
        result_1.fail('range.min', value, { min: min, max: max, value: value }) :
        (value.length > max) ?
            result_1.fail('range.max', value, { min: min, max: max, value: value }) :
            result_1.succeed(value); };
};
/**
 * uppercase transforms a string into uppercase
 */
exports.uppercase = function (value) { return result_1.succeed(value.toUpperCase()); };
exports.upper = exports.uppercase;
/**
 * lowercase transforms a string into lowercase
 */
exports.lowercase = function (value) { return result_1.succeed(value.toLowerCase()); };
exports.lower = exports.lowercase;
/**
 * trim the whitespace from a string.
 */
exports.trim = function (value) { return result_1.succeed(value.trim()); };
/**
 * split a string into an array.
 */
exports.split = function (token) {
    return function (value) { return result_1.succeed(value.split(token)); };
};
/**
 * ne tests whether a string is empty or not.
 */
exports.notEmpty = function (value) { return value === '' ?
    result_1.fail('notEmpty', value) :
    result_1.succeed(value); };
/**
 * isString tests if a value is a string.
 */
exports.isString = function (a) { return (typeof a === 'string') ?
    result_1.succeed(a) : result_1.fail('isString', a); };
/**
 * toString casts a value into a string.
 */
exports.toString = function (a) { return result_1.succeed(String(a)); };
//# sourceMappingURL=string.js.map