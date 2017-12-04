"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sync = require("../");
var Promise = require("bluebird");
var afpl_1 = require("afpl");
exports.Either = afpl_1.Either;
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
 */
exports.and = function (left, right) {
    return function (value) { return left(value).then(function (e) { return e.cata(Promise.resolve, function (v) { return right(v); }); }); };
};
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
 * async wraps the sync api so they can be used with async preconditions safely.
 * @param <A> The type of the input value of the precondition.
 * @param <B> The type of the final value of the precondition.
 * @param a The input value.
 */
exports.async = function (p) { return function (a) { return exports.resolve(p(a)); }; };
/**
 * resolve wraps a value in a Promise.
 */
exports.resolve = Promise.resolve;
/**
 * reject wraps a value in a rejected Promise.
 */
exports.reject = Promise.reject;
//# sourceMappingURL=index.js.map