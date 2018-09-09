"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var record_1 = require("@quenk/noni/lib/data/record");
var either_1 = require("@quenk/noni/lib/data/either");
var failure_1 = require("../failure");
var util_1 = require("../util");
var failure_2 = require("./failure");
/**
 * @private
 */
exports.onFailure = function (key, _a) {
    var failures = _a.failures, values = _a.values;
    return function (f) {
        var _a;
        return ({
            values: values,
            failures: record_1.merge(failures, (_a = {}, _a[key] = f, _a))
        });
    };
};
/**
 * @private
 */
exports.onSuccess = function (key, _a) {
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
/**
 * isObject tests if the value is an js object (and not an Array).
 */
exports.isObject = function (value) {
    return (typeof value === 'object' && (!Array.isArray(value))) ?
        failure_1.success(value) : failure_1.failure('isObject', value);
};
/**
 * restrict applies a record of preconditions to an input object keeping
 * only those properties that have a matching precondition.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
exports.restrict = function (conditions) { return function (value) {
    var init = { failures: {}, values: {} };
    var reports = record_1.reduce(conditions, init, function (r, p, k) {
        return either_1.either(exports.onFailure(k, r))(exports.onSuccess(k, r))(p(value[k]));
    });
    return failure_2.review(reports, value);
}; };
/**
 * disjoint applies a record of preconditions to a javascript object
 * producing a new object with the final value of each precondition
 * and the values of any additional properties in the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
exports.disjoint = function (conditions) { return function (value) {
    var init = { failures: {}, values: {} };
    var reports = record_1.reduce(value, init, function (r, x, k) {
        return (conditions.hasOwnProperty(k)) ?
            either_1.either(exports.onFailure(k, r))(exports.onSuccess(k, r))(conditions[k](x)) :
            exports.onSuccess(k, r)(x);
    });
    return failure_2.review(reports, value);
}; };
/**
 * intersect applies only the properties in a record of preconditions
 * that exist in the target input object. The resulting value is an
 * object with properties that exist in the input object that have had a
 * matching precondition applied.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
exports.intersect = function (conditions) { return function (value) {
    var init = { failures: {}, values: {} };
    var reports = record_1.reduce(value, init, function (r, x, k) {
        return (conditions.hasOwnProperty(k)) ?
            either_1.either(exports.onFailure(k, r))(exports.onSuccess(k, r))(conditions[k](x)) :
            exports.onSuccess(k, r)(null);
    });
    return failure_2.review(reports, value);
}; };
/**
 * union applies a record of preconditions to an input object.
 *
 * Union results in an object that has both the results of applied preconditions for
 * found properties and any additional properties on the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
exports.union = function (conditions) { return function (value) {
    var keys = util_1.combineKeys(conditions, value);
    var init = { failures: {}, values: {} };
    var reports = keys.reduce(function (r, k) {
        return conditions.hasOwnProperty(k) ?
            either_1.either(exports.onFailure(k, r))(exports.onSuccess(k, r))(conditions[k](value[k])) :
            exports.onSuccess(k, r)(value[k]);
    }, init);
    return failure_2.review(reports, value);
}; };
/**
 * map applies the same Precondition to each property of an object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
exports.map = function (condition) { return function (value) {
    var init = { failures: {}, values: {} };
    var reports = record_1.reduce(value, init, function (r, x, k) {
        return either_1.either(exports.onFailure(k, r))(exports.onSuccess(k, r))(condition(x));
    });
    return failure_2.review(reports, value);
}; };
//# sourceMappingURL=index.js.map