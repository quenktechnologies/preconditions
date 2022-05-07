"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tuple = exports.map = exports.filter = exports.range = exports.min = exports.max = exports.notEmpty = exports.isArray = void 0;
const either_1 = require("@quenk/noni/lib/data/either");
const record_1 = require("@quenk/noni/lib/data/record");
const array_1 = require("./result/failure/array");
const result_1 = require("./result");
/**
 * isArray tests if the value is an array
 */
const isArray = (a) => Array.isArray(a) ? (0, result_1.succeed)(a) : (0, result_1.fail)('isArray', a);
exports.isArray = isArray;
/**
 * notEmpty tests if an array has at least one member.
 */
const notEmpty = (value) => (value.length === 0) ?
    (0, result_1.fail)('notEmpty', value, { value }) : (0, result_1.succeed)(value);
exports.notEmpty = notEmpty;
/**
 * max sets a maximum number of elements the array can contain.
 */
const max = (target) => (value) => (value.length > target) ?
    (0, result_1.fail)('max', value, { target, value }) :
    (0, result_1.succeed)(value);
exports.max = max;
/**
 * min sets a minimum number of elements the array can contain.
 */
const min = (target) => (value) => (value.length < target) ?
    (0, result_1.fail)('min', value, { target, value }) :
    (0, result_1.succeed)(value);
exports.min = min;
/**
 * range tests whether an array's length falls within a specific min and max range.
 */
const range = (min, max) => (value) => (value.length < min) ?
    (0, result_1.fail)('range.min', value, { min, max, value }) :
    (value.length > max) ?
        (0, result_1.fail)('range.max', value) :
        (0, result_1.succeed)(value);
exports.range = range;
/**
 * filter applies a precondition to each member of an array producing
 * an array where only the successful members are kept.
 */
const filter = (p) => (value) => (0, result_1.succeed)(value
    .map(p)
    .filter((e) => (e instanceof either_1.Right))
    .map(e => e.takeRight()));
exports.filter = filter;
/**
 * map applies a precondition to each member of an array.
 *
 * If the precondition fails for any of the members,
 * the entire array is considered a failure.
 */
const map = (p) => (value) => review(value, value.reduce(mapReduce(p), reports()));
exports.map = map;
const review = (value, r) => (Object.keys(r.failures).length > 0) ?
    (0, either_1.left)(array_1.ArrayFailure.create(r.failures, value, { value })) :
    (0, result_1.succeed)(r.values);
const mapReduce = (p) => (reports, a, k) => p(a).fold(onFailure(k, reports), onSuccess(reports));
const reports = () => ({ failures: {}, values: [] });
const onFailure = (key, { failures, values }) => (f) => ({ values, failures: (0, record_1.merge)(failures, { [key]: f }) });
const onSuccess = ({ failures, values }) => (b) => ({ failures, values: values.concat(b) });
/**
 * tuple tests whether the value supplied qualifies as a tuple.
 *
 * Each precondition in the list represents a precondition for its
 * corresponding tuple element.
 */
const tuple = (list) => (value) => {
    if (value.length !== list.length)
        return (0, result_1.fail)('tuple', value);
    let results = value.map((v, idx) => list[idx](v));
    let fails = results.filter(v => v.isLeft()).map(e => e.takeLeft());
    if (fails.length > 0) {
        let failMap = fails.reduce((p, c, k) => { p[k] = c; return p; }, {});
        return (0, either_1.left)(array_1.ArrayFailure.create(failMap, value, { value }));
    }
    return (0, result_1.succeed)(results.map(e => e.takeRight()));
};
exports.tuple = tuple;
//# sourceMappingURL=array.js.map