"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var record_1 = require("@quenk/noni/lib/data/record");
var either_1 = require("@quenk/noni/lib/data/either");
var record_2 = require("../../record");
var util_1 = require("../../util");
var failure_1 = require("./failure");
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
        return Promise.resolve(either_1.either(record_2.onFailure(key, r))(record_2.onSuccess(key, r))(e));
    };
};
/**
 * restrict (async version).
 */
exports.restrict = function (conditions) {
    return function (value) {
        return record_1.reduce(conditions, exports.reports(), function (p, f, key) {
            return p.then(function (r) {
                return f(value[key]).then(exports.finish(key, r));
            });
        })
            .then(failure_1.review(value));
    };
};
/**
 * disjoint (async version).
 */
exports.disjoint = function (conditions) {
    return function (value) {
        return record_1.reduce(value, exports.reports(), function (p, x, key) {
            return p
                .then(function (r) {
                return conditions.hasOwnProperty(key) ?
                    conditions[key](x)
                        .then(exports.finish(key, r)) :
                    Promise.resolve(record_2.onSuccess(key, r)(x));
            });
        })
            .then(failure_1.review(value));
    };
};
/**
 * intersect (async version).
 */
exports.intersect = function (conditions) {
    return function (value) {
        return record_1.reduce(value, exports.reports(), function (p, x, key) {
            return p
                .then(function (r) {
                return conditions.hasOwnProperty(key) ?
                    conditions[key](x)
                        .then(exports.finish(key, r)) :
                    Promise.resolve(record_2.onSuccess(key, r)(null));
            });
        })
            .then(failure_1.review(value));
    };
};
/**
 * union (async version).
 */
exports.union = function (conditions) {
    return function (value) {
        return util_1.combineKeys(conditions, value)
            .reduce(function (p, key) {
            return p
                .then(function (r) {
                return conditions.hasOwnProperty(key) ?
                    conditions[key](value[key]).then(exports.finish(key, r)) :
                    Promise.resolve(record_2.onSuccess(key, r)(value[key]));
            });
        }, exports.reports())
            .then(failure_1.review(value));
    };
};
/**
 * map (async version).
 */
exports.map = function (condition) {
    return function (value) {
        return record_1.reduce(value, exports.reports(), function (p, x, key) {
            return p.then(function (r) {
                return condition(x)
                    .then(exports.finish(key, r));
            });
        })
            .then(failure_1.review(value));
    };
};
//# sourceMappingURL=index.js.map