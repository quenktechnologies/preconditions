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
var afpl = require("afpl");
var Sync = require("./Map");
var Promise = require("bluebird");
/**
 * And
 */
var And = /** @class */ (function () {
    function And(left, right) {
        this.left = left;
        this.right = right;
    }
    And.prototype.apply = function (value) {
        var _this = this;
        return this
            .left
            .apply(value).
            then(function (e) { return e.cata(Promise.resolve, function (v) { return _this.right.apply(v); }); });
    };
    return And;
}());
exports.And = And;
var Func = /** @class */ (function () {
    function Func(f) {
        this.f = f;
    }
    Func.prototype.apply = function (value) {
        return this.f(value);
    };
    return Func;
}());
exports.Func = Func;
/**
 * Map for async preconditions
 */
var Map = /** @class */ (function () {
    function Map() {
    }
    Map.prototype.getConditions = function () {
        return this;
    };
    Map.prototype.apply = function (value) {
        var conditions = this.getConditions();
        var init = Promise.resolve({ failures: {}, values: {} });
        if (typeof value !== 'object') {
            return Promise.resolve(Sync.mapFail({}, value));
        }
        else {
            return afpl.util.reduce(conditions, function (p, condition, key) {
                return p.then(function (r) {
                    return condition
                        .apply(value[key])
                        .then(function (e) {
                        return Promise.resolve(e.cata(Sync.whenLeft(key, r), Sync.whenRight(key, r)));
                    });
                });
            }, init)
                .then(function (r) {
                if (Object.keys(r.failures).length > 0)
                    return Promise.resolve(Sync.mapFail(r.failures, value));
                else
                    return Promise
                        .resolve(Sync.valid(r.values));
            });
        }
    };
    return Map;
}());
exports.Map = Map;
/**
 * Hash is like Map except you specify the preconditions by passing
 * a plain old javascript object.
 */
var Hash = /** @class */ (function (_super) {
    __extends(Hash, _super);
    function Hash(conditions) {
        var _this = _super.call(this) || this;
        _this.conditions = conditions;
        return _this;
    }
    Hash.prototype.getConditions = function () {
        return this.conditions;
    };
    return Hash;
}(Map));
exports.Hash = Hash;
exports.fail = function (message, value, ctx) {
    if (ctx === void 0) { ctx = {}; }
    return Promise.resolve(Sync.fail(message, value, ctx));
};
exports.mapFail = function (errors, value, contexts) {
    if (contexts === void 0) { contexts = {}; }
    return Promise.resolve(Sync.mapFail(errors, value, contexts));
};
exports.valid = function (b) { return Promise.resolve(Sync.valid(b)); };
/**
 * func
 */
exports.func = function (f) { return new Func(f); };
/**
 * or
 */
exports.or = function (left, right) {
    return exports.func(function (value) { return left.apply(value).then(function (e) {
        return e.cata(function () { return right.apply(value); }, function (v) { return exports.valid(v); });
    }); });
};
/**
 * and
 */
exports.and = function (left, right) {
    return exports.func(function (value) { return left.apply(value).then(function (e) {
        return e.cata(function (f) { return Promise.resolve(afpl.Either.left(f)); }, function (v) { return right.apply(v); });
    }); });
};
/**
 * set
 */
exports.set = function (v) { return exports.func(function (_a) { return exports.valid(v); }); };
exports.wrap = function (s) {
    return exports.func(function (value) { return s.apply(value).cata(Promise.resolve, Promise.resolve); });
};
//# sourceMappingURL=Async.js.map