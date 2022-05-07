"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = exports.union = exports.intersect = exports.disjoint = exports.restrict = void 0;
const record_1 = require("@quenk/noni/lib/data/record");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const record_2 = require("../result/failure/record");
const result_1 = require("../result");
/**
 * restrict (async version).
 */
const restrict = (tests) => (value) => (0, record_1.reduce)(tests, reports(), restrictReduce(value))
    .chain(review(value));
exports.restrict = restrict;
const restrictReduce = (value) => (p, f, key) => p.chain((r) => f(value[key]).chain(finish(key, r)));
/**
 * disjoint (async version).
 */
const disjoint = (tests) => (value) => (0, record_1.reduce)(value, reports(), (p, x, key) => p
    .chain((r) => tests.hasOwnProperty(key) ?
    tests[key](x)
        .chain(finish(key, r)) :
    (0, future_1.pure)(onSuccess(key, r)(x))))
    .chain(review(value));
exports.disjoint = disjoint;
/**
 * intersect (async version).
 */
const intersect = (tests) => (value) => (0, record_1.reduce)(value, reports(), intersectReduce(tests))
    .chain(review(value));
exports.intersect = intersect;
const intersectReduce = (tests) => (p, v, key) => p
    .chain((r) => tests.hasOwnProperty(key) ?
    tests[key](v).chain(finish(key, r)) :
    (0, future_1.pure)(onSuccess(key, r)(null)));
/**
 * union (async version).
 */
const union = (tests) => (value) => (0, record_1.keys)(tests)
    .concat((0, record_1.keys)(value))
    .reduce(unionReduce(tests, value), reports())
    .chain(review(value));
exports.union = union;
const unionReduce = (tests, value) => (p, key) => p
    .chain(r => tests.hasOwnProperty(key) ?
    tests[key](value[key]).chain(finish(key, r)) :
    (0, future_1.pure)(onSuccess(key, r)(value[key])));
/**
 * map (async version).
 */
const map = (test) => (value) => (0, record_1.reduce)(value, reports(), mapReduce(test))
    .chain(review(value));
exports.map = map;
const mapReduce = (test) => (p, v, key) => p.chain((r) => test(v).chain(finish(key, r)));
const reports = () => (0, future_1.pure)({ failures: {}, values: {} });
const finish = (k, r) => (e) => (0, future_1.pure)(e.fold(onFailure(k, r), onSuccess(k, r)));
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
const review = (value) => (r) => ((0, record_1.keys)(r.failures).length > 0) ?
    (0, future_1.pure)((0, record_2.fail)(r.failures, value, {})) :
    (0, future_1.pure)((0, result_1.succeed)(r.values));
//# sourceMappingURL=record.js.map