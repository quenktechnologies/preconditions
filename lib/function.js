"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunction = exports.range = void 0;
var result_1 = require("./result");
/**
 * range tests whether a number falls within a specified range.
 */
exports.range = function (min, max) {
    return function (value) { return (value < min) ?
        result_1.fail('range.min', value, { min: min, max: max }) :
        (value > max) ?
            result_1.fail('range.max', value, { min: min, max: max }) :
            result_1.succeed(value); };
};
/**
 * isFunction tests if a value is a function.
 */
exports.isFunction = function (f) { return (typeof f === 'function') ?
    result_1.succeed(f) :
    result_1.fail('function', f); };
//# sourceMappingURL=function.js.map