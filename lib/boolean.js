"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
/**
 * isBoolean tests if a value is a boolean.
 */
exports.isBoolean = function (n) { return (typeof n === 'boolean') ?
    _1.success(n) :
    _1.failure('isBoolean', n); };
/**
 * toBoolean casts a value to a boolean.
 *
 * Basically anything that is not null or undefined results in true.
 */
exports.toBoolean = function (value) {
    return ((value == null) || (value === false)) ?
        _1.success(false) :
        _1.success(true);
};
//# sourceMappingURL=boolean.js.map