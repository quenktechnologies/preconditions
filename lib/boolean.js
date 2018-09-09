"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var failure_1 = require("./failure");
/**
 * isBoolean tests if a value is a boolean.
 */
exports.isBoolean = function (n) { return (typeof n === 'boolean') ?
    failure_1.success(n) :
    failure_1.failure('isBoolean', n); };
/**
 * toBoolean casts a value to a boolean.
 *
 * Basically anything that is not null or undefined results in true.
 */
exports.toBoolean = function (value) {
    return ((value == null) || (value === false)) ?
        failure_1.success(false) :
        failure_1.success(true);
};
//# sourceMappingURL=boolean.js.map