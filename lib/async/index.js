"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = require("@quenk/noni/lib/data/type");
var future_1 = require("@quenk/noni/lib/control/monad/future");
var either_1 = require("@quenk/noni/lib/data/either");
var failure_1 = require("../result/failure");
var result_1 = require("../result");
/**
 * async wraps a sync api function so it can be used with other async
 * functions.
 */
exports.async = function (p) { return function (a) { return future_1.pure(p(a)); }; };
/**
 * or (async).
 */
exports.or = function (l, r) { return function (value) {
    return l(value).chain(function (e) { return e.fold(orFail(value, r), orSucc); });
}; };
var orFail = function (value, r) { return function (f) {
    return r(value).map(function (e2) { return e2.lmap(function (f2) { return new failure_1.DualFailure(value, f, f2); }); });
}; };
var orSucc = function (v) { return future_1.pure(result_1.succeed(v)); };
/**
 * and (async).
 *
 * TODO: using the any type until Either is fixed in afpl.
 */
exports.and = function (l, r) { return function (value) {
    return l(value).chain(function (e) {
        if (e instanceof either_1.Left) {
            return future_1.pure(either_1.left(e.takeLeft()));
        }
        else {
            return r(e.takeRight())
                .chain(function (e2) {
                return future_1.pure((e2 instanceof either_1.Left) ?
                    either_1.left(failure_1.ModifiedFailure.create(value, e2.takeLeft())) :
                    either_1.right(e2.takeRight()));
            });
        }
    });
}; };
/**
 * every (async).
 */
exports.every = function (p) {
    var list = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        list[_i - 1] = arguments[_i];
    }
    return function (value) {
        return p(value)
            .chain(function (r) {
            if (r instanceof either_1.Left)
                return future_1.pure(either_1.left(r.takeLeft()));
            return list.reduce(function (p, c) {
                return p.chain(function (e) { return (e instanceof either_1.Left) ?
                    future_1.pure(e) :
                    c(e.takeRight()); });
            }, future_1.pure(either_1.right(r.takeRight())))
                .chain(function (e) {
                return (e instanceof either_1.Left) ?
                    future_1.pure(either_1.left(failure_1.ModifiedFailure.create(value, e.takeLeft()))) :
                    future_1.pure(either_1.right(e.takeRight()));
            });
        });
    };
};
/**
 * optional (async).
 */
exports.optional = function (p) { return function (value) {
    return isNon(value) ?
        future_1.pure(result_1.succeed(value)) :
        p(value);
}; };
var isNon = function (value) {
    return ((value == null) || (typeof value === 'string' && value === ''));
};
/**
 * caseOf (async).
 */
exports.caseOf = function (t, p) { return function (value) { return type_1.test(value, t) ?
    p(value) :
    future_1.pure(result_1.fail('caseOf', value, { type: t })); }; };
/**
 * match (async version).
 */
exports.match = function (p) {
    var list = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        list[_i - 1] = arguments[_i];
    }
    return function (value) {
        return list.reduce(function (pe, f) {
            return pe
                .chain(function (e) { return (e instanceof either_1.Right) ?
                future_1.pure(e) :
                future_1.pure(e.takeLeft())
                    .chain(function (r) { return (r.message === 'caseOf') ?
                    f(value) :
                    future_1.pure(result_1.fail(r.message, value, r.context)); }); });
        }, p(value));
    };
};
/**
 * identity precondtion.
 *
 * Succeeds with whatever value is passed.
 */
exports.identity = function (value) { return future_1.pure(result_1.succeed(value)); };
exports.id = exports.identity;
/**
 * reject always fails with reason no matter the value supplied.
 */
exports.reject = function (reason) { return function (value) {
    return future_1.pure(result_1.fail(reason, value));
}; };
/**
 * log the value to the console.
 */
exports.log = function (value) {
    return (console.log(value), result_1.succeed(value));
};
//# sourceMappingURL=index.js.map