"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var preconditions = require("../failure");
var record_1 = require("@quenk/noni/lib/data/record");
var either_1 = require("@quenk/noni/lib/data/either");
var failure_1 = require("../failure");
/**
 * Failure contains information about a precondition that failed
 * when applied to an object.
 */
var Failure = /** @class */ (function (_super) {
    __extends(Failure, _super);
    function Failure(failures, value, contexts) {
        if (contexts === void 0) { contexts = {}; }
        var _this = _super.call(this, 'object', value, contexts) || this;
        _this.failures = failures;
        _this.value = value;
        _this.contexts = contexts;
        return _this;
    }
    Failure.prototype.explain = function (templates, c) {
        if (templates === void 0) { templates = {}; }
        if (c === void 0) { c = {}; }
        return record_1.reduce(this.failures, {}, function (o, f, $key) {
            var _a;
            return record_1.merge(o, (_a = {},
                _a[$key] = f.explain(templates, record_1.merge(c, { $key: $key })),
                _a));
        });
    };
    return Failure;
}(preconditions.Failure));
exports.Failure = Failure;
/**
 * @private
 */
exports.review = function (reports, value) {
    return (Object.keys(reports.failures).length > 0) ?
        exports.failure(reports.failures, value, { value: value }) :
        failure_1.success(reports.values);
};
/**
 * failure produces a new failure wrapped in the left side
 * of an Either from a map (object) of failures.
 */
exports.failure = function (errors, value, contexts) {
    return either_1.left(new Failure(errors, value, contexts));
};
//# sourceMappingURL=failure.js.map