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
var Failure = (function () {
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
var ListFailure = (function (_super) {
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
var MapFailure = (function (_super) {
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
var Func = (function () {
    function Func(f) {
        this.f = f;
    }
    Func.prototype.apply = function (value) {
        return this.f(value);
    };
    return Func;
}());
exports.Func = Func;
/**
 * Map of preconditions.
 *
 * A map applies a precondition for each property declared on it.
 * Do not declare any key values that do not implement Precondition.
 */
var Map = (function () {
    function Map() {
    }
    Map.prototype.getConditions = function () {
        return this;
    };
    Map.prototype.apply = function (value) {
        var conditions = this.getConditions();
        var init = { failures: {}, values: {} };
        var left = function (key, _b) {
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
        var right = function (key, _b) {
            var failures = _b.failures, values = _b.values;
            return function (b) {
                return (b == null) ? { failures: failures, values: values } : ({
                    values: afpl.util.merge(values, (_b = {},
                        _b[key] = b,
                        _b)), failures: failures
                });
                var _b;
            };
        };
        if (typeof value !== 'object') {
            return exports.mapFail({}, value);
        }
        else {
            var result = afpl.util.reduce(conditions, function (reports, condition, key) {
                return condition.apply(value[key])
                    .cata(left(key, reports), right(key, reports));
            }, init);
            if (Object.keys(result.failures).length > 0)
                return exports.mapFail(result.failures, value);
            else
                return exports.valid(result.values);
        }
    };
    return Map;
}());
exports.Map = Map;
/**
 * Hash is like Map except you specify the preconditions by passing
 * a plain old javascript object.
 */
var Hash = (function (_super) {
    __extends(Hash, _super);
    function Hash(conditions) {
        var _this = _super.call(this) || this;
        _this.conditions = conditions;
        return _this;
    }
    Hash.prototype.getConditions = function () {
        return this.conditions;
    };
    return Hash;
}(Map));
exports.Hash = Hash;
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
 * func
 */
exports.func = function (f) { return new Func(f); };
/**
 * or
 */
exports.or = function (left, right) {
    return exports.func(function (value) { return left.apply(value).cata(function () { return right.apply(value); }, function (v) { return exports.valid(v); }); });
};
/**
 * and
 */
exports.and = function (left, right) {
    return exports.func(function (value) { return left.apply(value).cata(afpl.Either.left, function (v) { return right.apply(v); }); });
};
/**
 * set
 */
exports.set = function (v) { return exports.func(function (_a) { return exports.valid(v); }); };
/**
 * whenTrue does evaluates condition and decides
 * whether to return left if false or right if true.
 *
 * The evaluation is done before apply is called.
 */
exports.whenTrue = function (condition, left, right) {
    return exports.func(function (value) { return condition ? right.apply(value) : left.apply(value); });
};
/**
 * number tests if the value supplied is a number.
 */
exports.number = function () { return exports.func(function (n) {
    return (typeof n === 'number') ? exports.valid(n) : exports.fail('number', n);
}); };
/**
 * string tests if the value is a string.
 */
exports.string = function () { return exports.func(function (s) {
    return (typeof s === 'string') ? exports.valid(s) : exports.fail('string', s);
}); };
/**
 * list tests if the value is an array.
 */
exports.list = function () { return exports.func(function (a) {
    return (Array.isArray(a)) ? exports.valid(a) : exports.fail('list', a);
}); };
/**
 * each applies a precondition for each member of an array.
 */
exports.each = function (p) {
    return exports.func(function (value) {
        if (Array.isArray(value)) {
            var r = value.reduce(function (_b, a, k) {
                var failures = _b.failures, values = _b.values;
                return p.apply(a).cata(function (f) {
                    return ({
                        values: values,
                        failures: afpl.util.merge(failures, (_b = {}, _b[k] = f, _b))
                    });
                    var _b;
                }, function (v) { return ({
                    failures: failures,
                    values: values.concat(v)
                }); });
            }, { failures: {}, values: [] });
            if (Object.keys(r.failures).length > 0)
                return afpl.Either.left(new ListFailure(r.failures, value));
            else
                return exports.valid(r.values);
        }
        else {
            return exports.fail('invalid', value);
        }
    });
};
/**
 * object tests if the value is a js object.
 */
exports.object = function () {
    return exports.func(function (value) { return (typeof value !== 'object') ?
        exports.fail('object', value) :
        (Array.isArray(value)) ?
            exports.fail('object', value) :
            exports.valid(value); });
};
/**
 * matches tests if the value satisfies a regular expression.
 */
exports.matches = function (pattern) {
    return exports.func(function (value) { return (!pattern.test(value)) ?
        exports.fail('matches', value, { pattern: pattern.toString() }) :
        exports.valid(value); });
};
/**
 * range tests if a string, number or array falls within a range
 */
exports.range = function (min, max) {
    return exports.func(function (value) {
        var test = (typeof value === 'number') ?
            value :
            (Array.isArray(value)) ?
                value.length :
                (typeof value === 'string') ?
                    value.length : null;
        if (test === null)
            return exports.fail('invalid', value, { min: min, max: max });
        if (test < min)
            return exports.fail('range.min', value, { min: min, max: max });
        if (test > max)
            return exports.fail('range.max', value, { min: min, max: max });
        return exports.valid(value);
    });
};
var isB = function (a, b) { return (a === b); };
/**
 * equals tests if the value is equal to the value specified (strictly).
 */
exports.equals = function (target) {
    return exports.func(function (value) { return isB(value, target) ?
        exports.valid(target) :
        exports.fail('equals', value, { target: target }); });
};
/**
 * required requires a value to be specified
 */
exports.required = function () {
    return exports.func(function (value) {
        return ((value == null) || ((typeof value === 'string') && (value === ''))) ?
            exports.fail('notNull', value) :
            exports.valid(value);
    });
};
/**
 * isin requires the value to be enumerated in the supplied list.
 */
exports.isin = function (list) {
    return exports.func(function (value) {
        return (list.indexOf(value) < 0) ?
            exports.fail('isin', value, { list: list }) :
            exports.valid(value);
    });
};
/**
 * optional applies the tests given only if the value is != null
 */
exports.optional = function (t) {
    return exports.func(function (value) { return (value == null) ? exports.valid(value) : t.apply(value); });
};
/**
 * length tests if the value is of a certain length.
 */
exports.length = function (len) {
    return exports.func(function (value) { return (value.length !== len) ?
        exports.fail('length', value, { length: len }) :
        exports.valid(value); });
};
//# sourceMappingURL=Map.js.map