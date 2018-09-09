"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The precondition library provides an API for validating
 * whether some value meets a pre-condition before it is used
 * in a program.
 *
 * Users of this library are expected to design their own preconditions,
 * however some primitivies are provided to make things easier.
 */
var either_1 = require("@quenk/noni/lib/data/either");
var result_1 = require("./result");
/**
 * left wraps a value in the left side of an Either
 */
//export const left: <A, B>(a: A) => Either<A, B> = Either.left;
/**
 * right wraps a value in the right side of an Either
 */
//export const right: <A, B>(b: B) => Either<A, B> = Either.right;
/**
 * set the value to the supplied value.
 */
exports.set = function (b) { return function (_) { return result_1.success(b); }; };
exports.cons = exports.set;
/**
 * when conditionally applies one of two preconditions depending
 * on the outcome of a test function.
 */
exports.when = function (test, applied, otherwise) {
    return function (value) { return (test(value) === true) ? applied(value) : otherwise(value); };
};
/**
 * whenTrue conditionally applies "applied" or "otherwise" depending
 * on whether "condition" is true or not.
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
 * equals tests if the value is equal (strictly) to the value specified.
 */
exports.equals = function (target) {
    return function (value) { return (target === value) ?
        result_1.success(target) :
        result_1.failure('equals', value, { target: target }); };
};
/**
 * notNull will fail if the value is null or undefined.
 */
exports.notNull = function (value) {
    return ((value == null) || ((typeof value === 'string') && (value === ''))) ?
        result_1.failure('notNull', value) :
        result_1.success(value);
};
/**
 * optional applies the precondition given only if the value is not null
 * or undefined.
 */
exports.optional = function (p) {
    return function (value) {
        return ((value == null) || (typeof value === 'string' && value === '')) ?
            result_1.success(value) : p(value);
    };
};
/**
 * identity always succeeds with the value it is applied to.
 */
exports.identity = function (value) { return result_1.success(value); };
exports.id = exports.identity;
/**
 * fail always fails with reason no matter the value supplied.
 */
exports.fail = function (reason) { return function (value) {
    return result_1.failure(reason, value);
}; };
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
    return function (value) { return (l(value).chain(r)); };
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
        return either_1.either(function (f) { return either_1.left(f); })(function (v) { return list.reduce(function (e, f) {
            return e.chain(f);
        }, either_1.right(v)); })(p(value));
    };
};
/**
 * exists requires the value to be enumerated in the supplied list.
 */
exports.exists = function (list) { return function (value) {
    return (list.indexOf(value) < 0) ?
        result_1.failure('exists', value, { value: value, list: list }) :
        result_1.success(value);
}; };
/**
 * isin requires the value passed to be a member of a provided list.
 */
exports.isin = function (list) { return function (value) {
    return list.indexOf(value) > -1 ?
        result_1.success(value) :
        result_1.failure('isin', value);
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
        return (e instanceof either_1.Right) ?
            e :
            e.orElse(function (r) { return (r.message === 'caseOf') ?
                f(value) : e; });
    }, p(value)); };
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
    return _kindOf(t, value) ? p(value) : result_1.failure('caseOf', value, { type: t });
}; };
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
 * log the value to the console.
 */
exports.log = function (value) {
    return console.log(value) || result_1.success(value);
};
//# sourceMappingURL=index.js.map