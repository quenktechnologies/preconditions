"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.succeed = exports.fail = void 0;
var either_1 = require("@quenk/noni/lib/data/either");
var failure_1 = require("./failure");
/**
 * fail constructs a new failed Result using the parameters supplied to
 * create a new Failure instance.
 */
exports.fail = function (msg, value, ctx) {
    if (ctx === void 0) { ctx = {}; }
    return either_1.left(failure_1.PrimFailure.create(msg, value, ctx));
};
/**
 * succeed constructs a successful Result wraping the final version
 * of the value in the right side of an Either.
 */
exports.succeed = function (b) {
    return either_1.right(b);
};
//# sourceMappingURL=index.js.map