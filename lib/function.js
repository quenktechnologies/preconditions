"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunction = exports.range = void 0;
const result_1 = require("./result");
/**
 * range tests whether a number falls within a specified range.
 */
const range = (min, max) => (value) => (value < min) ?
    (0, result_1.fail)('range.min', value, { min, max }) :
    (value > max) ?
        (0, result_1.fail)('range.max', value, { min, max }) :
        (0, result_1.succeed)(value);
exports.range = range;
/**
 * isFunction tests if a value is a function.
 */
const isFunction = (f) => (typeof f === 'function') ?
    (0, result_1.succeed)(f) :
    (0, result_1.fail)('function', f);
exports.isFunction = isFunction;
//# sourceMappingURL=function.js.map