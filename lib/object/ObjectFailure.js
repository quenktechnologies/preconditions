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
var _1 = require("../");
/**
 * ObjectFailure contains information about a precondition that failed
 * when applied to an object.
 */
var ObjectFailure = /** @class */ (function (_super) {
    __extends(ObjectFailure, _super);
    function ObjectFailure(failures, value, contexts) {
        if (contexts === void 0) { contexts = {}; }
        var _this = _super.call(this, 'object', value, contexts) || this;
        _this.failures = failures;
        _this.value = value;
        _this.contexts = contexts;
        return _this;
    }
    ObjectFailure.prototype.explain = function (templates, c) {
        if (templates === void 0) { templates = {}; }
        if (c === void 0) { c = {}; }
        return util.reduce(this.failures, function (o, f, $key) {
            return util.merge(o, (_a = {},
                _a[$key] = f.explain(templates, util.merge(c, { $key: $key })),
                _a));
            var _a;
        }, {});
    };
    return ObjectFailure;
}(_1.Failure));
exports.ObjectFailure = ObjectFailure;
//# sourceMappingURL=ObjectFailure.js.map