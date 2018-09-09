"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var record_1 = require("@quenk/noni/lib/data/record");
var either_1 = require("@quenk/noni/lib/data/either");
var result_1 = require("../array/result");
var result_2 = require("./result");
/**
 * failure
 */
exports.failure = function (errors, value, contexts) {
    return Promise.resolve(either_1.left(new result_1.Failure(errors, value, contexts)));
};
/**
 * filter (async version).
 */
exports.filter = function (p) { return function (value) {
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
        .then(function (values) { return result_2.success(values); });
}; };
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
            return either_1.either(function (f) {
                var _a;
                return [record_1.merge(fails, (_a = {}, _a[key] = f, _a)), succs];
            })(function (b) { return [fails, succs.concat(b)]; })(curr);
        }, [{}, []]); })
            .then(function (_a) {
            var fails = _a[0], succs = _a[1];
            return Object.keys(fails).length > 0 ?
                exports.failure(fails, value, { value: value }) :
                result_2.success(succs);
        });
    };
};
//# sourceMappingURL=array.js.map