"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("../");
/**
 * matches tests if the value satisfies a regular expression.
 */
exports.matches = function (pattern) {
    return function (value) { return (!pattern.test(value)) ?
        _1.failure('matches', value, { pattern: pattern.toString() }) :
        _1.success(value); };
};
/**
 * range tests whether the length of string falls within a range.
 */
exports.range = function (min, max) {
    return function (value) { return (value.length < min) ?
        _1.failure('range.min', value, { min: min, max: max, value: value }) :
        (value.length > max) ?
            _1.failure('range.max', value, { min: min, max: max, value: value }) :
            _1.success(value); };
};
/**
 * upper transforms a string into uppercase
 */
exports.upper = function (value) { return _1.success(value.toUpperCase()); };
/**
 * lower transforms a string into lowercase
 */
exports.lower = function (value) { return _1.success(value.toLowerCase()); };
/**
 * trim the whitespace from a string.
 */
exports.trim = function (value) { return _1.success(value.trim()); };
/**
 * notEmpty tests whether a string is empty or not.
 */
exports.notEmpty = function (value) { return value === '' ?
    _1.failure('notEmpty', value) :
    _1.success(value); };
/**
 * isString tests if a value is a string.
 */
exports.isString = function (a) { return (typeof a === 'string') ?
    _1.success(a) : _1.failure('string', a); };
/**
 * toString casts a value into a string.
 */
exports.toString = function (a) { return _1.success(String(a)); };
//# sourceMappingURL=index.js.map