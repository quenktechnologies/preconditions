"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var afpl = require("afpl");
var Sync = require("./Sync");
var Promise = require("bluebird");
/**
 * fail async
 */
exports.fail = function (message, value, ctx) {
    if (ctx === void 0) { ctx = {}; }
    return Promise.resolve(Sync.fail(message, value, ctx));
};
/**
 * mapFail async
 */
exports.mapFail = function (errors, value, contexts) {
    if (contexts === void 0) { contexts = {}; }
    return Promise.resolve(Sync.mapFail(errors, value, contexts));
};
/**
 * valid async
 */
exports.valid = function (b) { return Promise.resolve(Sync.valid(b)); };
/**
 * map async
 */
exports.map = function (conditions) {
    return function (value) {
        var init = Promise.resolve({ failures: {}, values: {} });
        if (typeof value !== 'object') {
            return Promise.resolve(Sync.mapFail({}, value));
        }
        else {
            return afpl.util.reduce(conditions, function (p, f, key) {
                return p.then(function (r) {
                    return f(value[key])
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
};
/**
 * partial async
 */
exports.partial = function (conditions) {
    return function (value) {
        var init = Promise.resolve({ failures: {}, values: {} });
        if (typeof value !== 'object') {
            return Promise.resolve(Sync.mapFail({}, value));
        }
        else {
            return afpl.util.reduce(value, function (p, x, key) {
                return p
                    .then(function (r) {
                    return conditions.hasOwnProperty(key) ?
                        conditions[key](x)
                            .then(function (e) {
                            return Promise.resolve(e.cata(Sync.whenLeft(key, r), Sync.whenRight(key, r)));
                        }) :
                        Promise.resolve(r);
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
};
/**
 * or async
 */
exports.or = function (left, right) {
    return function (value) { return left(value).then(function (e) {
        return e.cata(function () { return right(value); }, exports.valid);
    }); };
};
/**
 * and async
 */
exports.and = function (left, right) {
    return function (value) { return left(value).then(function (e) { return e.cata(Promise.resolve, function (v) { return right(v); }); }); };
};
/**
 * async wraps the sync api so we can apply asynchronous tests.
 */
exports.async = function (s) {
    return function (value) { return s(value).cata(Promise.resolve, Promise.resolve); };
};
//# sourceMappingURL=Async.js.map