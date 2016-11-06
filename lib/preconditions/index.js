'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.number = number;
exports.string = string;
exports.array = array;
exports.object = object;
exports.matches = matches;
exports.range = range;
exports.equals = equals;
exports.notNull = notNull;
exports.isin = isin;
exports.nullable = nullable;
exports.empty = empty;
exports.length = length;
exports.func = func;

var _PreconditionError = require('./PreconditionError');

var _PreconditionError2 = _interopRequireDefault(_PreconditionError);

var _Func = require('./Func');

var _Func2 = _interopRequireDefault(_Func);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * number tests if the value supplied is a number.
 * @returns {Predicate}
 */
function number() {

    return new _Func2.default(function number(value) {

        if (typeof value !== 'number') return new TypeError('number');

        return value;
    });
}

/**
 * string tests if the value is a string.
 * @returns {Predicate}
 */
function string() {

    return new _Func2.default(function string(value) {

        if (typeof value !== 'string') return new TypeError('string');

        return value;
    });
}

/**
 * array tests if the value is an array.
 * @returns {Predicate}
 */
function array() {

    return new _Func2.default(function array(value) {

        if (!Array.isArray(value)) return new TypeError('array');

        return value;
    });
}

/**
 * object tests if the value is a js object.
 * @returns {Predicate}
 */
function object() {

    return new _Func2.default(function object(value) {

        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') return new TypeError('object');

        if (Array.isArray(value)) return new TypeError('object');

        return value;
    });
}

/**
 * matches tests if the value satisfies a regular expression.
 * @param {RegExp} pattern
 * @returns {Predicate}
 */
function matches(pattern) {

    return new _Func2.default(function matches(value) {

        if (!pattern.test(value)) return new _PreconditionError2.default('matches', { pattern: pattern });

        return value;
    });
}

/**
 * range tests if a string, number or array falls within a range
 * @param {number} min
 * @param {number} max
 * @returns {Predicate}
 */
function range(min, max) {

    return new _Func2.default(function range(value) {

        var test = typeof value === 'number' ? value : value.length ? value.length : null;

        if (test === null) throw new RangeError('Can only check range on number, string or array! ' + ('Got "' + value + '"'));

        if (test < min) return new _PreconditionError2.default('range', { min: min, max: max });

        if (test > max) return new _PreconditionError2.default('range', { min: min, max: max });

        return value;
    });
}

/**
 * equals tests if the value is equal to the value specified (strictly).
 * @param {*} target
 */
function equals(target) {

    return new _Func2.default(function equals(value) {

        if (value !== target) return new _PreconditionError2.default('equals', { target: target });

        return value;
    });
}

/**
 * notNull requires a value to be specified
 * @returns {Predicate}
 */
function notNull() {

    return new _Func2.default(function notNull(value) {

        if (value == null) return new Error('notNull');

        return value;
    });
}

/**
 * isin requires the value to be enumerated in the supplied list.
 * @param {array} list
 * @returns {Predicate}
 */
function isin(list) {

    return new _Func2.default(function isin(value) {

        if (list.indexOf(value) < 0) return new _PreconditionError2.default('isin', { list: list });

        return value;
    });
}

/**
 * nullable tests whether the value is null or undefined.
 * @returns {Predicate}
 */
function nullable() {

    return new _Func2.default(function nullable(value) {

        if (value != null) return new Error('nullable');

        return value;
    });
}

/**
 * empty tests whether the value is empty; an empty string or array counts
 * as empty.
 */
function empty() {

    return new _Func2.default(function empty(value) {

        if (value.length === 0) return new Error('empty');

        return value;
    });
}

/**
 * length tests if the value is of a certain length.
 * @param {number} len
 */
function length(len) {

    return new _Func2.default(function length(value) {

        if (value.length !== len) return new _PreconditionError2.default('length', { len: len });

        return value;
    });
}

/**
 * func wraps a function in a Chainable so it can be used as a Predicate.
 * @param {function<null|Error>} cb
 */
function func(cb) {

    return new _Func2.default(cb);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVjb25kaXRpb25zL2luZGV4LmpzIl0sIm5hbWVzIjpbIm51bWJlciIsInN0cmluZyIsImFycmF5Iiwib2JqZWN0IiwibWF0Y2hlcyIsInJhbmdlIiwiZXF1YWxzIiwibm90TnVsbCIsImlzaW4iLCJudWxsYWJsZSIsImVtcHR5IiwibGVuZ3RoIiwiZnVuYyIsInZhbHVlIiwiVHlwZUVycm9yIiwiQXJyYXkiLCJpc0FycmF5IiwicGF0dGVybiIsInRlc3QiLCJtaW4iLCJtYXgiLCJSYW5nZUVycm9yIiwidGFyZ2V0IiwiRXJyb3IiLCJsaXN0IiwiaW5kZXhPZiIsImxlbiIsImNiIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQU9nQkEsTSxHQUFBQSxNO1FBaUJBQyxNLEdBQUFBLE07UUFpQkFDLEssR0FBQUEsSztRQWlCQUMsTSxHQUFBQSxNO1FBcUJBQyxPLEdBQUFBLE87UUFtQkFDLEssR0FBQUEsSztRQThCQUMsTSxHQUFBQSxNO1FBaUJBQyxPLEdBQUFBLE87UUFrQkFDLEksR0FBQUEsSTtRQWlCQUMsUSxHQUFBQSxRO1FBaUJBQyxLLEdBQUFBLEs7UUFpQkFDLE0sR0FBQUEsTTtRQWlCQUMsSSxHQUFBQSxJOztBQXZPaEI7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7QUFJTyxTQUFTWixNQUFULEdBQWtCOztBQUVyQixXQUFPLG1CQUFTLFNBQVNBLE1BQVQsQ0FBZ0JhLEtBQWhCLEVBQXVCOztBQUVuQyxZQUFJLE9BQU9BLEtBQVAsS0FBaUIsUUFBckIsRUFDSSxPQUFPLElBQUlDLFNBQUosQ0FBYyxRQUFkLENBQVA7O0FBRUosZUFBT0QsS0FBUDtBQUVILEtBUE0sQ0FBUDtBQVNIOztBQUVEOzs7O0FBSU8sU0FBU1osTUFBVCxHQUFrQjs7QUFFckIsV0FBTyxtQkFBUyxTQUFTQSxNQUFULENBQWdCWSxLQUFoQixFQUF1Qjs7QUFFbkMsWUFBSSxPQUFPQSxLQUFQLEtBQWlCLFFBQXJCLEVBQ0ksT0FBTyxJQUFJQyxTQUFKLENBQWMsUUFB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LEtBQVA7QUFFSyxLQVBNLENBQVA7QUFTSDs7QUFFRDs7OztBQUlPLFNBQVNKLFFBQVQsR0FBb0I7O0FBRXZCLFdBQU8sbUJBQVMsU0FBU0EsUUFBVCxDQUFrQkksS0FBbEIsRUFBeUI7O0FBRXJDLFlBQUlBLFNBQVMsSUFBYixFQUNJLE9BQU8sSUFBSVUsS0FBSixDQUFVLFVBQVYsQ0FBUDs7QUFFWixlQUFPVixLQUFQO0FBRUssS0FQTSxDQUFQO0FBU0g7O0FBRUQ7Ozs7QUFJTyxTQUFTSCxLQUFULEdBQWlCOztBQUVwQixXQUFPLG1CQUFTLFNBQVNBLEtBQVQsQ0FBZUcsS0FBZixFQUFzQjs7QUFFbEMsWUFBSUEsTUFBTUYsTUFBTixLQUFpQixDQUFyQixFQUNJLE9BQU8sSUFBSVksS0FBSixDQUFVLE9BQVYsQ0FBUDs7QUFFWixlQUFPVixLQUFQO0FBRUssS0FQTSxDQUFQO0FBU0g7O0FBRUQ7Ozs7QUFJTyxTQUFTRixNQUFULENBQWdCZSxHQUFoQixFQUFxQjs7QUFFeEIsV0FBTyxtQkFBUyxTQUFTZixNQUFULENBQWdCRSxLQUFoQixFQUF1Qjs7QUFFbkMsWUFBSUEsTUFBTUYsTUFBTixLQUFpQmUsR0FBckIsRUFDSSxPQUFPLGdDQUFzQixRQUF0QixFQUFnQyxFQUFFQSxRQUFGLEVBQWhDLENBQVA7O0FBRVosZUFBT2IsS0FBUDtBQUVLLEtBUE0sQ0FBUDtBQVNIOztBQUVEOzs7O0FBSU8sU0FBU0QsSUFBVCxDQUFjZSxFQUFkLEVBQWtCOztBQUVyQixXQUFPLG1CQUFTQSxFQUFULENBQVA7QUFFSCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcmVjb25kaXRpb25FcnJvciBmcm9tICcuL1ByZWNvbmRpdGlvbkVycm9yJztcbmltcG9ydCBGdW5jIGZyb20gJy4vRnVuYyc7XG5cbi8qKlxuICogbnVtYmVyIHRlc3RzIGlmIHRoZSB2YWx1ZSBzdXBwbGllZCBpcyBhIG51bWJlci5cbiAqIEByZXR1cm5zIHtQcmVkaWNhdGV9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBudW1iZXIoKSB7XG5cbiAgICByZXR1cm4gbmV3IEZ1bmMoZnVuY3Rpb24gbnVtYmVyKHZhbHVlKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpXG4gICAgICAgICAgICByZXR1cm4gbmV3IFR5cGVFcnJvcignbnVtYmVyJyk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgfSk7XG5cbn1cblxuLyoqXG4gKiBzdHJpbmcgdGVzdHMgaWYgdGhlIHZhbHVlIGlzIGEgc3RyaW5nLlxuICogQHJldHVybnMge1ByZWRpY2F0ZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZygpIHtcblxuICAgIHJldHVybiBuZXcgRnVuYyhmdW5jdGlvbiBzdHJpbmcodmFsdWUpIHtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJylcbiAgICAgICAgICAgIHJldHVybiBuZXcgVHlwZUVycm9yKCdzdHJpbmcnKTtcblxucmV0dXJuIHZhbHVlO1xuXG4gICAgfSk7XG5cbn1cblxuLyoqXG4gKiBhcnJheSB0ZXN0cyBpZiB0aGUgdmFsdWUgaXMgYW4gYXJyYXkuXG4gKiBAcmV0dXJucyB7UHJlZGljYXRlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXJyYXkoKSB7XG5cbiAgICByZXR1cm4gbmV3IEZ1bmMoZnVuY3Rpb24gYXJyYXkodmFsdWUpIHtcblxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ2FycmF5Jyk7XG5cbnJldHVybiB2YWx1ZTtcblxuICAgIH0pO1xuXG59XG5cbi8qKlxuICogb2JqZWN0IHRlc3RzIGlmIHRoZSB2YWx1ZSBpcyBhIGpzIG9iamVjdC5cbiAqIEByZXR1cm5zIHtQcmVkaWNhdGV9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvYmplY3QoKSB7XG5cbiAgICByZXR1cm4gbmV3IEZ1bmMoZnVuY3Rpb24gb2JqZWN0KHZhbHVlKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpXG4gICAgICAgICAgICByZXR1cm4gbmV3IFR5cGVFcnJvcignb2JqZWN0Jyk7XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ29iamVjdCcpO1xuXG5yZXR1cm4gdmFsdWU7XG5cbiAgICB9KTtcblxufVxuXG4vKipcbiAqIG1hdGNoZXMgdGVzdHMgaWYgdGhlIHZhbHVlIHNhdGlzZmllcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAqIEBwYXJhbSB7UmVnRXhwfSBwYXR0ZXJuXG4gKiBAcmV0dXJucyB7UHJlZGljYXRlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWF0Y2hlcyhwYXR0ZXJuKSB7XG5cbiAgICByZXR1cm4gbmV3IEZ1bmMoZnVuY3Rpb24gbWF0Y2hlcyh2YWx1ZSkge1xuXG4gICAgICAgIGlmICghcGF0dGVybi50ZXN0KHZhbHVlKSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJlY29uZGl0aW9uRXJyb3IoJ21hdGNoZXMnLCB7IHBhdHRlcm4gfSlcblxucmV0dXJuIHZhbHVlO1xuXG4gICAgfSk7XG5cbn1cblxuLyoqXG4gKiByYW5nZSB0ZXN0cyBpZiBhIHN0cmluZywgbnVtYmVyIG9yIGFycmF5IGZhbGxzIHdpdGhpbiBhIHJhbmdlXG4gKiBAcGFyYW0ge251bWJlcn0gbWluXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4XG4gKiBAcmV0dXJucyB7UHJlZGljYXRlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2UobWluLCBtYXgpIHtcblxuICAgIHJldHVybiBuZXcgRnVuYyhmdW5jdGlvbiByYW5nZSh2YWx1ZSkge1xuXG4gICAgICAgIHZhciB0ZXN0ID0gKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpID9cbiAgICAgICAgICAgIHZhbHVlIDpcbiAgICAgICAgICAgICh2YWx1ZS5sZW5ndGgpID9cbiAgICAgICAgICAgIHZhbHVlLmxlbmd0aCA6IG51bGw7XG5cbiAgICAgICAgaWYgKHRlc3QgPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgICAgICAgICBgQ2FuIG9ubHkgY2hlY2sgcmFuZ2Ugb24gbnVtYmVyLCBzdHJpbmcgb3IgYXJyYXkhIGAgK1xuICAgICAgICAgICAgICAgIGBHb3QgXCIke3ZhbHVlfVwiYCk7XG5cbiAgICAgICAgaWYgKHRlc3QgPCBtaW4pXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByZWNvbmRpdGlvbkVycm9yKCdyYW5nZScsIHsgbWluLCBtYXggfSk7XG5cbiAgICAgICAgaWYgKHRlc3QgPiBtYXgpXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByZWNvbmRpdGlvbkVycm9yKCdyYW5nZScsIHsgbWluLCBtYXggfSk7XG5cbnJldHVybiB2YWx1ZTtcblxuICAgIH0pO1xuXG59XG5cbi8qKlxuICogZXF1YWxzIHRlc3RzIGlmIHRoZSB2YWx1ZSBpcyBlcXVhbCB0byB0aGUgdmFsdWUgc3BlY2lmaWVkIChzdHJpY3RseSkuXG4gKiBAcGFyYW0geyp9IHRhcmdldFxuICovXG5leHBvcnQgZnVuY3Rpb24gZXF1YWxzKHRhcmdldCkge1xuXG4gICAgcmV0dXJuIG5ldyBGdW5jKGZ1bmN0aW9uIGVxdWFscyh2YWx1ZSkge1xuXG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdGFyZ2V0KVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcmVjb25kaXRpb25FcnJvcignZXF1YWxzJywgeyB0YXJnZXQgfSk7XG5cbnJldHVybiB2YWx1ZTtcblxuICAgIH0pO1xuXG59XG5cbi8qKlxuICogbm90TnVsbCByZXF1aXJlcyBhIHZhbHVlIHRvIGJlIHNwZWNpZmllZFxuICogQHJldHVybnMge1ByZWRpY2F0ZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vdE51bGwoKSB7XG5cbiAgICByZXR1cm4gbmV3IEZ1bmMoZnVuY3Rpb24gbm90TnVsbCh2YWx1ZSkge1xuXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignbm90TnVsbCcpO1xuXG5yZXR1cm4gdmFsdWU7XG5cbiAgICB9KTtcblxufVxuXG4vKipcbiAqIGlzaW4gcmVxdWlyZXMgdGhlIHZhbHVlIHRvIGJlIGVudW1lcmF0ZWQgaW4gdGhlIHN1cHBsaWVkIGxpc3QuXG4gKiBAcGFyYW0ge2FycmF5fSBsaXN0XG4gKiBAcmV0dXJucyB7UHJlZGljYXRlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNpbihsaXN0KSB7XG5cbiAgICByZXR1cm4gbmV3IEZ1bmMoZnVuY3Rpb24gaXNpbih2YWx1ZSkge1xuXG4gICAgICAgIGlmIChsaXN0LmluZGV4T2YodmFsdWUpIDwgMClcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJlY29uZGl0aW9uRXJyb3IoJ2lzaW4nLCB7IGxpc3QgfSk7XG5cbnJldHVybiB2YWx1ZTtcblxuICAgIH0pO1xuXG59XG5cbi8qKlxuICogbnVsbGFibGUgdGVzdHMgd2hldGhlciB0aGUgdmFsdWUgaXMgbnVsbCBvciB1bmRlZmluZWQuXG4gKiBAcmV0dXJucyB7UHJlZGljYXRlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbnVsbGFibGUoKSB7XG5cbiAgICByZXR1cm4gbmV3IEZ1bmMoZnVuY3Rpb24gbnVsbGFibGUodmFsdWUpIHtcblxuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ251bGxhYmxlJyk7XG5cbnJldHVybiB2YWx1ZTtcblxuICAgIH0pO1xuXG59XG5cbi8qKlxuICogZW1wdHkgdGVzdHMgd2hldGhlciB0aGUgdmFsdWUgaXMgZW1wdHk7IGFuIGVtcHR5IHN0cmluZyBvciBhcnJheSBjb3VudHNcbiAqIGFzIGVtcHR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW1wdHkoKSB7XG5cbiAgICByZXR1cm4gbmV3IEZ1bmMoZnVuY3Rpb24gZW1wdHkodmFsdWUpIHtcblxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignZW1wdHknKTtcblxucmV0dXJuIHZhbHVlO1xuXG4gICAgfSk7XG5cbn1cblxuLyoqXG4gKiBsZW5ndGggdGVzdHMgaWYgdGhlIHZhbHVlIGlzIG9mIGEgY2VydGFpbiBsZW5ndGguXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsZW5ndGgobGVuKSB7XG5cbiAgICByZXR1cm4gbmV3IEZ1bmMoZnVuY3Rpb24gbGVuZ3RoKHZhbHVlKSB7XG5cbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCAhPT0gbGVuKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcmVjb25kaXRpb25FcnJvcignbGVuZ3RoJywgeyBsZW4gfSk7XG5cbnJldHVybiB2YWx1ZTtcblxuICAgIH0pO1xuXG59XG5cbi8qKlxuICogZnVuYyB3cmFwcyBhIGZ1bmN0aW9uIGluIGEgQ2hhaW5hYmxlIHNvIGl0IGNhbiBiZSB1c2VkIGFzIGEgUHJlZGljYXRlLlxuICogQHBhcmFtIHtmdW5jdGlvbjxudWxsfEVycm9yPn0gY2JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZ1bmMoY2IpIHtcblxuICAgIHJldHVybiBuZXcgRnVuYyhjYik7XG5cbn1cbiJdfQ==