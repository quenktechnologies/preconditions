"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tuple = exports.map = exports.filter = void 0;
const record_1 = require("@quenk/noni/lib/data/record");
const either_1 = require("@quenk/noni/lib/data/either");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const array_1 = require("../result/failure/array");
const result_1 = require("../result");
/**
 * filter (async).
 */
const filter = (p) => (value) => (0, future_1.parallel)(value.map(p))
    .map((r) => r.reduce(filterResults, []))
    .chain((values) => (0, future_1.pure)((0, result_1.succeed)(values)));
exports.filter = filter;
const filterResults = (p, c) => (c instanceof either_1.Right) ? p.concat(c.takeRight()) : p;
/**
 * map (async).
 */
const map = (p) => (value) => (0, future_1.parallel)(value.map(p))
    .map(mapReduce)
    .map(mapFinish(value));
exports.map = map;
const mapReduce = (r) => r.reduce(mapReduceFold, [{}, []]);
const mapReduceFold = ([fails, succs], curr, idx) => curr.fold((f) => [(0, record_1.merge)(fails, { [idx]: f }), succs], (b) => [fails, succs.concat(b)]);
const mapFinish = (value) => ([fails, succs]) => Object.keys(fails).length > 0 ?
    (0, array_1.fail)(fails, value, { value }) :
    (0, result_1.succeed)(succs);
/**
 * tuple (async)
 */
const tuple = (list) => (value) => {
    if (value.length !== list.length)
        return (0, future_1.pure)((0, result_1.fail)('tuple', value));
    return (0, future_1.parallel)(value.map((v, idx) => list[idx](v)))
        .chain(results => {
        let fails = results.filter(v => v.isLeft()).map(e => e.takeLeft());
        if (fails.length > 0) {
            let failMap = fails.reduce((p, c, k) => { p[k] = c; return p; }, {});
            return (0, future_1.pure)((0, either_1.left)(array_1.ArrayFailure.create(failMap, value, { value })));
        }
        return (0, future_1.pure)((0, result_1.succeed)(results.map(e => e.takeRight())));
    });
};
exports.tuple = tuple;
//# sourceMappingURL=array.js.map