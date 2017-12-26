"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Failure_1 = require("./Failure");
exports.Failure = Failure_1.Failure;
var Either_1 = require("afpl/lib/monad/Either");
/**
 * left wraps a value in the left side of an Either
 */
exports.left = Either_1.Either.left;
/**
 * right wraps a value in the right side of an Either
 */
exports.right = Either_1.Either.right;
/**
 * failure produces a new one to one Failure instance wrapped
 * in the left side of an Either.
 */
exports.failure = function (message, value, ctx) {
    if (ctx === void 0) { ctx = {}; }
    return exports.left(new Failure_1.Failure(message, value, ctx));
};
/**
 * success signals a precondition has passed and wraps the latest
 * version of the value in the left side of an Either.
 */
exports.success = function (b) { return exports.right(b); };
/**
 * set the value to the value specified, no matter what
 */
exports.set = function (b) { return function (_a) { return exports.success(b); }; };
/**
 * when conditionally applies one of two preconditions depending
 * on the outcome of a test function.
 */
exports.when = function (test, applied, otherwise) {
    return function (value) { return (test(value) === true) ? applied(value) : otherwise(value); };
};
/**
 * whenTrue conditionally applies applied or otherwise depending
 * on whether condition is true or not.
 */
exports.whenTrue = function (condition, applied, otherwise) {
    return function (value) { return (condition === true) ? applied(value) : otherwise(value); };
};
/**
 * whenFalse (opposite of whenTrue).
 */
exports.whenFalse = function (condition, applied, otherwise) {
    return function (value) { return (condition === false) ? applied(value) : otherwise(value); };
};
/**
 * equals tests if the value is equal to the value specified (strictly).
 */
exports.equals = function (target) {
    return function (value) { return (target === value) ?
        exports.success(target) :
        exports.failure('equals', value, { target: target }); };
};
/**
 * notNull requires a value to be specified.
 */
exports.notNull = function (value) {
    return ((value == null) || ((typeof value === 'string') && (value === ''))) ?
        exports.failure('notNull', value) :
        exports.success(value);
};
/**
 * optional applies the tests given only if the value is != null
 */
exports.optional = function (p) {
    return function (value) {
        return ((value == null) || (typeof value === 'string' && value === '')) ?
            exports.success(value) : p(value);
    };
};
/**
 * identity always succeeds with the original value passed.
 */
exports.identity = function (value) { return exports.success(value); };
/**
 * or performs the equivalent of a logical 'or' between two preconditions.
 */
exports.or = function (left, right) {
    return function (value) { return left(value).orElse(function () { return right(value); }); };
};
/**
 * and performs the equivalent of a logical 'and' between two preconditions.
 */
exports.and = function (l, r) {
    return function (value) { return l(value).chain(r); };
};
/**
 * every takes a set of preconditions and attempts to apply each
 * one after the other to the input.
 */
exports.every = function (p) {
    var list = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        list[_i - 1] = arguments[_i];
    }
    return function (value) {
        return p(value)
            .cata(function (f) { return exports.left(f); }, function (v) { return list.reduce(function (e, f) { return e.chain(f); }, exports.right(v)); });
    };
};
/**
 * exists requires the value to be enumerated in the supplied list.
 */
exports.exists = function (list) { return function (value) {
    return (list.indexOf(value) < 0) ?
        exports.failure('exists', value, { value: value, list: list }) :
        exports.success(value);
}; };
/**
 * unwrap applies a precondition received from a function.
 */
exports.unwrap = function (p) { return function (value) { return p()(value); }; };
var _prims = ['string', 'number', 'boolean'];
var _kindOf = function (t, value) {
    return ((_prims.indexOf(typeof t) > -1) && (value === t)) ?
        true :
        ((typeof t === 'function') &&
            (((t === String) && (typeof value === 'string')) ||
                ((t === Number) && (typeof value === 'number')) ||
                ((t === Boolean) && (typeof value === 'boolean')) ||
                ((t === Array) && (Array.isArray(value))) ||
                (value instanceof t))) ?
            true :
            ((typeof t === 'object') && (typeof value === 'object')) ?
                Object
                    .keys(t)
                    .every(function (k) { return value.hasOwnProperty(k) ?
                    _kindOf(t[k], value[k]) : false; }) :
                false;
};
/**
 * caseOf allows for the selective application of a precondition
 * based on the type or structure of the value.
 *
 * Pattern matching works as follows:
 * string -> Matches on the value of the string.
 * number -> Matches on the value of the number.
 * boolean -> Matches on the value of the boolean.
 * object -> Each key of the object is matched on the value, all must match.
 * function -> Treated as a constructor and results in an instanceof check.
 *             For String,Number and Boolean, this uses the typeof check.
 */
exports.caseOf = function (t, p) { return function (value) {
    return _kindOf(t, value) ? p(value) : exports.failure('caseOf', value, { type: t });
}; };
/**
 * match preforms a type/structure matching on the input
 * value in order to decide which precondition to apply.
 *
 * Preconditions must be wrapped in a 'caseOf' precondition.
 */
exports.match = function (p) {
    var list = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        list[_i - 1] = arguments[_i];
    }
    return function (value) { return list.reduce(function (e, f) {
        return (e instanceof Either_1.Right) ?
            e :
            e.orElse(function (r) { return (r.message === 'caseOf') ?
                f(value) : e; });
    }, p(value)); };
};
/**
 * isin requires the value passed to be a member of a provided list.
 */
exports.isin = function (list) { return function (value) {
    return list.indexOf(value) > -1 ?
        exports.success(value) :
        exports.failure('isin', value);
}; };
//# sourceMappingURL=index.js.map