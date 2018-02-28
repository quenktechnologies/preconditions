"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var util_1 = require("afpl/lib/util");
var async_1 = require("../async");
exports.success = async_1.success;
var _1 = require("../");
var ArrayFailure_1 = require("./ArrayFailure");
var Either_1 = require("afpl/lib/monad/Either");
exports.Either = Either_1.Either;
/**
 * failure
 */
exports.failure = function (errors, value, contexts) {
    return Promise.resolve(_1.left(new ArrayFailure_1.ArrayFailure(errors, value, contexts)));
};
/**
 * filter (async version).
 */
exports.filter = function (p) {
    return function (value) {
        return Promise
            .all(value.map(p))
            .then(function (results) {
            return Promise
                .resolve(results
                .map(function (r) {
                return r
                    .orRight(function () { return null; })
                    .takeRight();
            })
                .filter(function (b) { return b != null; }));
        })
            .then(function (values) { return async_1.success(values); });
    };
};
/**
 * map (async version).
 */
exports.map = function (p) {
    return function (value) {
        return Promise
            .all(value.map(p))
            .then(function (results) { return results
            .reduce(function (_a, curr, key) {
            var fails = _a[0], succs = _a[1];
            return curr.cata(function (f) {
                return [util_1.merge(fails, (_a = {}, _a[key] = f, _a)), succs];
                var _a;
            }, function (b) { return [fails, succs.concat(b)]; });
        }, [{}, []]); })
            .then(function (_a) {
            var fails = _a[0], succs = _a[1];
            return Object.keys(fails).length > 0 ?
                exports.failure(fails, value, { value: value }) :
                async_1.success(succs);
        });
    };
};
//# sourceMappingURL=async.js.map