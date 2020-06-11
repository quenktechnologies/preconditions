"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.RecordFailure = void 0;
var record_1 = require("@quenk/noni/lib/data/record");
var either_1 = require("@quenk/noni/lib/data/either");
/**
 * RecordFailure contains information about a precondition that failed
 * when applied to an object.
 */
var RecordFailure = /** @class */ (function () {
    function RecordFailure(failures, value, contexts) {
        if (contexts === void 0) { contexts = {}; }
        this.failures = failures;
        this.value = value;
        this.contexts = contexts;
        this.message = 'object';
    }
    Object.defineProperty(RecordFailure.prototype, "context", {
        get: function () {
            return this.contexts;
        },
        enumerable: false,
        configurable: true
    });
    RecordFailure.create = function (errs, val, ctxs) {
        if (ctxs === void 0) { ctxs = {}; }
        return new RecordFailure(errs, val, ctxs);
    };
    RecordFailure.prototype.explain = function (templates, c) {
        if (templates === void 0) { templates = {}; }
        if (c === void 0) { c = {}; }
        return record_1.reduce(this.failures, {}, function (o, f, $key) {
            var _a;
            return record_1.merge(o, (_a = {},
                _a[$key] = f.explain(templates, record_1.merge(c, { $key: $key })),
                _a));
        });
    };
    RecordFailure.prototype.toError = function (templates, context) {
        if (templates === void 0) { templates = {}; }
        if (context === void 0) { context = {}; }
        var e = this.explain(templates, context);
        return new Error((typeof e === 'object') ? JSON.stringify(e) : e);
    };
    return RecordFailure;
}());
exports.RecordFailure = RecordFailure;
/**
 * fail constructs a new RecordFailure wrapped in the left part of a Result.
 */
exports.fail = function (failures, value, ctx) {
    if (ctx === void 0) { ctx = {}; }
    return either_1.left(RecordFailure.create(failures, value, ctx));
};
//# sourceMappingURL=record.js.map