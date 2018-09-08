"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var kindof_1 = require("@quenk/kindof");
var either_1 = require("@quenk/noni/lib/data/either");
var function_1 = require("@quenk/noni/lib/data/function");
var failure_1 = require("./failure");
/**
 * async wraps the sync api so they can be used with async preconditions safely.
 */
exports.async = function (p) { return function (a) { return Promise.resolve(p(a)); }; };
/**
 * or (async version).
 */
exports.or = function (left, right) { return function (value) {
    return left(value).then(function (e) {
        return (either_1.either(function_1.cons(right(value)))(failure_1.success)(e));
    });
}; };
/**
 * and (async version).
 *
 * TODO: using the any type until Either is fixed in afpl.
 */
exports.and = function (l, r) { return function (value) {
    return l(value).then(function (e) {
        return e.map(function (b) { return r(b); })
            .orRight(function (f) { return failure_1.failure(f.message, value, f.context); })
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
        return p(value).then(function (e) {
            return either_1.either(evl)(ev(list))(e);
        });
    };
};
var ev = function (list) { return function (b) {
    return list.reduce(function (p, c) {
        return p.then(ev2(c));
    }, Promise.resolve(either_1.right(b)));
}; };
var ev2 = function (p) { return function (e) {
    return either_1.either(evl)(function (b) { return p(b); })(e);
}; };
var evl = function (f) { return Promise.resolve(either_1.left(f)); };
/**
 * optional (async version).
 */
exports.optional = function (p) {
    return function (value) {
        return ((value == null) || (typeof value === 'string' && value === '')) ?
            failure_1.success(value) : p(value);
    };
};
/**
 * caseOf (async version).
 */
exports.caseOf = function (t, p) { return function (value) {
    return kindof_1.kindOf(value, t) ? p(value) : failure_1.failure('caseOf', value, { type: t });
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
            .then(function (e) { return (e instanceof either_1.Right) ? Promise.resolve(e) :
            Promise
                .resolve(e.takeLeft())
                .then(function (r) { return (r.message === 'caseOf') ?
                f(value) :
                failure_1.failure(r.message, value, r.context); }); });
    }, p(value)); };
};
/**
 * identity precondtion.
 *
 * Succeeds with whatever value is passed.
 */
exports.identity = function (value) { return failure_1.success(value); };
exports.id = exports.identity;
/**
 * fail always fails with reason no matter the value supplied.
 */
exports.fail = function (reason) { return function (value) {
    return failure_1.failure(reason, value);
}; };
/**
 * log the value to the console.
 */
exports.log = function (value) { return console.error(value) || failure_1.success(value); };
//# sourceMappingURL=index.js.map