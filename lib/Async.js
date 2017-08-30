"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var afpl = require("afpl");
var Sync = require("./Map");
var Promise = require("bluebird");
/**
 * And
 */
var And = (function () {
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
var Func = (function () {
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
var Map = (function () {
    function Map() {
    }
    Map.prototype.apply = function (value) {
        var conditions = this;
        var init = Promise.resolve({ failures: {}, values: {} });
        var left = function (key, _b) {
            var failures = _b.failures, values = _b.values;
            return function (f) {
                return Promise.resolve({
                    values: values,
                    failures: afpl.util.merge(failures, (_b = {},
                        _b[key] = f,
                        _b))
                });
                var _b;
            };
        };
        var right = function (key, _b) {
            var failures = _b.failures, values = _b.values;
            return function (b) {
                return Promise.resolve({
                    values: afpl.util.merge(values, (_b = {},
                        _b[key] = b,
                        _b)), failures: failures
                });
                var _b;
            };
        };
        if (typeof value !== 'object') {
            return Promise.resolve(Sync.mapFail({}, value));
        }
        else {
            return afpl.util.reduce(conditions, function (p, condition, key) {
                return p.then(function (r) {
                    return condition
                        .apply(value[key])
                        .then(function (e) {
                        return e.cata(left(key, r), right(key, r));
                    });
                });
            }, init)
                .then(function (r) {
                if (Object.keys(r.failures).length > 0)
                    return Promise.resolve(Sync.mapFail(r.failures, value));
                else
                    return Promise.resolve(Sync.valid(r.values));
            });
        }
    };
    return Map;
}());
exports.Map = Map;
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