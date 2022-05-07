"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.reject = exports.discard = exports.id = exports.identity = exports.match = exports.caseOf = exports.optional = exports.every = exports.and = exports.or = exports.async = void 0;
const type_1 = require("@quenk/noni/lib/data/type");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const either_1 = require("@quenk/noni/lib/data/either");
const failure_1 = require("../result/failure");
const result_1 = require("../result");
/**
 * async wraps a sync api function so it can be used with other async
 * functions.
 */
const async = (p) => (a) => (0, future_1.pure)(p(a));
exports.async = async;
/**
 * or (async).
 */
const or = (l, r) => (value) => l(value).chain(e => e.fold(orFail(value, r), orSucc));
exports.or = or;
const orFail = (value, r) => (f) => r(value).map(e2 => e2.lmap((f2) => new failure_1.DualFailure(value, f, f2)));
const orSucc = (v) => (0, future_1.pure)((0, result_1.succeed)(v));
/**
 * and (async).
 *
 * TODO: using the any type until Either is fixed in afpl.
 */
const and = (l, r) => (value) => l(value).chain(e => {
    if (e instanceof either_1.Left) {
        return (0, future_1.pure)((0, either_1.left)(e.takeLeft()));
    }
    else {
        return r(e.takeRight())
            .chain(e2 => (0, future_1.pure)((e2 instanceof either_1.Left) ?
            (0, either_1.left)(failure_1.ModifiedFailure.create(value, e2.takeLeft())) :
            (0, either_1.right)(e2.takeRight())));
    }
});
exports.and = and;
/**
 * every (async).
 */
const every = (p, ...list) => (value) => p(value)
    .chain((r) => {
    if (r instanceof either_1.Left)
        return (0, future_1.pure)((0, either_1.left)(r.takeLeft()));
    return list.reduce((p, c) => p.chain(e => (e instanceof either_1.Left) ?
        (0, future_1.pure)(e) :
        c(e.takeRight())), (0, future_1.pure)((0, either_1.right)(r.takeRight())))
        .chain((e) => (e instanceof either_1.Left) ?
        (0, future_1.pure)((0, either_1.left)(failure_1.ModifiedFailure.create(value, e.takeLeft()))) :
        (0, future_1.pure)((0, either_1.right)(e.takeRight())));
});
exports.every = every;
/**
 * optional (async).
 */
const optional = (p) => (value) => isNon(value) ?
    (0, future_1.pure)((0, result_1.succeed)(value)) :
    p(value);
exports.optional = optional;
const isNon = (value) => ((value == null) || (typeof value === 'string' && value === ''));
/**
 * caseOf (async).
 */
const caseOf = (t, p) => (value) => (0, type_1.test)(value, t) ?
    p(value) :
    (0, future_1.pure)((0, result_1.fail)('caseOf', value, { type: t }));
exports.caseOf = caseOf;
/**
 * match (async version).
 */
const match = (p, ...list) => (value) => list.reduce((pe, f) => pe
    .chain((e) => (e instanceof either_1.Right) ?
    (0, future_1.pure)(e) :
    (0, future_1.pure)(e.takeLeft())
        .chain((r) => (r.message === 'caseOf') ?
        f(value) :
        (0, future_1.pure)((0, result_1.fail)(r.message, value, r.context)))), p(value));
exports.match = match;
/**
 * identity precondtion.
 *
 * Succeeds with whatever value is passed.
 */
const identity = (value) => (0, future_1.pure)((0, result_1.succeed)(value));
exports.identity = identity;
exports.id = exports.identity;
/**
 * discard (async).
 */
const discard = (_) => (0, future_1.pure)((0, result_1.succeed)(undefined));
exports.discard = discard;
/**
 * reject always fails with reason no matter the value supplied.
 */
const reject = (reason) => (value) => (0, future_1.pure)((0, result_1.fail)(reason, value));
exports.reject = reject;
/**
 * log the value to the console.
 */
const log = (value) => (console.log(value), (0, result_1.succeed)(value));
exports.log = log;
//# sourceMappingURL=index.js.map