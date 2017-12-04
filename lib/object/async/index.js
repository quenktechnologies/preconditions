"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var util = require("afpl/lib/util");
var Either_1 = require("afpl/lib/monad/Either");
exports.Either = Either_1.Either;
var __1 = require("../..");
exports.Failure = __1.Failure;
var _1 = require("../");
/**
 * @private
 */
exports.review = function (value) {
    return function (r) {
        return (Object.keys(r.failures).length > 0) ?
            Promise.resolve(_1.failure(r.failures, value, {})) :
            Promise.resolve(_1.success(r.values));
    };
};
/**
 * @private
 */
exports.reports = function () {
    return Promise.resolve({ failures: {}, values: {} });
};
/**
 * @private
 */
exports.finish = function (key, r) {
    return function (e) {
        return Promise.resolve(e.cata(_1.onFailure(key, r), _1.onSuccess(key, r)));
    };
};
/**
 * restrict (async version).
 */
exports.restrict = function (conditions) {
    return function (value) {
        return util.reduce(conditions, function (p, f, key) {
            return p.then(function (r) {
                return f(value[key]).then(exports.finish(key, r));
            });
        }, exports.reports())
            .then(exports.review(value));
    };
};
/**
 * disjoint (async version).
 */
exports.disjoint = function (conditions) {
    return function (value) {
        return util.reduce(value, function (p, x, key) {
            return p
                .then(function (r) {
                return conditions.hasOwnProperty(key) ?
                    conditions[key](x)
                        .then(exports.finish(key, r)) :
                    Promise.resolve(_1.onSuccess(key, r)(x));
            });
        }, exports.reports())
            .then(exports.review(value));
    };
};
/**
 * intersect (async version).
 */
exports.intersect = function (conditions) {
    return function (value) {
        return util.reduce(value, function (p, x, key) {
            return p
                .then(function (r) {
                return conditions.hasOwnProperty(key) ?
                    conditions[key](x)
                        .then(exports.finish(key, r)) :
                    Promise.resolve(_1.onSuccess(key, r)(null));
            });
        }, exports.reports())
            .then(exports.review(value));
    };
};
/**
 * union (async version).
 */
exports.union = function (conditions) {
    return function (value) {
        return _1.keysUnion(conditions, value)
            .reduce(function (p, key) {
            return p
                .then(function (r) {
                return conditions.hasOwnProperty(key) ?
                    conditions[key](value[key]).then(exports.finish(key, r)) :
                    Promise.resolve(_1.onSuccess(key, r)(value[key]));
            });
        }, exports.reports())
            .then(exports.review(value));
    };
};
/**
 * map (async version).
 */
exports.map = function (condition) {
    return function (value) {
        return util.reduce(value, function (p, x, key) {
            return p.then(function (r) {
                return condition(x)
                    .then(exports.finish(key, r));
            });
        }, exports.reports())
            .then(exports.review(value));
    };
};
//# sourceMappingURL=index.js.map