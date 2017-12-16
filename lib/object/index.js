"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("afpl/lib/util");
var _1 = require("../");
exports.success = _1.success;
var ObjectFailure_1 = require("./ObjectFailure");
exports.ObjectFailure = ObjectFailure_1.ObjectFailure;
exports.Failure = ObjectFailure_1.ObjectFailure;
var Either_1 = require("afpl/lib/monad/Either");
exports.Either = Either_1.Either;
/**
 * @private
 */
exports.onFailure = function (key, _a) {
    var failures = _a.failures, values = _a.values;
    return function (f) {
        return ({
            values: values,
            failures: util.merge(failures, (_a = {},
                _a[key] = f,
                _a))
        });
        var _a;
    };
};
/**
 * @private
 */
exports.onSuccess = function (key, _a) {
    var failures = _a.failures, values = _a.values;
    return function (v) {
        return (v == null) ?
            { failures: failures, values: values } :
            ({
                failures: failures,
                values: util.merge(values, (_a = {},
                    _a[key] = v,
                    _a))
            });
        var _a;
    };
};
/**
 * @private
 */
exports.review = function (reports, value) {
    return (Object.keys(reports.failures).length > 0) ?
        exports.failure(reports.failures, value, { value: value }) :
        _1.success(reports.values);
};
/**
 * keysUnion creates an array of keys from the keys of two objects.
 */
exports.keysUnion = function (o1, o2) {
    return Object
        .keys(o1)
        .concat(Object.keys(o2))
        .filter(function (k, i, l) { return l.indexOf(k) == i; });
};
/**
 * failure produces a new failure wrapped in the left side
 * of an Either from a map (object) of failures.
 */
exports.failure = function (errors, value, contexts) {
    return _1.left(new ObjectFailure_1.ObjectFailure(errors, value, contexts));
};
/**
 * isObject tests if the value is an js object (and not an Array).
 */
exports.isObject = function (value) {
    return (typeof value === 'object' && (!Array.isArray(value))) ?
        _1.success(value) : _1.failure('isObject', value);
};
/**
 * where applies a precondition to an object, only if a record
 * of predicates all pass.
 *
 */
exports.where = function (tests, p, otherwise) {
    return function (value) { return Object.keys(tests).every(function (k) { return tests[k](value); }) ? p(value) : otherwise(value); };
};
/**
 * restrict applies a record of preconditions to an input object keeping
 * only those properties that have a matching precondition.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 *
 * @param <A> The type of the input object.
 * @param <AB> An ADT representing the input property values and final property values.
 * @param <B> The type of the final object.
 * @param conditions A record of Preconditions to apply to the input object.
 */
exports.restrict = function (conditions) { return function (value) {
    var init = { failures: {}, values: {} };
    var reports = util.reduce(conditions, function (r, p, k) {
        return p(value[k]).cata(exports.onFailure(k, r), exports.onSuccess(k, r));
    }, init);
    return exports.review(reports, value);
}; };
/**
 * disjoint applies a record of preconditions to a javascript object
 * producing a new object with the final value of each precondition
 * and the values of any additional properties in the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 * @param <A> The type of the input object.
 * @param <AB> An ADT representing the input property values and final property values.
 * @param <B> The type of the final object.
 * @param conditions A record of preconditions to apply to an input object.
 */
exports.disjoint = function (conditions) { return function (value) {
    var init = { failures: {}, values: {} };
    var reports = util.reduce(value, function (r, x, k) {
        return (conditions.hasOwnProperty(k)) ?
            conditions[k](x)
                .cata(exports.onFailure(k, r), exports.onSuccess(k, r)) :
            exports.onSuccess(k, r)(x);
    }, init);
    return exports.review(reports, value);
}; };
/**
 * intersect applies only the properties in a record of preconditions
 * that exist in the target input object. The resulting value is an
 * object with properties that exist in the input object that have had a
 * matching precondition applied.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 * @param <A> The type of the input value.
 * @param <AB> An ADT representing the domain of intial key values and final key values.
 * @param <B> The type of the final value.
 * @param conditions A record of Preconditions to apply to the input value.
 */
exports.intersect = function (conditions) {
    return function (value) {
        var init = { failures: {}, values: {} };
        var reports = util.reduce(value, function (r, x, k) {
            return (conditions.hasOwnProperty(k)) ?
                conditions[k](x)
                    .cata(exports.onFailure(k, r), exports.onSuccess(k, r)) :
                exports.onSuccess(k, r)(null);
        }, init);
        return exports.review(reports, value);
    };
};
/**
 * union applies a record of preconditions to an input object.
 *
 * Union results in an object that has both the results of applied preconditions for
 * found properties and any additional properties on the input object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 * @param <A> The type of the input value.
 * @param <AB> An ADT representing the domain of intial key values and final key values.
 * @param <B> The type of the final value.
 * @param condition The precondition to apply to the input value.
 */
exports.union = function (conditions) {
    return function (value) {
        var keys = exports.keysUnion(conditions, value);
        var init = { failures: {}, values: {} };
        var reports = keys.reduce(function (r, k) {
            return conditions.hasOwnProperty(k) ?
                conditions[k](value[k]).cata(exports.onFailure(k, r), exports.onSuccess(k, r)) :
                exports.onSuccess(k, r)(value[k]);
        }, init);
        return exports.review(reports, value);
    };
};
/**
 * map applies the same Precondition to each property of an object.
 *
 * If any of the preconditions fail, the whole object is considered a failure.
 * @param <A> The type of the input value.
 * @param <AB> An ADT representing the domain of intial key values and final key values.
 * @param <B> The type of the final value.
 * @param condition The precondition to apply to the input value.
 */
exports.map = function (condition) {
    return function (value) {
        var init = { failures: {}, values: {} };
        var reports = util.reduce(value, function (r, x, k) {
            return condition(x).cata(exports.onFailure(k, r), exports.onSuccess(k, r));
        }, init);
        return exports.review(reports, value);
    };
};
//# sourceMappingURL=index.js.map