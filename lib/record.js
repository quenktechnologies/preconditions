"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = exports.union = exports.intersect = exports.disjoint = exports.restrict = exports.isRecord = void 0;
var record_1 = require("@quenk/noni/lib/data/record");
var record_2 = require("@quenk/noni/lib/data/record");
var record_3 = require("./result/failure/record");
var result_1 = require("./result");
/**
 * isRecord tests if the value is an js object (and not an Array).
 */
exports.isRecord = function (value) {
    return record_1.isRecord(value) ?
        result_1.succeed(value) :
        result_1.fail('isRecord', value);
};
/**
 * restrict applies a record of preconditions to an input object keeping
 * only those properties that have a matching precondition.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
exports.restrict = function (tests) {
    return function (value) {
        var add2Reports = function (r, p, k) {
            return p(value[k]).fold(onFailure(k, r), onSuccess(k, r));
        };
        var result = record_1.reduce(tests, reports(), add2Reports);
        return review(result, value);
    };
};
/**
 * disjoint applies a record of preconditions to a javascript object
 * producing a new object with the final value of each precondition
 * and the values of any additional properties in the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
exports.disjoint = function (tests) {
    return function (value) {
        var add2Reports = function (r, v, k) {
            return (tests.hasOwnProperty(k)) ?
                tests[k](v).fold(onFailure(k, r), onSuccess(k, r)) :
                onSuccess(k, r)(v);
        };
        var result = record_1.reduce(value, reports(), add2Reports);
        return review(result, value);
    };
};
/**
 * intersect applies only the properties in a record of preconditions
 * that exist in the target input object. The resulting value is an
 * object with properties that exist in the input object that have had a
 * matching precondition applied.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
exports.intersect = function (tests) {
    return function (value) {
        var add2Reports = function (r, v, k) {
            return (tests.hasOwnProperty(k)) ?
                tests[k](v).fold(onFailure(k, r), onSuccess(k, r)) :
                onSuccess(k, r)(null);
        };
        var result = record_1.reduce(value, reports(), add2Reports);
        return review(result, value);
    };
};
/**
 * union applies a record of preconditions to an input object.
 *
 * Union results in an object that has both the results of applied preconditions for
 * found properties and any additional properties on the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
exports.union = function (tests) { return function (value) {
    var ks = record_2.keys(tests).concat(record_2.keys(value));
    var add2Reports = function (r, k) {
        return tests.hasOwnProperty(k) ?
            tests[k](value[k]).fold(onFailure(k, r), onSuccess(k, r)) :
            onSuccess(k, r)(value[k]);
    };
    var results = ks.reduce(add2Reports, reports());
    return review(results, value);
}; };
/**
 * map applies the same Precondition to each property of an object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
exports.map = function (condition) { return function (value) {
    var add2Reports = function (r, v, k) {
        return condition(v).fold(onFailure(k, r), onSuccess(k, r));
    };
    var result = record_1.reduce(value, reports(), add2Reports);
    return review(result, value);
}; };
var reports = function () { return ({ failures: {}, values: {} }); };
var review = function (reports, value) {
    return (!record_1.empty(reports.failures)) ?
        record_3.fail(reports.failures, value, { value: value }) :
        result_1.succeed(reports.values);
};
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
//# sourceMappingURL=record.js.map