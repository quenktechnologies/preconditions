"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var polate_1 = require("@quenk/polate");
var record_1 = require("@quenk/noni/lib/data/record");
/**
 * PrimFailure is the failure
 */
var PrimFailure = /** @class */ (function () {
    function PrimFailure(message, value, context) {
        if (context === void 0) { context = {}; }
        this.message = message;
        this.value = value;
        this.context = context;
    }
    PrimFailure.create = function (message, value, ctx) {
        if (ctx === void 0) { ctx = {}; }
        return new PrimFailure(message, value, ctx);
    };
    PrimFailure.prototype.explain = function (templates, ctx) {
        if (templates === void 0) { templates = {}; }
        if (ctx === void 0) { ctx = {}; }
        var context = record_1.merge(this.context, ctx);
        var key = context.$key;
        var $value = this.value;
        var split = templates[this.message.split('.')[0]];
        var str = this.message;
        var combined = (typeof context['$key'] === 'string') ?
            context.$key + "." + this.message :
            this.message;
        if (templates[combined]) {
            str = templates[combined];
        }
        else if (templates[key]) {
            str = templates[key];
        }
        else if (templates[split]) {
            str = templates[split];
        }
        else if (templates[this.message]) {
            str = templates[this.message];
        }
        return polate_1.polate(str, record_1.merge(context, { $value: $value }));
    };
    PrimFailure.prototype.toError = function (templates, context) {
        if (templates === void 0) { templates = {}; }
        if (context === void 0) { context = {}; }
        return new Error(this.explain(templates, context));
    };
    return PrimFailure;
}());
exports.PrimFailure = PrimFailure;
/**
 * ModifiedFailure is used in situations where a precondition is composite
 * and we need to modify the value to be the original left one.
 */
var ModifiedFailure = /** @class */ (function () {
    function ModifiedFailure(value, previous) {
        this.value = value;
        this.previous = previous;
    }
    Object.defineProperty(ModifiedFailure.prototype, "message", {
        get: function () {
            return this.previous.message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModifiedFailure.prototype, "context", {
        get: function () {
            return this.previous.context;
        },
        enumerable: true,
        configurable: true
    });
    ModifiedFailure.create = function (value, previous) {
        return new ModifiedFailure(value, previous);
    };
    ModifiedFailure.prototype.explain = function (templates, ctx) {
        if (templates === void 0) { templates = {}; }
        if (ctx === void 0) { ctx = {}; }
        return this.previous.explain(templates, record_1.merge(ctx, { value: this.value }));
    };
    ModifiedFailure.prototype.toError = function (templates, context) {
        if (templates === void 0) { templates = {}; }
        if (context === void 0) { context = {}; }
        var e = this.explain(templates, context);
        return new Error((typeof e === 'object') ? JSON.stringify(e) : e);
    };
    return ModifiedFailure;
}());
exports.ModifiedFailure = ModifiedFailure;
var DualFailure = /** @class */ (function () {
    function DualFailure(value, left, right) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
    Object.defineProperty(DualFailure.prototype, "message", {
        get: function () {
            return this.left.message + " | " + this.right.message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DualFailure.prototype, "context", {
        get: function () {
            return { left: this.left.context, right: this.right.context };
        },
        enumerable: true,
        configurable: true
    });
    DualFailure.prototype.explain = function (templates, ctx) {
        if (templates === void 0) { templates = {}; }
        if (ctx === void 0) { ctx = {}; }
        var _ctx = record_1.merge(ctx, { value: this.value });
        return {
            left: this.left.explain(templates, _ctx),
            right: this.right.explain(templates, _ctx)
        };
    };
    DualFailure.prototype.toError = function (templates, context) {
        if (templates === void 0) { templates = {}; }
        if (context === void 0) { context = {}; }
        var e = this.explain(templates, context);
        return new Error((typeof e === 'object') ? JSON.stringify(e) : e);
    };
    return DualFailure;
}());
exports.DualFailure = DualFailure;
//# sourceMappingURL=index.js.map