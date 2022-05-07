"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = exports.union = exports.intersect = exports.disjoint = exports.restrict = exports.isRecord = void 0;
const record_1 = require("@quenk/noni/lib/data/record");
const record_2 = require("@quenk/noni/lib/data/record");
const record_3 = require("./result/failure/record");
const result_1 = require("./result");
/**
 * isRecord tests if the value is an js object (and not an Array).
 */
const isRecord = (value) => (0, record_1.isRecord)(value) ?
    (0, result_1.succeed)(value) :
    (0, result_1.fail)('isRecord', value);
exports.isRecord = isRecord;
/**
 * restrict applies a record of preconditions to an input object keeping
 * only those properties that have a matching precondition.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
const restrict = (tests) => (value) => {
    let add2Reports = (r, p, k) => p(value[k]).fold(onFailure(k, r), onSuccess(k, r));
    let result = (0, record_1.reduce)(tests, reports(), add2Reports);
    return review(result, value);
};
exports.restrict = restrict;
/**
 * disjoint applies a record of preconditions to a javascript object
 * producing a new object with the final value of each precondition
 * and the values of any additional properties in the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
const disjoint = (tests) => (value) => {
    let add2Reports = (r, v, k) => (tests.hasOwnProperty(k)) ?
        tests[k](v).fold(onFailure(k, r), onSuccess(k, r)) :
        onSuccess(k, r)(v);
    let result = (0, record_1.reduce)(value, reports(), add2Reports);
    return review(result, value);
};
exports.disjoint = disjoint;
/**
 * intersect applies only the properties in a record of preconditions
 * that exist in the target input object. The resulting value is an
 * object with properties that exist in the input object that have had a
 * matching precondition applied.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
const intersect = (tests) => (value) => {
    let add2Reports = (r, v, k) => (tests.hasOwnProperty(k)) ?
        tests[k](v).fold(onFailure(k, r), onSuccess(k, r)) :
        onSuccess(k, r)(null);
    let result = (0, record_1.reduce)(value, reports(), add2Reports);
    return review(result, value);
};
exports.intersect = intersect;
/**
 * union applies a record of preconditions to an input object.
 *
 * Union results in an object that has both the results of applied preconditions for
 * found properties and any additional properties on the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
const union = (tests) => (value) => {
    let ks = (0, record_2.keys)(tests).concat((0, record_2.keys)(value));
    let add2Reports = (r, k) => tests.hasOwnProperty(k) ?
        tests[k](value[k]).fold(onFailure(k, r), onSuccess(k, r)) :
        onSuccess(k, r)(value[k]);
    let results = ks.reduce(add2Reports, reports());
    return review(results, value);
};
exports.union = union;
/**
 * map applies the same Precondition to each property of an object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 */
const map = (condition) => (value) => {
    let add2Reports = (r, v, k) => condition(v).fold(onFailure(k, r), onSuccess(k, r));
    let result = (0, record_1.reduce)(value, reports(), add2Reports);
    return review(result, value);
};
exports.map = map;
const reports = () => ({ failures: {}, values: {} });
const review = (reports, value) => (!(0, record_1.empty)(reports.failures)) ?
    (0, record_3.fail)(reports.failures, value, { value }) :
    (0, result_1.succeed)(reports.values);
const onFailure = (key, { failures, values }) => (f) => ({
    values,
    failures: (0, record_1.merge)(failures, { [key]: f })
});
const onSuccess = (key, { failures, values }) => (v) => (v == null) ?
    { failures, values } :
    ({
        failures,
        values: (0, record_1.merge)(values, { [key]: v })
    });
//# sourceMappingURL=record.js.map