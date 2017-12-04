"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("afpl/lib/util");
var __1 = require("..");
/**
 * ArrayFailure represents the failed results of applying
 * a precondition to one or more elements of an array.
 */
var ArrayFailure = /** @class */ (function (_super) {
    __extends(ArrayFailure, _super);
    function ArrayFailure(failures, value, contexts) {
        if (contexts === void 0) { contexts = {}; }
        var _this = _super.call(this, 'list', value, contexts) || this;
        _this.failures = failures;
        _this.value = value;
        _this.contexts = contexts;
        return _this;
    }
    ArrayFailure.prototype.explain = function (templates, c) {
        if (templates === void 0) { templates = {}; }
        if (c === void 0) { c = {}; }
        return util.reduce(this.failures, (function (o, f, $index) {
            return util.merge(o, (_a = {},
                _a[$index] = f.explain(templates, util.merge(c, { $index: $index })),
                _a));
            var _a;
        }), {});
    };
    return ArrayFailure;
}(__1.Failure));
exports.ArrayFailure = ArrayFailure;
//# sourceMappingURL=ArrayFailure.js.map