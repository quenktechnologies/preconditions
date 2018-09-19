"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var result_1 = require("./result");
/**
 * gt test.
 */
exports.gt = function (target) { return function (value) {
    return (value > target) ?
        result_1.success(value) :
        result_1.failure('gt', value, { target: target, value: value });
}; };
/**
 * lt test.
 */
exports.lt = function (target) { return function (value) {
    return (value < target) ?
        result_1.success(value) :
        result_1.failure('lt', value, { target: target, value: value });
}; };
/**
 * range tests whether a number falls within a specified range.
 */
exports.range = function (min, max) {
    return function (value) { return (value < min) ?
        result_1.failure('range.min', value, { min: min, max: max }) :
        (value > max) ?
            result_1.failure('range.max', value, { min: min, max: max }) :
            result_1.success(value); };
};
/**
 * isNumber tests if a value is a number.
 */
exports.isNumber = function (n) { return ((typeof n === 'number') && (!isNaN(n))) ?
    result_1.success(n) :
    result_1.failure('isNumber', n); };
/**
 * toNumber casts a string to a number.
 */
exports.toNumber = function (value) {
    var n = Number(value);
    return isNaN(n) ? result_1.failure('NaN', value, {}) : result_1.success(n);
};
//# sourceMappingURL=number.js.map