"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toString = exports.isString = exports.notEmpty = exports.split = exports.trim = exports.lower = exports.lowercase = exports.upper = exports.uppercase = exports.range = exports.minLength = exports.maxLength = exports.matches = void 0;
const result_1 = require("./result");
/**
 * matches tests if the value satisfies a regular expression.
 */
const matches = (pattern) => (value) => (!pattern.test(value)) ?
    (0, result_1.fail)('matches', value, { pattern: pattern.toString() }) :
    (0, result_1.succeed)(value);
exports.matches = matches;
/**
 * maxLength test.
 */
const maxLength = (target) => (value) => (value.length > target) ?
    (0, result_1.fail)('maxLength', value, { target, value }) :
    (0, result_1.succeed)(value);
exports.maxLength = maxLength;
/**
 * minLength test.
 */
const minLength = (target) => (value) => (value.length < target) ?
    (0, result_1.fail)('minLength', value, { target, value }) :
    (0, result_1.succeed)(value);
exports.minLength = minLength;
/**
 * range tests whether the length of string falls within a range.
 */
const range = (min, max) => (value) => (value.length < min) ?
    (0, result_1.fail)('range.min', value, { min, max, value }) :
    (value.length > max) ?
        (0, result_1.fail)('range.max', value, { min, max, value }) :
        (0, result_1.succeed)(value);
exports.range = range;
/**
 * uppercase transforms a string into uppercase
 */
const uppercase = (value) => (0, result_1.succeed)(value.toUpperCase());
exports.uppercase = uppercase;
exports.upper = exports.uppercase;
/**
 * lowercase transforms a string into lowercase
 */
const lowercase = (value) => (0, result_1.succeed)(value.toLowerCase());
exports.lowercase = lowercase;
exports.lower = exports.lowercase;
/**
 * trim the whitespace from a string.
 */
const trim = (value) => (0, result_1.succeed)(value.trim());
exports.trim = trim;
/**
 * split a string into an array.
 */
const split = (token) => (value) => (0, result_1.succeed)(value.split(token));
exports.split = split;
/**
 * ne tests whether a string is empty or not.
 */
const notEmpty = (value) => value === '' ?
    (0, result_1.fail)('notEmpty', value) :
    (0, result_1.succeed)(value);
exports.notEmpty = notEmpty;
/**
 * isString tests if a value is a string.
 */
const isString = (a) => (typeof a === 'string') ?
    (0, result_1.succeed)(a) : (0, result_1.fail)('isString', a);
exports.isString = isString;
/**
 * toString casts a value into a string.
 */
const toString = (a) => (0, result_1.succeed)(String(a));
exports.toString = toString;
//# sourceMappingURL=string.js.map