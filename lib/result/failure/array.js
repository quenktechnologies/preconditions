"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var record_1 = require("@quenk/noni/lib/data/record");
var either_1 = require("@quenk/noni/lib/data/either");
/**
 * ArrayFailure represents the failed results of applying
 * a precondition to one or more elements of an array.
 */
var ArrayFailure = /** @class */ (function () {
    function ArrayFailure(failures, value, contexts) {
        if (contexts === void 0) { contexts = {}; }
        this.failures = failures;
        this.value = value;
        this.contexts = contexts;
        this.message = 'array';
    }
    Object.defineProperty(ArrayFailure.prototype, "context", {
        get: function () {
            return this.contexts;
        },
        enumerable: true,
        configurable: true
    });
    ArrayFailure.create = function (errs, val, ctx) {
        return new ArrayFailure(errs, val, ctx);
    };
    ArrayFailure.prototype.explain = function (templates, c) {
        if (templates === void 0) { templates = {}; }
        if (c === void 0) { c = {}; }
        return record_1.reduce(this.failures, {}, function (p, f, $index) {
            var _a;
            return record_1.merge(p, (_a = {},
                _a[$index] = f.explain(templates, record_1.merge(c, { $index: $index })),
                _a));
        });
    };
    ArrayFailure.prototype.toError = function (templates, context) {
        if (templates === void 0) { templates = {}; }
        if (context === void 0) { context = {}; }
        var e = this.explain(templates, context);
        return new Error((typeof e === 'object') ? JSON.stringify(e) : e);
    };
    return ArrayFailure;
}());
exports.ArrayFailure = ArrayFailure;
/**
 * fail constructs a new ArrayFailure wrapped in the left part of a Result.
 */
exports.fail = function (fails, val, ctx) {
    if (ctx === void 0) { ctx = {}; }
    return either_1.left(ArrayFailure.create(fails, val, ctx));
};
//# sourceMappingURL=array.js.map