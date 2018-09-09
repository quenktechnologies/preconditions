"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var failure_1 = require("./failure");
/**
 * range tests whether a number falls within a specified range.
 */
exports.range = function (min, max) {
    return function (value) { return (value < min) ?
        failure_1.failure('range.min', value, { min: min, max: max }) :
        (value > max) ?
            failure_1.failure('range.max', value, { min: min, max: max }) :
            failure_1.success(value); };
};
/**
 * isFunction tests if a value is a function.
 */
exports.isFunction = function (f) { return (typeof f === 'function') ?
    failure_1.success(f) :
    failure_1.failure('function', f); };
//# sourceMappingURL=function.js.map