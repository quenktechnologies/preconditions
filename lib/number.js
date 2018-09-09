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
 * isNumber tests if a value is a number.
 */
exports.isNumber = function (n) { return ((typeof n === 'number') && (!isNaN(n))) ?
    failure_1.success(n) :
    failure_1.failure('isNumber', n); };
/**
 * toNumber casts a string to a number.
 */
exports.toNumber = function (value) {
    var n = Number(value);
    return isNaN(n) ? failure_1.failure('NaN', value, {}) : failure_1.success(n);
};
//# sourceMappingURL=number.js.map