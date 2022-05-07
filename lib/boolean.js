"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBoolean = exports.isBoolean = void 0;
const result_1 = require("./result");
/**
 * isBoolean tests if a value is a boolean.
 */
const isBoolean = (n) => (typeof n === 'boolean') ?
    (0, result_1.succeed)(n) :
    (0, result_1.fail)('isBoolean', n);
exports.isBoolean = isBoolean;
/**
 * toBoolean casts a value to a boolean.
 *
 * Basically anything that is not null or undefined results in true.
 */
const toBoolean = (value) => ((value == null) || (value === false)) ?
    (0, result_1.succeed)(false) :
    (0, result_1.succeed)(true);
exports.toBoolean = toBoolean;
//# sourceMappingURL=boolean.js.map