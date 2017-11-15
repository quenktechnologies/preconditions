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
var afpl_1 = require("afpl");
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
    Failure.prototype.explain = function (templates, c) {
        if (templates === void 0) { templates = {}; }
        if (c === void 0) { c = {}; }
        var combined = (typeof c['$key'] === 'string') ?
            c.$key + "." + this.message :
            this.message;
        var key = c.$key;
        var $value = this.value;
        //@todo: fix stairway to hell
        return polate.polate(((templates[combined]) ?
            templates[combined] :
            (templates[key]) ?
                templates[key] :
                (templates[this.message.split('.')[0]]) ?
                    templates[this.message.split('.')[0]] :
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
    ListFailure.prototype.explain = function (templates, c) {
        if (templates === void 0) { templates = {}; }
        if (c === void 0) { c = {}; }
        return afpl.util.reduce(this.failures, (function (o, f, $index) {
            return afpl.util.merge(o, (_b = {},
                _b[$index] = f.explain(templates, afpl.util.merge(c, { $index: $index })),
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
    MapFailure.prototype.explain = function (templates, c) {
        if (templates === void 0) { templates = {}; }
        if (c === void 0) { c = {}; }
        return afpl.util.reduce(this.failures, function (o, f, $key) {
            return afpl.util.merge(o, (_b = {},
                _b[$key] = f.explain(templates, afpl.util.merge(c, { $key: $key })),
                _b));
            var _b;
        }, {});
    };
    return MapFailure;
}(Failure));
exports.MapFailure = MapFailure;
/**
 * @private
 */
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
/**
 * @private
 */
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
/**
 * left wraps a value in the left side of an Either
 */
exports.left = afpl_1.Either.left;
/**
 * right wraps a value in the right side of an Either
 */
exports.right = afpl_1.Either.right;
/**
 * fail produces a new one to one Failure instance wrapped
 * in the left side of an Either.
 */
exports.fail = function (message, value, ctx) {
    if (ctx === void 0) { ctx = {}; }
    return exports.left(new Failure(message, value, ctx));
};
/**
 * mapFail produces a new MapFailure wrapped in the left side
 * of an Either from a map (object) of failures.
 */
exports.mapFail = function (errors, value, contexts) {
    if (contexts === void 0) { contexts = {}; }
    return exports.left(new MapFailure(errors, value, contexts));
};
/**
 * listFail produces a new ListFailure wrapped in the left side
 * of an Either
 */
exports.listFail = function (errors, value, contexts) {
    if (contexts === void 0) { contexts = {}; }
    return exports.left(new ListFailure(errors, value, contexts));
};
/**
 * valid signals a precondition has passed and wraps the latest
 * version of the value in the left side of an Either.
 */
exports.valid = function (b) { return exports.right(b); };
/* Preconditions */
/**
 * map accepts a javascript object whose properties are all preconditions
 * and returns a function that will apply each to the corresponding key.
 *
 * The A type class is the type of values the passed object is expected to
 * have and the B the resulting object/interface we get when all preconditions
 * pass.
 */
exports.map = function (conditions) { return function (value) {
    var init = { failures: {}, values: {} };
    if (typeof value !== 'object') {
        return exports.mapFail({}, value);
    }
    else {
        var reports = afpl.util.reduce(conditions, function (r, p, k) {
            return p(value[k])
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
 * on the passed value.
 */
exports.partial = function (conditions) {
    return function (value) {
        var init = { failures: {}, values: {} };
        if (typeof value !== 'object') {
            return exports.mapFail({}, value);
        }
        else {
            var reports = afpl.util.reduce(value, function (r, x, k) {
                return (conditions.hasOwnProperty(k)) ?
                    conditions[k](x)
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
    return function (value) { return left(value).orElse(function () { return right(value); }); };
};
/**
 * and
 */
exports.and = function (l, r) {
    return function (value) { return l(value).chain(r); };
};
/**
 * every takes a set of preconditions and attempts to apply all
 * one after the other to the input
 */
exports.every = function () {
    var ps = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ps[_i] = arguments[_i];
    }
    return function (value) { return ps.reduce(function (p, c) { return p.chain(c); }, exports.right(value)); };
};
/**
 * set the value to the value specified, no matter what
 */
exports.set = function (b) { return function (_a) { return exports.valid(b); }; };
/**
 * populated tests if an array or object is populated.
 */
exports.populated = function (value) {
    return Object.keys(value).length === 0 ?
        exports.fail('populated', value) :
        exports.valid(value);
};
/**
 * whenTrue does evaluates condition and decides
 * whether to return left if false or right if true.
 *
 * The evaluation is done before apply is called.
 */
exports.whenTrue = function (condition, left, right) {
    return function (value) { return condition ? right(value) : left(value); };
};
/**
 * each applies a precondition for each member of an array.
 */
exports.each = function (p) {
    return function (value) {
        var r = value.reduce(function (_b, a, k) {
            var failures = _b.failures, values = _b.values;
            return p(a).cata(function (f) {
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
            return exports.listFail(r.failures, value);
        else
            return exports.valid(r.values);
    };
};
/**
 * matches tests if the value satisfies a regular expression.
 */
exports.matches = function (pattern) { return function (value) {
    return (!pattern.test(value)) ?
        exports.fail('matches', value, { pattern: pattern.toString() }) :
        exports.valid(value);
}; };
/**
 * range tests if a string, number or array falls within a range
 */
exports.range = function (min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = Infinity; }
    return function (value) {
        return (Array.isArray(value)) ?
            ((value.length < min) ? exports.fail('range.min', value) :
                (value.length > max) ? exports.fail('range.max', value) :
                    exports.valid(value)) :
            (typeof value === 'string') ?
                ((value.length < min) ? exports.fail('range.min', value) :
                    (value.length > max) ? exports.fail('range.max', value) :
                        exports.valid(value)) :
                (value < min) ?
                    exports.fail('range.min', value, { min: min, max: max }) :
                    (value > max) ?
                        exports.fail('range.max', value, { min: min, max: max }) :
                        exports.valid(value);
    };
};
/**
 * @private
 */
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
exports.required = function (value) {
    return ((value == null) || ((typeof value === 'string') && (value === ''))) ?
        exports.fail('notNull', value) :
        exports.valid(value);
};
/**
 * optional applies the tests given only if the value is != null
 */
exports.optional = function (p) {
    return function (value) {
        return ((value == null) || (typeof value === 'string' && value === '')) ?
            exports.valid(value) : p(value);
    };
};
/**
 * upper transforms a string into uppercase
 */
exports.upper = function (s) { return exports.valid(s.toUpperCase()); };
/**
 * lower transforms a string into lowercase
 */
exports.lower = function (s) { return exports.valid(s.toLowerCase()); };
exports.trim = function (s) { return exports.valid(s.trim()); };
/**
 * number tests if a value is a number
 */
exports.number = function (n) {
    return ((typeof n === 'number') && (!isNaN(n))) ? exports.valid(n) :
        exports.fail('number', n);
};
/**
 * string tests if a value is a string
 */
exports.string = function (a) { return (typeof a === 'string') ?
    exports.valid(a) : exports.fail('string', a); };
/**
 * array tests if the value is an array
 */
exports.array = function (a) {
    return (Array.isArray(a)) ?
        exports.valid(a) :
        exports.fail('array', a);
};
/**
 * object tests if the value is an js object.
 */
exports.object = function (value) {
    return (typeof value === 'object' && (!Array.isArray(value))) ?
        exports.valid(value) :
        exports.fail('object', value);
};
/**
 * isin requires the value to be enumerated in the supplied list.
 */
exports.isin = function (list) { return function (value) {
    return (list.indexOf(value) < 0) ?
        exports.fail('isin', value, { enum: list }) :
        exports.valid(value);
}; };
exports.cast = function (f) {
    return function (a) { return exports.valid(f(a)); };
};
//# sourceMappingURL=Sync.js.map