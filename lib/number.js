"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNumber = exports.isNumber = exports.range = exports.lt = exports.gt = void 0;
const result_1 = require("./result");
/**
 * gt test.
 */
const gt = (target) => (value) => (value > target) ?
    (0, result_1.succeed)(value) :
    (0, result_1.fail)('gt', value, { target, value });
exports.gt = gt;
/**
 * lt test.
 */
const lt = (target) => (value) => (value < target) ?
    (0, result_1.succeed)(value) :
    (0, result_1.fail)('lt', value, { target, value });
exports.lt = lt;
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
 * isNumber tests if a value is a number.
 */
const isNumber = (n) => ((typeof n === 'number') && (!isNaN(n))) ?
    (0, result_1.succeed)(n) :
    (0, result_1.fail)('isNumber', n);
exports.isNumber = isNumber;
/**
 * toNumber casts a string to a number.
 */
const toNumber = (value) => {
    let n = Number(value);
    return isNaN(n) ? (0, result_1.fail)('NaN', value, {}) : (0, result_1.succeed)(n);
};
exports.toNumber = toNumber;
//# sourceMappingURL=number.js.map