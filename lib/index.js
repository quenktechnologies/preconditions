"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.caseOf = exports.match = exports.isin = exports.exists = exports.every = exports.and = exports.or = exports.reject = exports.discard = exports.identity = exports.optional = exports.notNull = exports.neq = exports.eq = exports.whenFalse = exports.whenTrue = exports.when = exports.constant = void 0;
/**
 * The precondition library provides an API for validating
 * whether some value meets a pre-condition before it is used
 * in a program.
 *
 * Users of this library are expected to design their own preconditions,
 * however some primitivies are provided to make things easier.
 */
var either_1 = require("@quenk/noni/lib/data/either");
var type_1 = require("@quenk/noni/lib/data/type");
var result_1 = require("./result");
var failure_1 = require("./result/failure");
/**
 * constant forces the value to be the supplied value.
 */
exports.constant = function (b) {
    return function (_) { return result_1.succeed(b); };
};
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
exports.whenTrue = function (condition, applied, otherwise) { return function (value) {
    return (condition === true) ? applied(value) : otherwise(value);
}; };
/**
 * whenFalse (opposite of whenTrue).
 */
exports.whenFalse = function (condition, applied, otherwise) { return function (value) {
    return (condition === false) ? applied(value) : otherwise(value);
}; };
/**
 * eq tests if the value is equal (strictly) to the target.
 */
exports.eq = function (target) {
    return function (value) { return (target === value) ?
        result_1.succeed(target) :
        result_1.fail('eq', value, { target: target }); };
};
/**
 * neq tests if the value is not equal (strictly) to the target.
 */
exports.neq = function (target) { return function (value) {
    return (target === value) ?
        result_1.fail('neq', value, { target: target }) :
        result_1.succeed(target);
}; };
/**
 * notNull will fail if the value is null or undefined.
 */
exports.notNull = function (value) {
    return ((value == null) || ((typeof value === 'string') && (value === ''))) ?
        result_1.fail('notNull', value) :
        result_1.succeed(value);
};
/**
 * optional applies the precondition given only if the value is not null
 * or undefined.
 */
exports.optional = function (p) {
    return function (value) {
        return ((value == null) || (typeof value === 'string' && value === '')) ?
            result_1.succeed(value) : p(value);
    };
};
/**
 * identity always succeeds with the value it is applied to.
 */
exports.identity = function (value) { return result_1.succeed(value); };
/**
 * discard throws away a value by assigning it ot undefined.
 */
exports.discard = function (_) { return result_1.succeed(undefined); };
/**
 * reject always fails with reason no matter the value supplied.
 */
exports.reject = function (reason) { return function (value) {
    return result_1.fail(reason, value);
}; };
/**
 * or performs the equivalent of a logical 'or' between two preconditions.
 */
exports.or = function (left, right) { return function (value) {
    return left(value)
        .orElse(function (f) { return right(value)
        .lmap(function (f2) { return new failure_1.DualFailure(value, f, f2); }); });
}; };
/**
 * and performs the equivalent of a logical 'and' between two preconditions.
 */
exports.and = function (l, r) { return function (value) {
    var result = l(value);
    if (result instanceof either_1.Left) {
        return either_1.left(result.takeLeft());
    }
    else {
        var result2 = r(result.takeRight());
        if (result2 instanceof either_1.Left)
            return either_1.left(failure_1.ModifiedFailure.create(value, result2.takeLeft()));
        else
            return either_1.right(result2.takeRight());
    }
}; };
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
        var r = p(value);
        if (r instanceof either_1.Left)
            return r;
        var r2 = list.reduce(function (p, c) { return p.chain(c); }, either_1.right(r.takeRight()));
        if (r2 instanceof either_1.Left)
            return either_1.left(failure_1.ModifiedFailure.create(value, r2.takeLeft()));
        return either_1.right(r2.takeRight());
    };
};
/**
 * exists requires the value to be enumerated in the supplied list.
 */
exports.exists = function (list) { return function (value) {
    return (list.indexOf(value) < 0) ?
        result_1.fail('exists', value, { value: value, list: list }) :
        result_1.succeed(value);
}; };
/**
 * isin requires the value passed to be a member of a provided list.
 */
exports.isin = function (list) { return function (value) {
    return list.indexOf(value) > -1 ?
        result_1.succeed(value) :
        result_1.fail('isin', value);
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
    return type_1.test(value, t) ? p(value) : result_1.fail('caseOf', value, { type: t });
}; };
/**
 * log the value to the console.
 */
exports.log = function (value) {
    return (console.log(value), result_1.succeed(value));
};
//# sourceMappingURL=index.js.map