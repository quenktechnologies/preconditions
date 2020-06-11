"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tuple = exports.map = exports.filter = exports.range = exports.min = exports.max = exports.notEmpty = exports.isArray = void 0;
var either_1 = require("@quenk/noni/lib/data/either");
var record_1 = require("@quenk/noni/lib/data/record");
var array_1 = require("./result/failure/array");
var result_1 = require("./result");
/**
 * isArray tests if the value is an array
 */
exports.isArray = function (a) {
    return Array.isArray(a) ? result_1.succeed(a) : result_1.fail('isArray', a);
};
/**
 * notEmpty tests if an array has at least one member.
 */
exports.notEmpty = function (value) { return (value.length === 0) ?
    result_1.fail('notEmpty', value, { value: value }) : result_1.succeed(value); };
/**
 * max sets a maximum number of elements the array can contain.
 */
exports.max = function (target) { return function (value) {
    return (value.length > target) ?
        result_1.fail('max', value, { target: target, value: value }) :
        result_1.succeed(value);
}; };
/**
 * min sets a minimum number of elements the array can contain.
 */
exports.min = function (target) { return function (value) {
    return (value.length < target) ?
        result_1.fail('min', value, { target: target, value: value }) :
        result_1.succeed(value);
}; };
/**
 * range tests whether an array's length falls within a specific min and max range.
 */
exports.range = function (min, max) { return function (value) {
    return (value.length < min) ?
        result_1.fail('range.min', value, { min: min, max: max, value: value }) :
        (value.length > max) ?
            result_1.fail('range.max', value) :
            result_1.succeed(value);
}; };
/**
 * filter applies a precondition to each member of an array producing
 * an array where only the successful members are kept.
 */
exports.filter = function (p) { return function (value) {
    return result_1.succeed(value
        .map(p)
        .filter(function (e) { return (e instanceof either_1.Right); })
        .map(function (e) { return e.takeRight(); }));
}; };
/**
 * map applies a precondition to each member of an array.
 *
 * If the precondition fails for any of the members,
 * the entire array is considered a failure.
 */
exports.map = function (p) { return function (value) {
    return review(value, value.reduce(mapReduce(p), reports()));
}; };
var review = function (value, r) {
    return (Object.keys(r.failures).length > 0) ?
        either_1.left(array_1.ArrayFailure.create(r.failures, value, { value: value })) :
        result_1.succeed(r.values);
};
var mapReduce = function (p) {
    return function (reports, a, k) {
        return p(a).fold(onFailure(k, reports), onSuccess(reports));
    };
};
var reports = function () {
    return ({ failures: {}, values: [] });
};
var onFailure = function (key, _a) {
    var failures = _a.failures, values = _a.values;
    return function (f) {
        var _a;
        return ({ values: values, failures: record_1.merge(failures, (_a = {}, _a[key] = f, _a)) });
    };
};
var onSuccess = function (_a) {
    var failures = _a.failures, values = _a.values;
    return function (b) {
        return ({ failures: failures, values: values.concat(b) });
    };
};
/**
 * tuple tests whether the value supplied qualifies as a tuple.
 *
 * Each precondition in the list represents a precondition for its
 * corresponding tuple element.
 */
exports.tuple = function (list) { return function (value) {
    if (value.length !== list.length)
        return result_1.fail('tuple', value);
    var results = value.map(function (v, idx) { return list[idx](v); });
    var fails = results.filter(function (v) { return v.isLeft(); }).map(function (e) { return e.takeLeft(); });
    if (fails.length > 0) {
        var failMap = fails.reduce(function (p, c, k) { p[k] = c; return p; }, {});
        return either_1.left(array_1.ArrayFailure.create(failMap, value, { value: value }));
    }
    return result_1.succeed(results.map(function (e) { return e.takeRight(); }));
}; };
//# sourceMappingURL=array.js.map