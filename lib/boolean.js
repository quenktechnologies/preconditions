"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var result_1 = require("./result");
/**
 * isBoolean tests if a value is a boolean.
 */
exports.isBoolean = function (n) { return (typeof n === 'boolean') ?
    result_1.success(n) :
    result_1.failure('isBoolean', n); };
/**
 * toBoolean casts a value to a boolean.
 *
 * Basically anything that is not null or undefined results in true.
 */
exports.toBoolean = function (value) {
    return ((value == null) || (value === false)) ?
        result_1.success(false) :
        result_1.success(true);
};
//# sourceMappingURL=boolean.js.map