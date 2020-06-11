"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = exports.union = exports.intersect = exports.disjoint = exports.restrict = void 0;
var record_1 = require("@quenk/noni/lib/data/record");
var future_1 = require("@quenk/noni/lib/control/monad/future");
var record_2 = require("../result/failure/record");
var result_1 = require("../result");
/**
 * restrict (async version).
 */
exports.restrict = function (tests) {
    return function (value) {
        return record_1.reduce(tests, reports(), restrictReduce(value))
            .chain(review(value));
    };
};
var restrictReduce = function (value) {
    return function (p, f, key) {
        return p.chain(function (r) { return f(value[key]).chain(finish(key, r)); });
    };
};
/**
 * disjoint (async version).
 */
exports.disjoint = function (tests) {
    return function (value) {
        return record_1.reduce(value, reports(), function (p, x, key) {
            return p
                .chain(function (r) {
                return tests.hasOwnProperty(key) ?
                    tests[key](x)
                        .chain(finish(key, r)) :
                    future_1.pure(onSuccess(key, r)(x));
            });
        })
            .chain(review(value));
    };
};
/**
 * intersect (async version).
 */
exports.intersect = function (tests) {
    return function (value) {
        return record_1.reduce(value, reports(), intersectReduce(tests))
            .chain(review(value));
    };
};
var intersectReduce = function (tests) {
    return function (p, v, key) {
        return p
            .chain(function (r) {
            return tests.hasOwnProperty(key) ?
                tests[key](v).chain(finish(key, r)) :
                future_1.pure(onSuccess(key, r)(null));
        });
    };
};
/**
 * union (async version).
 */
exports.union = function (tests) {
    return function (value) {
        return record_1.keys(tests)
            .concat(record_1.keys(value))
            .reduce(unionReduce(tests, value), reports())
            .chain(review(value));
    };
};
var unionReduce = function (tests, value) {
    return function (p, key) {
        return p
            .chain(function (r) { return tests.hasOwnProperty(key) ?
            tests[key](value[key]).chain(finish(key, r)) :
            future_1.pure(onSuccess(key, r)(value[key])); });
    };
};
/**
 * map (async version).
 */
exports.map = function (test) {
    return function (value) {
        return record_1.reduce(value, reports(), mapReduce(test))
            .chain(review(value));
    };
};
var mapReduce = function (test) {
    return function (p, v, key) {
        return p.chain(function (r) {
            return test(v).chain(finish(key, r));
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