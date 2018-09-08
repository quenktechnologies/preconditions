"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var result_1 = require("../result");
/**
 * failure flags an async precondtion as failing.
 */
exports.failure = function (message, a, ctx) {
    if (ctx === void 0) { ctx = {}; }
    return Promise.resolve(result_1.failure(message, a, ctx));
};
/**
 * success flags an async precondition as succeeding.
 */
exports.success = function (b) { return Promise.resolve(result_1.success(b)); };
//# sourceMappingURL=failure.js.map