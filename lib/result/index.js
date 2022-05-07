"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.succeed = exports.fail = void 0;
const either_1 = require("@quenk/noni/lib/data/either");
const failure_1 = require("./failure");
/**
 * fail constructs a new failed Result using the parameters supplied to
 * create a new Failure instance.
 */
const fail = (msg, value, ctx = {}) => (0, either_1.left)(failure_1.PrimFailure.create(msg, value, ctx));
exports.fail = fail;
/**
 * succeed constructs a successful Result wraping the final version
 * of the value in the right side of an Either.
 */
const succeed = (b) => (0, either_1.right)(b);
exports.succeed = succeed;
//# sourceMappingURL=index.js.map