"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var either_1 = require("@quenk/noni/lib/data/either");
var failure_1 = require("./failure");
/**
 * failure constructs a failed Result using the parameters supplied to
 * create a new Failure instance.
 */
exports.failure = function (message, value, ctx) {
    if (ctx === void 0) { ctx = {}; }
    return either_1.left(new failure_1.Failure(message, value, ctx));
};
/**
 * success constructs a successful Result wraping the final version
 * of the value in the right side of an Either.
 */
exports.success = function (b) { return either_1.right(b); };
//# sourceMappingURL=result.js.map