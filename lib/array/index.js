"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var either_1 = require("@quenk/noni/lib/data/either");
var function_1 = require("@quenk/noni/lib/data/function");
var record_1 = require("@quenk/noni/lib/data/record");
var result_1 = require("../result");
var failure_1 = require("./failure");
/**
 * isArray tests if the value is an array
 */
exports.isArray = function (a) { return Array.isArray(a) ?
    result_1.success(a) :
    result_1.failure('isArray', a); };
/**
 * notEmpty tests if an array has at least one member.
 */
exports.notEmpty = function (value) { return (value.length === 0) ?
    result_1.failure('notEmpty', value, { value: value }) : result_1.success(value); };
/**
 * range tests whether an array falls within a specific min and max range.
 */
exports.range = function (min, max) { return function (value) {
    return (value.length < min) ?
        result_1.failure('range.min', value, { min: min, max: max, value: value }) :
        (value.length > max) ?
            result_1.failure('range.max', value) :
            result_1.success(value);
}; };
/**
 * filter applies a precondition to each member of an array producing
 * an array where only the successful members are kept.
 */
exports.filter = function (p) { return function (value) {
    return result_1.success(value
        .map(p)
        .filter(function (e) { return (e instanceof either_1.Right); })
        .map(either_1.either(function_1.id)(function_1.id)));
}; };
/**
 * map applies a precondition to each member of an array.
 *
 * If the precondition fails for any of the members,
 * the entire array is considered a failure.
 */
exports.map = function (p) { return function (value) {
    return failure_1.review(value, value.reduce(function (reports, a, k) {
        return (either_1.either(exports.onFailure(k, reports))(exports.onSuccess(reports))(p(a)));
    }, { failures: {}, values: [] }));
}; };
exports.onFailure = function (key, _a) {
    var failures = _a.failures, values = _a.values;
    return function (f) {
        var _a;
        return ({ values: values, failures: record_1.merge(failures, (_a = {}, _a[key] = f, _a)) });
    };
};
exports.onSuccess = function (_a) {
    var failures = _a.failures, values = _a.values;
    return function (b) {
        return ({ failures: failures, values: values.concat(b) });
    };
};
//# sourceMappingURL=index.js.map