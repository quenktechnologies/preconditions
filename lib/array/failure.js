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
var either_1 = require("@quenk/noni/lib/data/either");
var record_1 = require("@quenk/noni/lib/data/record");
var failure_1 = require("../failure");
var result_1 = require("../result");
/**
 * Failure represents the failed results of applying
 * a precondition to one or more elements of an array.
 */
var Failure = /** @class */ (function (_super) {
    __extends(Failure, _super);
    function Failure(failures, value, contexts) {
        if (contexts === void 0) { contexts = {}; }
        var _this = _super.call(this, 'list', value, contexts) || this;
        _this.failures = failures;
        _this.value = value;
        _this.contexts = contexts;
        return _this;
    }
    Failure.prototype.explain = function (templates, c) {
        if (templates === void 0) { templates = {}; }
        if (c === void 0) { c = {}; }
        return record_1.reduce(this.failures, {}, (function (o, f, $index) {
            var _a;
            return record_1.merge(o, (_a = {},
                _a[$index] = f.explain(templates, record_1.merge(c, { $index: $index })),
                _a));
        }));
    };
    return Failure;
}(failure_1.Failure));
exports.Failure = Failure;
/**
 * @private
 */
exports.review = function (value, r) {
    return (Object.keys(r.failures).length > 0) ?
        exports.failure(r.failures, value, { value: value }) :
        result_1.success(r.values);
};
/**
 * failure
 */
exports.failure = function (errors, value, contexts) {
    return either_1.left(new Failure(errors, value, contexts));
};
//# sourceMappingURL=failure.js.map