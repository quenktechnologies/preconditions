"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("afpl/lib/util");
var _1 = require("../");
exports.success = _1.success;
var ArrayFailure_1 = require("./ArrayFailure");
exports.ArrayFailure = ArrayFailure_1.ArrayFailure;
var Either_1 = require("afpl/lib/monad/Either");
exports.Either = Either_1.Either;
/**
 * failure
 */
exports.failure = function (errors, value, contexts) {
    return _1.left(new ArrayFailure_1.ArrayFailure(errors, value, contexts));
};
exports.onFailure = function (key, _a) {
    var failures = _a.failures, values = _a.values;
    return function (f) {
        return ({ values: values, failures: util.merge(failures, (_a = {}, _a[key] = f, _a)) });
        var _a;
    };
};
exports.onSuccess = function (_a) {
    var failures = _a.failures, values = _a.values;
    return function (b) {
        return ({ failures: failures, values: values.concat(b) });
    };
};
/**
 * @private
 */
exports.review = function (value, r) {
    return (Object.keys(r.failures).length > 0) ?
        exports.failure(r.failures, value, { value: value }) :
        _1.success(r.values);
};
/**
 * isArray tests if the value is an array
 */
exports.isArray = function (a) { return Array.isArray(a) ?
    _1.success(a) :
    _1.failure('isArray', a); };
/**
 * notEmpty tests if an array has at least one member.
 */
exports.notEmpty = function (value) { return (value.length === 0) ?
    _1.failure('notEmpty', value, { value: value }) : _1.success(value); };
/**
 * range tests whether an array falls within a specific min and max range.
 */
exports.range = function (min, max) { return function (value) {
    return (value.length < min) ?
        _1.failure('range.min', value, { min: min, max: max, value: value }) :
        (value.length > max) ?
            _1.failure('range.max', value) :
            _1.success(value);
}; };
/**
 * filter applies a precondition to each member of an array producing
 * an array where only the successful members are retained.
 *
 * @param <A> The type of the input object.
 * @param <B> The type of the final object.
 * @param p The precondition to apply to each member.
 */
exports.filter = function (p) {
    return function (value) { return _1.success(value.map(function (a) {
        return p(a).cata(function () { return null; }, function (b) { return b; });
    }).filter(function (x) { return x != null; })); };
};
/**
 * map applies a precondition to each member of an array.
 *
 * If the precondition fails for any of the members,
 * the entire array is considered a failure.
 * @param <A> The type of the input object.
 * @param <B> The type of the final object.
 * @param p The precondition to apply to each member.
 */
exports.map = function (p) {
    return function (value) {
        return exports.review(value, value.reduce(function (reports, a, k) {
            return p(a).cata(exports.onFailure(k, reports), exports.onSuccess(reports));
        }, { failures: {}, values: [] }));
    };
};
//# sourceMappingURL=index.js.map