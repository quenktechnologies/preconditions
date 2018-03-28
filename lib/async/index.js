"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sync = require("../");
var Promise = require("bluebird");
var kindof_1 = require("@quenk/kindof");
var Either_1 = require("afpl/lib/monad/Either");
exports.Either = Either_1.Either;
/**
 * failure flags an async precondtion as failing.
 * @param <A> The type of the original value.
 * @param <B> The type of the expected valid value.
 * @param message The error message.
 * @param a The original value.
 * @param ctx Context for the error message.
 */
exports.failure = function (message, a, ctx) {
    return exports.resolve(sync.failure(message, a, ctx));
};
/**
 * success flags an async precondition as succeeding.
 * @param <A> The type of the original value.
 * @param <B> The type of the expected valid value.
 * @param b The new value after applying the precondition.
 */
exports.success = function (b) { return exports.resolve(sync.success(b)); };
/**
 * or (async version).
 */
exports.or = function (left, right) {
    return function (value) { return left(value).then(function (e) { return e.cata(function () { return right(value); }, exports.success); }); };
};
/**
 * and (async version).
 *
 * TODO: using the any type until Either is fixed in afpl.
 */
exports.and = function (l, r) { return function (value) {
    return l(value).then(function (e) {
        return e
            .map(function (b) { return r(b); })
            .orRight(function (f) { return exports.failure(f.message, value, f.context); })
            .takeRight();
    });
}; };
/**
 * every (async version).
 */
exports.every = function (p) {
    var list = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        list[_i - 1] = arguments[_i];
    }
    return function (value) {
        return list.reduce(function (promise, condition) {
            return promise
                .then(function (e) { return e.cata(function (f) { return Promise.resolve(sync.left(f)); }, function (b) { return condition(b); }); });
        }, p(value));
    };
};
/**
 * optional (async version).
 */
exports.optional = function (p) {
    return function (value) {
        return ((value == null) || (typeof value === 'string' && value === '')) ?
            exports.success(value) : p(value);
    };
};
/**
 * caseOf (async version).
 */
exports.caseOf = function (t, p) { return function (value) {
    return kindof_1.kindOf(value, t) ? p(value) : exports.failure('caseOf', value, { type: t });
}; };
/**
 * match (async version).
 */
exports.match = function (p) {
    var list = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        list[_i - 1] = arguments[_i];
    }
    return function (value) { return list.reduce(function (pe, f) {
        return pe
            .then(function (e) { return (e instanceof Either_1.Right) ? Promise.resolve(e) :
            Promise
                .resolve(e.takeLeft())
                .then(function (r) { return (r.message === 'caseOf') ?
                f(value) :
                exports.failure(r.message, value, r.context); }); });
    }, p(value)); };
};
/**
 * async wraps the sync api so they can be used with async preconditions safely.
 * @param <A> The type of the input value of the precondition.
 * @param <B> The type of the final value of the precondition.
 * @param a The input value.
 */
exports.async = function (p) { return function (a) { return exports.resolve(p(a)); }; };
/**
 * identity precondtion.
 *
 * Succeeds with whatever value is passed.
 */
exports.identity = function (value) { return exports.success(value); };
/**
 * resolve wraps a value in a Promise.
 */
exports.resolve = Promise.resolve;
/**
 * reject wraps a value in a rejected Promise.
 */
exports.reject = Promise.reject;
//# sourceMappingURL=index.js.map