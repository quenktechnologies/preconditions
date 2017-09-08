"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var afpl = require("afpl");
var polate = require("@quenk/polate");
var Async = require("./Async");
exports.Async = Async;
/**
 * Failure means a precondition did not go so well.
 */
var Failure = /** @class */ (function () {
    function Failure(message, value, context) {
        if (context === void 0) { context = {}; }
        this.message = message;
        this.value = value;
        this.context = context;
    }
    Failure.prototype.expand = function (templates, c) {
        if (templates === void 0) { templates = {}; }
        if (c === void 0) { c = {}; }
        var combined = (typeof c['$key'] === 'string') ?
            c.$key + "." + this.message :
            this.message;
        var key = c.$key;
        var $value = this.value;
        return polate.polate(((templates[combined]) ?
            templates[combined] :
            (templates[key]) ?
                templates[key] :
                (templates[this.message]) ?
                    templates[this.message] :
                    this.message), afpl.util.merge(this.context, c, { $value: $value }));
    };
    return Failure;
}());
exports.Failure = Failure;
var ListFailure = /** @class */ (function (_super) {
    __extends(ListFailure, _super);
    function ListFailure(failures, value, contexts) {
        if (contexts === void 0) { contexts = {}; }
        var _this = _super.call(this, 'list', value, contexts) || this;
        _this.failures = failures;
        _this.value = value;
        _this.contexts = contexts;
        return _this;
    }
    ListFailure.prototype.expand = function (templates, c) {
        if (templates === void 0) { templates = {}; }
        if (c === void 0) { c = {}; }
        return afpl.util.reduce(this.failures, (function (o, f, $index) {
            return afpl.util.merge(o, (_b = {},
                _b[$index] = f.expand(templates, afpl.util.merge(c, { $index: $index })),
                _b));
            var _b;
        }), {});
    };
    return ListFailure;
}(Failure));
exports.ListFailure = ListFailure;
/**
 * MapFailure is contains info on failures that occured while applying preconditions.
 */
var MapFailure = /** @class */ (function (_super) {
    __extends(MapFailure, _super);
    function MapFailure(failures, value, contexts) {
        if (contexts === void 0) { contexts = {}; }
        var _this = _super.call(this, 'map', value, contexts) || this;
        _this.failures = failures;
        _this.value = value;
        _this.contexts = contexts;
        return _this;
    }
    MapFailure.prototype.expand = function (templates, c) {
        if (templates === void 0) { templates = {}; }
        if (c === void 0) { c = {}; }
        return afpl.util.reduce(this.failures, function (o, f, $key) {
            return afpl.util.merge(o, (_b = {},
                _b[$key] = f.expand(templates, afpl.util.merge(c, { $key: $key })),
                _b));
            var _b;
        }, {});
    };
    return MapFailure;
}(Failure));
exports.MapFailure = MapFailure;
exports.whenLeft = function (key, _b) {
    var failures = _b.failures, values = _b.values;
    return function (f) {
        return ({
            values: values,
            failures: afpl.util.merge(failures, (_b = {},
                _b[key] = f,
                _b))
        });
        var _b;
    };
};
exports.whenRight = function (key, _b) {
    var failures = _b.failures, values = _b.values;
    return function (v) {
        return (v == null) ?
            { failures: failures, values: values } :
            ({
                failures: failures,
                values: afpl.util.merge(values, (_b = {},
                    _b[key] = v,
                    _b))
            });
        var _b;
    };
};
exports.left = afpl.Either.left;
exports.right = afpl.Either.right;
exports.fail = function (message, value, ctx) {
    if (ctx === void 0) { ctx = {}; }
    return afpl.Either.left(new Failure(message, value, ctx));
};
exports.mapFail = function (errors, value, contexts) {
    if (contexts === void 0) { contexts = {}; }
    return afpl.Either.left(new MapFailure(errors, value, contexts));
};
exports.valid = function (b) { return afpl.Either.right(b); };
/**
 * map accepts a javascript object whose properties are all preconditions
 * and returns a function that will apply each to input.
 */
exports.map = function (conditions) { return function (value) {
    var init = { failures: {}, values: {} };
    if (typeof value !== 'object') {
        return exports.mapFail({}, value);
    }
    else {
        var reports = afpl.util.reduce(conditions, function (r, p, k) {
            return p.apply(null, value[k])
                .cata(exports.whenLeft(k, r), exports.whenRight(k, r));
        }, init);
        if (Object.keys(reports.failures).length > 0)
            return exports.mapFail(reports.failures, value);
        else
            return exports.valid(reports.values);
    }
}; };
/**
 * partial is like map except it only applies to keys that exists
 */
exports.partial = function (conditions) {
    return function (value) {
        var init = { failures: {}, values: {} };
        if (typeof value !== 'object') {
            return exports.mapFail({}, value);
        }
        else {
            var reports = afpl.util.reduce(value, function (r, value, k) {
                return (conditions.hasOwnProperty(k)) ?
                    conditions[k].apply(null, value)
                        .cata(exports.whenLeft(k, r), exports.whenRight(k, r)) :
                    r;
            }, init);
            if (Object.keys(reports.failures).length > 0)
                return exports.mapFail(reports.failures, value);
            else
                return exports.valid(reports.values);
        }
    };
};
/**
 * or
 */
exports.or = function (left, right) {
    return function (value) {
        return left
            .apply(null, value)
            .cata(function () { return right.apply(null, value); }, function (b) { return exports.valid(b); });
    };
};
/**
 * and
 */
exports.and = function (left, right) {
    return function (value) {
        return left
            .apply(null, value)
            .cata(afpl.Either.left, function (v) { return right.apply(null, v); });
    };
};
/**
 * set
 */
exports.set = function (v) { return function (_a) { return exports.valid(v); }; };
/**
 * whenTrue does evaluates condition and decides
 * whether to return left if false or right if true.
 *
 * The evaluation is done before apply is called.
 */
exports.whenTrue = function (condition, left, right) {
    return function (value) { return (condition ? right.apply(null, value) : left.apply(null, value)); };
};
/**
 * number tests if the value supplied is a number.
 */
exports.number = function () {
    return function (n) { return (typeof n === 'number') ?
        exports.valid(n) :
        exports.fail('number', n); };
};
/**
 * string tests if the value is a string.
 */
exports.string = function () {
    return function (s) { return (typeof s === 'string') ?
        exports.valid(s) :
        exports.fail('string', s); };
};
/**
 * list tests if the value is an array.
 */
exports.list = function () {
    return function (a) { return (Array.isArray(a)) ?
        exports.valid(a) :
        exports.fail('list', a); };
};
/**
 * each applies a precondition for each member of an array.
 */
exports.each = function (p) {
    return function (value) {
        var r = value.reduce(function (_b, a, k) {
            var failures = _b.failures, values = _b.values;
            return p.apply(null, a).cata(function (f) {
                return ({
                    values: values,
                    failures: afpl.util.merge(failures, (_b = {}, _b[k] = f, _b))
                });
                var _b;
            }, function (b) { return ({
                failures: failures,
                values: values.concat(b)
            }); });
        }, { failures: {}, values: [] });
        if (Object.keys(r.failures).length > 0)
            return afpl.Either.left(new ListFailure(r.failures, value));
        else
            return exports.valid(r.values);
    };
};
/**
 * isin requires the value to be enumerated in the supplied list.
 */
exports.isin = function (list) {
    return function (value) {
        return (list.indexOf(value) < 0) ?
            exports.fail('isin', value, { list: list }) :
            exports.valid(value);
    };
};
/**
 * object tests if the value is an js object.
 */
exports.object = function () {
    return function (value) {
        return (typeof value === 'object' && (!Array.isArray(value))) ?
            exports.valid(value) :
            exports.fail('object', value);
    };
};
/**
 * matches tests if the value satisfies a regular expression.
 */
exports.matches = function (pattern) {
    return function (value) {
        return (!pattern.test(value)) ?
            exports.fail('matches', value, { pattern: pattern.toString() }) :
            exports.valid(value);
    };
};
/**
 * range tests if a string, number or array falls within a range
 */
exports.range = function (min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = Infinity; }
    return function (value) {
        var test = ((Array.isArray(value)) || (typeof value === 'string')) ?
            value.length :
            value;
        return (test < min) ?
            exports.fail('range.min', test, { min: min, max: max }) :
            (test > max) ?
                exports.fail('range.max', test, { min: min, max: max }) :
                exports.valid(test);
    };
};
var isB = function (a, b) { return (a === b); };
/**
 * equals tests if the value is equal to the value specified (strictly).
 */
exports.equals = function (target) {
    return function (value) { return isB(value, target) ?
        exports.valid(target) :
        exports.fail('equals', value, { target: target }); };
};
/**
 * required requires a value to be specified
 */
exports.required = function () {
    return function (value) {
        return ((value == null) || ((typeof value === 'string') && (value === ''))) ?
            exports.fail('notNull', value) :
            exports.valid(value);
    };
};
/**
 * optional applies the tests given only if the value is != null
 */
exports.optional = function (p) {
    return function (value) {
        return (value == null) ?
            exports.valid(null) :
            p.apply(null, value);
    };
};
//# sourceMappingURL=index.js.map