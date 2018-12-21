"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var record_1 = require("@quenk/noni/lib/data/record");
var record_2 = require("@quenk/noni/lib/data/record");
var record_3 = require("./result/failure/record");
var result_1 = require("./result");
/**
 * isRecord tests if the value is an js object (and not an Array).
 */
exports.isRecord = function (value) {
    return (typeof value === 'object' && (!Array.isArray(value))) ?
        result_1.succeed(value) : result_1.fail('isRecord', value);
};
/**
 * restrict applies a record of preconditions to an input object keeping
 * only those properties that have a matching precondition.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
exports.restrict = function (conditions) { return function (value) {
    var init = reports();
    var rs = record_1.reduce(conditions, init, function (r, p, k) {
        return p(value[k]).fold(onFailure(k, r), onSuccess(k, r));
    });
    return review(rs, value);
}; };
/**
 * disjoint applies a record of preconditions to a javascript object
 * producing a new object with the final value of each precondition
 * and the values of any additional properties in the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
exports.disjoint = function (conditions) { return function (value) {
    var init = reports();
    var rs = record_1.reduce(value, init, function (r, x, k) {
        return (conditions.hasOwnProperty(k)) ?
            conditions[k](x).fold(onFailure(k, r), onSuccess(k, r)) :
            onSuccess(k, r)(x);
    });
    return review(rs, value);
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
    var init = reports();
    var rs = record_1.reduce(value, init, function (r, x, k) {
        return (conditions.hasOwnProperty(k)) ?
            conditions[k](x).fold(onFailure(k, r), onSuccess(k, r)) :
            onSuccess(k, r)(null);
    });
    return review(rs, value);
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
    var ks = record_2.keys(conditions).concat(record_2.keys(value));
    var init = reports();
    var rs = ks.reduce(function (r, k) {
        return conditions.hasOwnProperty(k) ?
            conditions[k](value[k]).fold(onFailure(k, r), onSuccess(k, r)) :
            onSuccess(k, r)(value[k]);
    }, init);
    return review(rs, value);
}; };
/**
 * map applies the same Precondition to each property of an object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
exports.map = function (condition) { return function (value) {
    var init = reports();
    var rs = record_1.reduce(value, init, function (r, x, k) {
        return condition(x).fold(onFailure(k, r), onSuccess(k, r));
    });
    return review(rs, value);
}; };
var reports = function () { return ({ failures: {}, values: {} }); };
var review = function (reports, value) {
    return (Object.keys(reports.failures).length > 0) ?
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