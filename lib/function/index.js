"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("../");
/**
 * range tests whether a number falls within a specified range.
 */
exports.range = function (min, max) {
    return function (value) { return (value < min) ?
        _1.failure('range.min', value, { min: min, max: max }) :
        (value > max) ?
            _1.failure('range.max', value, { min: min, max: max }) :
            _1.success(value); };
};
/**
 * isFunction tests if a value is a function.
 */
exports.isFunction = function (f) { return (typeof f === 'function') ?
    _1.success(f) :
    _1.failure('function', f); };
//# sourceMappingURL=index.js.map