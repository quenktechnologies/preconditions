"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var record_1 = require("@quenk/noni/lib/data/record");
var future_1 = require("@quenk/noni/lib/control/monad/future");
var record_2 = require("../result/failure/record");
var result_1 = require("../result");
/**
 * restrict (async version).
 */
exports.restrict = function (conditions) { return function (value) {
    return record_1.reduce(conditions, reports(), restrictReduce(value))
        .chain(review(value));
}; };
var restrictReduce = function (value) { return function (p, f, key) {
    return p.chain(function (r) { return f(value[key]).chain(finish(key, r)); });
}; };
/**
 * disjoint (async version).
 */
exports.disjoint = function (conditions) { return function (value) {
    return record_1.reduce(value, reports(), function (p, x, key) {
        return p
            .chain(function (r) {
            return conditions.hasOwnProperty(key) ?
                conditions[key](x)
                    .chain(finish(key, r)) :
                future_1.pure(onSuccess(key, r)(x));
        });
    })
        .chain(review(value));
}; };
/**
 * intersect (async version).
 */
exports.intersect = function (conditions) { return function (value) {
    return record_1.reduce(value, reports(), intersectReduce(conditions))
        .chain(review(value));
}; };
var intersectReduce = function (conditions) {
    return function (p, x, key) {
        return p
            .chain(function (r) {
            return conditions.hasOwnProperty(key) ?
                conditions[key](x).chain(finish(key, r)) :
                future_1.pure(onSuccess(key, r)(null));
        });
    };
};
/**
 * union (async version).
 */
exports.union = function (conditions) { return function (value) {
    return record_1.keys(conditions)
        .concat(record_1.keys(value))
        .reduce(unionReduce(conditions, value), reports())
        .chain(review(value));
}; };
var unionReduce = function (conditions, value) {
    return function (p, key) {
        return p
            .chain(function (r) { return conditions.hasOwnProperty(key) ?
            conditions[key](value[key]).chain(finish(key, r)) :
            future_1.pure(onSuccess(key, r)(value[key])); });
    };
};
/**
 * map (async version).
 */
exports.map = function (condition) { return function (value) {
    return record_1.reduce(value, reports(), mapReduce(condition))
        .chain(review(value));
}; };
var mapReduce = function (condition) {
    return function (p, x, key) {
        return p.chain(function (r) {
            return condition(x).chain(finish(key, r));
        });
    };
};
var reports = function () {
    return future_1.pure({ failures: {}, values: {} });
};
var finish = function (k, r) { return function (e) {
    return future_1.pure(e.fold(onFailure(k, r), onSuccess(k, r)));
}; };
var onFailure = function (key, _a) {
    var failures = _a.failures, values = _a.values;
    return function (f) {
        var _a;
        return ({
            values: values,
            failures: record_1.merge(failures, (_a = {}, _a[key] = f, _a))
        });
    };
};
var onSuccess = function (key, _a) {
    var failures = _a.failures, values = _a.values;
    return function (v) {
        var _a;
        return (v == null) ?
            { failures: failures, values: values } :
            ({
                failures: failures,
                values: record_1.merge(values, (_a = {}, _a[key] = v, _a))
            });
    };
};
var review = function (value) {
    return function (r) {
        return (record_1.keys(r.failures).length > 0) ?
            future_1.pure(record_2.fail(r.failures, value, {})) :
            future_1.pure(result_1.succeed(r.values));
    };
};
//# sourceMappingURL=record.js.map