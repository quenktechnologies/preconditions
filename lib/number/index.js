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
 * isNumber tests if a value is a number.
 */
exports.isNumber = function (n) { return ((typeof n === 'number') && (!isNaN(n))) ?
    _1.success(n) :
    _1.failure('number', n); };
/**
 * toNumber casts a string to a number.
 */
exports.toNumber = function (value) {
    var n = Number(value);
    return isNaN(n) ? _1.failure('NaN', value, {}) : _1.success(n);
};
//# sourceMappingURL=index.js.map