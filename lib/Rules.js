'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var INVALID_MSG = 'Invalid value supplied for \'{key}\'!';
var REQUIRED_MSG = 'This field is required!';
var MAX_MSG = 'This field takes a maximum of {max} characters!';
var MIN_MSG = 'This field takes a minimum of {min} characters!';
var ONE_OF_MSG = 'This field must be one of \'{enum}\!';

/**
 * Rules provides convenience methods for
 * creating some of the builting Criterion.
 */

var Rules = function () {
    function Rules() {
        _classCallCheck(this, Rules);
    }

    _createClass(Rules, [{
        key: 'getMessage',


        /**
         * getMessage provides a template message string based on values
         * passed
         * @param {string} template 
         * @param {object} context 
         * @returns {string}
         */
        value: function getMessage(template, context) {
            return template.replace(/\{([\w\$\.\-]*)}/g, function (s, k) {
                return context[k];
            });
        }

        /**
         * cast supplies a Cast rule.
         * @param {function} type 
         * @returns {callback}
         */

    }, {
        key: 'cast',
        value: function cast(type) {

            return function (key, value, next) {
                return next(null, key, type(value));
            };
        }

        /**
         * Ensures the value satisfies the type
         * @param {string} type 
         * @param {string} emsg 
         */

    }, {
        key: 'typeOf',
        value: function typeOf(type, emsg) {
            var _this = this;

            return function (key, value, next) {
                return (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === type ? n(null, key, value) : next(new Error(_this.getMessage((emsg || TYPE_OF_MSG, {
                    key: key,
                    value: value
                }))), key, value);
            };
        }

        /**
         * match supplies a Match rule.
         * @param {RegExp} reg 
         * @param {string} emsg 
         */

    }, {
        key: 'match',
        value: function match(reg, emsg) {
            var _this2 = this;

            return function (key, value, next) {
                return reg.test(value) ? next(null, key, value) : next(new Error(_this2.getMessage(emsg || INVALID_MSG, {
                    key: key,
                    value: value
                })), key, value);
            };
        }

        /**
         * trim the value
         * @returns {callback}
         */

    }, {
        key: 'trim',
        value: function trim() {

            return function (key, value, next) {
                return next(null, key, typeof value === 'string' ? value.trim() : value);
            };
        }

        /**
         * range supplies a Range rule
         * @param {number} min
         * @param {number} max 
         * @param {string} minMsg
         * @param {string} maxMsg 
         * @returns {callback}
         */

    }, {
        key: 'range',
        value: function range(min, max, minMsg, maxMsg) {
            var _this3 = this;

            return function (key, value, next) {

                var test = typeof value === 'number' ? value : value.length ? value.length : null;

                if (test === null) return next(new Error(_this3.getMessage(INVALID_MSG, {
                    key: key,
                    value: value,
                    max: max,
                    min: min
                })), key, value);

                if (test < min) return next(new Error(_this3.getMessage(minMsg || MIN_MSG, {
                    key: key,
                    value: value,
                    max: max,
                    min: min
                })), key, value);

                if (test > max) return next(new Error(_this3.getMessage(maxMsg || MAX_MSG, {
                    key: key,
                    value: value,
                    max: max,
                    min: min
                })), key, value);

                next(null, key, value);
            };
        }

        /**
         * required checks that something was suppled for the value
         * @param {string} emsg 
         * @returns {callback}
         */

    }, {
        key: 'required',
        value: function required(emsg) {
            var _this4 = this;

            return function (key, value, next) {
                return [undefined, null, ''].indexOf(value) > -1 ? next(new Error(_this4.getMessage(emsg || REQUIRED_MSG, {
                    key: key,
                    value: value
                })), key, value) : next(null, key, value);
            };
        }

        /**
         * enum supplies a OneOf rule
         * @param {array} list 
         * @param {string} emsg 
         * @returns {callback} 
         */

    }, {
        key: 'oneOf',
        value: function oneOf(list, emsg) {
            var _this5 = this;

            return function (key, value, next) {
                return list.indexOf(value) < -1 ? next(new Error(_this5.getMessage(emsg || ONE_OF_MSG, {
                    key: key,
                    value: value,
                    enum: list.join(',')
                })), key, value) : next(null, key, value);
            };
        }

        /**
         * optional will not continue the chain if the value is not set
         */

    }, {
        key: 'optional',
        value: function optional(key, value, next) {

            if (!value) return next(null, null, null);

            next(null, key, value);
        }

        /**
         * nullable will not continue the chain if the value is not set
         */

    }, {
        key: 'nullable',
        value: function nullable(rule) {
            var _this6 = this;

            return function (key, value, next) {

                if (!value) return next(null, null, null);

                rule.call(_this6, key, value, next);
            };
        }

        /**
         * default provides a default value if the key is not set.
         * @param {*} value
         * @returns {callback}
         */

    }, {
        key: 'default',
        value: function _default(value) {

            return function (key, val, next) {

                if (val === null || val === undefined) next(null, key, value);

                next(null, key, val);
            };
        }

        /**
         * and performs a logical and between two callbacks.
         * @param {callback} left 
         * @param {callback} right 
         */

    }, {
        key: 'and',
        value: function and(left, right) {
            var _this7 = this;

            var list = [];

            return function (key, value, next) {

                left.call(_this7, key, value, function (err, key1, value1) {

                    if (err !== null) {
                        next(err, key, value);
                    } else {
                        right.call(_this7, key1, value1, next);
                    }
                });
            };
        }

        /**
         * or performs a logical or between two callbacks
         * @param {callback} left 
         * @param {callback} right 
         */

    }, {
        key: 'or',
        value: function or(left, right) {
            var _this8 = this;

            return function (key, value, next) {

                left.call(_this8, key, value, function (err, key1, value1) {

                    if (err !== null) {

                        right.call(_this8, key, value, next);
                    } else {

                        next(null, key1, value1);
                    }
                });
            };
        }
    }]);

    return Rules;
}();

exports.default = new Rules();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SdWxlcy5qcyJdLCJuYW1lcyI6WyJJTlZBTElEX01TRyIsIlJFUVVJUkVEX01TRyIsIk1BWF9NU0ciLCJNSU5fTVNHIiwiT05FX09GX01TRyIsIlJ1bGVzIiwidGVtcGxhdGUiLCJjb250ZXh0IiwicmVwbGFjZSIsInMiLCJrIiwidHlwZSIsImtleSIsInZhbHVlIiwibmV4dCIsImVtc2ciLCJ2IiwibiIsIkVycm9yIiwiZ2V0TWVzc2FnZSIsIlRZUEVfT0ZfTVNHIiwicmVnIiwidGVzdCIsInRyaW0iLCJtaW4iLCJtYXgiLCJtaW5Nc2ciLCJtYXhNc2ciLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJpbmRleE9mIiwibGlzdCIsImVudW0iLCJqb2luIiwicnVsZSIsImNhbGwiLCJ2YWwiLCJsZWZ0IiwicmlnaHQiLCJlcnIiLCJrZXkxIiwidmFsdWUxIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxjQUFjLHVDQUFwQjtBQUNBLElBQU1DLGVBQWUseUJBQXJCO0FBQ0EsSUFBTUMsVUFBVSxpREFBaEI7QUFDQSxJQUFNQyxVQUFVLGlEQUFoQjtBQUNBLElBQU1DLGFBQWEsc0NBQW5COztBQUVBOzs7OztJQUlNQyxLOzs7Ozs7Ozs7QUFFRjs7Ozs7OzttQ0FPV0MsUSxFQUFVQyxPLEVBQVM7QUFDMUIsbUJBQU9ELFNBQVNFLE9BQVQsQ0FBaUIsbUJBQWpCLEVBQXNDLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLHVCQUFVSCxRQUFRRyxDQUFSLENBQVY7QUFBQSxhQUF0QyxDQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7OzZCQUtLQyxJLEVBQU07O0FBRVAsbUJBQU8sVUFBQ0MsR0FBRCxFQUFNQyxLQUFOLEVBQWFDLElBQWI7QUFBQSx1QkFBc0JBLEtBQUssSUFBTCxFQUFXRixHQUFYLEVBQWdCRCxLQUFLRSxLQUFMLENBQWhCLENBQXRCO0FBQUEsYUFBUDtBQUVIOztBQUVEOzs7Ozs7OzsrQkFLT0YsSSxFQUFNSSxJLEVBQU07QUFB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LElBQU4sU0FBaUJ2QixHQUFqQixFQUFzQkMsS0FBdEIsRUFBNkJDLElBQTdCO0FBRUgscUJBSkQsTUFJTzs7QUFFSEEsNkJBQUssSUFBTCxFQUFXMEIsSUFBWCxFQUFpQkMsTUFBakI7QUFFSDtBQUVKLGlCQVpEO0FBY0gsYUFoQkQ7QUFpQkg7Ozs7OztrQkFLVSxJQUFJcEMsS0FBSixFIiwiZmlsZSI6IlJ1bGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgSU5WQUxJRF9NU0cgPSAnSW52YWxpZCB2YWx1ZSBzdXBwbGllZCBmb3IgXFwne2tleX1cXCchJztcbmNvbnN0IFJFUVVJUkVEX01TRyA9ICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkISc7XG5jb25zdCBNQVhfTVNHID0gJ1RoaXMgZmllbGQgdGFrZXMgYSBtYXhpbXVtIG9mIHttYXh9IGNoYXJhY3RlcnMhJztcbmNvbnN0IE1JTl9NU0cgPSAnVGhpcyBmaWVsZCB0YWtlcyBhIG1pbmltdW0gb2Yge21pbn0gY2hhcmFjdGVycyEnO1xuY29uc3QgT05FX09GX01TRyA9ICdUaGlzIGZpZWxkIG11c3QgYmUgb25lIG9mIFxcJ3tlbnVtfVxcISc7XG5cbi8qKlxuICogUnVsZXMgcHJvdmlkZXMgY29udmVuaWVuY2UgbWV0aG9kcyBmb3JcbiAqIGNyZWF0aW5nIHNvbWUgb2YgdGhlIGJ1aWx0aW5nIENyaXRlcmlvbi5cbiAqL1xuY2xhc3MgUnVsZXMge1xuXG4gICAgLyoqXG4gICAgICogZ2V0TWVzc2FnZSBwcm92aWRlcyBhIHRlbXBsYXRlIG1lc3NhZ2Ugc3RyaW5nIGJhc2VkIG9uIHZhbHVlc1xuICAgICAqIHBhc3NlZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZSBcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gY29udGV4dCBcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldE1lc3NhZ2UodGVtcGxhdGUsIGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoL1xceyhbXFx3XFwkXFwuXFwtXSopfS9nLCAocywgaykgPT4gY29udGV4dFtrXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2FzdCBzdXBwbGllcyBhIENhc3QgcnVsZS5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSB0eXBlIFxuICAgICAqIEByZXR1cm5zIHtjYWxsYmFja31cbiAgICAgKi9cbiAgICBjYXN0KHR5cGUpIHtcblxuICAgICAgICByZXR1cm4gKGtleSwgdmFsdWUsIG5leHQpID0+IG5leHQobnVsbCwga2V5LCB0eXBlKHZhbHVlKSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFbnN1cmVzIHRoZSB2YWx1ZSBzYXRpc2ZpZXMgdGhlIHR5cGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZW1zZyBcbiAgICAgKi9cbiAgICB0eXBlT2YodHlwZSwgZW1zZykge1xuXG4gICAgICAgIHJldHVybiAoa2V5LCB2YWx1ZSwgbmV4dCkgPT4gKHR5cGVvZiB2ID09PSB0eXBlKSA/IG4obnVsbCwga2V5LCB2YWx1ZSkgOlxuICAgICAgICAgICAgbmV4dChuZXcgRXJyb3IodGhpcy5nZXRNZXNzYWdlKChlbXNnIHx8IFRZUEVfT0ZfTVNHLCB7XG4gICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICAgICB9KSkpLCBrZXksIHZhbHVlKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG1hdGNoIHN1cHBsaWVzIGEgTWF0Y2ggcnVsZS5cbiAgICAgKiBAcGFyYW0ge1JlZ0V4cH0gcmVnIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbXNnIFxuICAgICAqL1xuICAgIG1hdGNoKHJlZywgZW1zZykge1xuXG4gICAgICAgIHJldHVybiAoa2V5LCB2YWx1ZSwgbmV4dCkgPT4gKHJlZy50ZXN0KHZhbHVlKSkgPyBuZXh0KG51bGwsIGtleSwgdmFsdWUpIDpcbiAgICAgICAgICAgIG5leHQobmV3IEVycm9yKHRoaXMuZ2V0TWVzc2FnZShlbXNnIHx8IElOVkFMSURfTVNHLCB7XG4gICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICAgICB9KSksIGtleSwgdmFsdWUpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdHJpbSB0aGUgdmFsdWVcbiAgICAgKiBAcmV0dXJucyB7Y2FsbGJhY2t9XG4gICAgICovXG4gICAgdHJpbSgpIHtcblxuICAgICAgICByZXR1cm4gKGtleSwgdmFsdWUsIG5leHQpID0+IG5leHQobnVsbCwga2V5LFxuICAgICAgICAgICAgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpID9cbiAgICAgICAgICAgIHZhbHVlLnRyaW0oKSA6IHZhbHVlKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIHJhbmdlIHN1cHBsaWVzIGEgUmFuZ2UgcnVsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtaW5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4IFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtaW5Nc2dcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4TXNnIFxuICAgICAqIEByZXR1cm5zIHtjYWxsYmFja31cbiAgICAgKi9cbiAgICByYW5nZShtaW4sIG1heCwgbWluTXNnLCBtYXhNc2cpIHtcblxuICAgICAgICByZXR1cm4gKGtleSwgdmFsdWUsIG5leHQpID0+IHtcblxuICAgICAgICAgICAgdmFyIHRlc3QgPSAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgP1xuICAgICAgICAgICAgICAgIHZhbHVlIDpcbiAgICAgICAgICAgICAgICAodmFsdWUubGVuZ3RoKSA/XG4gICAgICAgICAgICAgICAgdmFsdWUubGVuZ3RoIDogbnVsbDtcblxuICAgICAgICAgICAgaWYgKHRlc3QgPT09IG51bGwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9yKHRoaXMuZ2V0TWVzc2FnZShJTlZBTElEX01TRywge1xuICAgICAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBtYXgsXG4gICAgICAgICAgICAgICAgICAgIG1pblxuICAgICAgICAgICAgICAgIH0pKSwga2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICh0ZXN0IDwgbWluKVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRNZXNzYWdlKG1pbk1zZyB8fCBNSU5fTVNHLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pblxuICAgICAgICAgICAgICAgICAgICB9KSksIGtleSwgdmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAodGVzdCA+IG1heClcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3IodGhpcy5nZXRNZXNzYWdlKG1heE1zZyB8fCBNQVhfTVNHLCB7XG4gICAgICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIG1heCxcbiAgICAgICAgICAgICAgICAgICAgbWluXG4gICAgICAgICAgICAgICAgfSkpLCBrZXksIHZhbHVlKTtcblxuICAgICAgICAgICAgbmV4dChudWxsLCBrZXksIHZhbHVlKTtcblxuICAgICAgICB9O1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVxdWlyZWQgY2hlY2tzIHRoYXQgc29tZXRoaW5nIHdhcyBzdXBwbGVkIGZvciB0aGUgdmFsdWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZW1zZyBcbiAgICAgKiBAcmV0dXJucyB7Y2FsbGJhY2t9XG4gICAgICovXG4gICAgcmVxdWlyZWQoZW1zZykge1xuXG4gICAgICAgIHJldHVybiAoa2V5LCB2YWx1ZSwgbmV4dCkgPT5cbiAgICAgICAgICAgIChbdW5kZWZpbmVkLCBudWxsLCAnJ10uaW5kZXhPZih2YWx1ZSkgPiAtMSkgP1xuICAgICAgICAgICAgbmV4dChuZXcgRXJyb3IodGhpcy5nZXRNZXNzYWdlKGVtc2cgfHwgUkVRVUlSRURfTVNHLCB7XG4gICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICAgICB9KSksIGtleSwgdmFsdWUpIDpcbiAgICAgICAgICAgIG5leHQobnVsbCwga2V5LCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZW51bSBzdXBwbGllcyBhIE9uZU9mIHJ1bGVcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBsaXN0IFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbXNnIFxuICAgICAqIEByZXR1cm5zIHtjYWxsYmFja30gXG4gICAgICovXG4gICAgb25lT2YobGlzdCwgZW1zZykge1xuXG4gICAgICAgIHJldHVybiAoa2V5LCB2YWx1ZSwgbmV4dCkgPT4gKGxpc3QuaW5kZXhPZih2YWx1ZSkgPCAtMSkgP1xuICAgICAgICAgICAgbmV4dChuZXcgRXJyb3IodGhpcy5nZXRNZXNzYWdlKGVtc2cgfHwgT05FX09GX01TRywge1xuICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICBlbnVtOiBsaXN0LmpvaW4oJywnKVxuICAgICAgICAgICAgfSkpLCBrZXksIHZhbHVlKSA6XG4gICAgICAgICAgICBuZXh0KG51bGwsIGtleSwgdmFsdWUpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb3B0aW9uYWwgd2lsbCBub3QgY29udGludWUgdGhlIGNoYWluIGlmIHRoZSB2YWx1ZSBpcyBub3Qgc2V0XG4gICAgICovXG4gICAgb3B0aW9uYWwoa2V5LCB2YWx1ZSwgbmV4dCkge1xuXG4gICAgICAgIGlmICghdmFsdWUpXG4gICAgICAgICAgICByZXR1cm4gbmV4dChudWxsLCBudWxsLCBudWxsKTtcblxuICAgICAgICBuZXh0KG51bGwsIGtleSwgdmFsdWUpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogbnVsbGFibGUgd2lsbCBub3QgY29udGludWUgdGhlIGNoYWluIGlmIHRoZSB2YWx1ZSBpcyBub3Qgc2V0XG4gICAgICovXG4gICAgbnVsbGFibGUocnVsZSkge1xuXG4gICAgICAgIHJldHVybiAoa2V5LCB2YWx1ZSwgbmV4dCkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIXZhbHVlKVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KG51bGwsIG51bGwsIG51bGwpO1xuXG4gICAgICAgICAgICBydWxlLmNhbGwodGhpcywga2V5LCB2YWx1ZSwgbmV4dCk7XG5cbiAgICAgICAgfTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGRlZmF1bHQgcHJvdmlkZXMgYSBkZWZhdWx0IHZhbHVlIGlmIHRoZSBrZXkgaXMgbm90IHNldC5cbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAgICogQHJldHVybnMge2NhbGxiYWNrfVxuICAgICAqL1xuICAgIGRlZmF1bHQgKHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGtleSwgdmFsLCBuZXh0KSB7XG5cbiAgICAgICAgICAgIGlmICgodmFsID09PSBudWxsKSB8fCAodmFsID09PSB1bmRlZmluZWQpKVxuICAgICAgICAgICAgICAgIG5leHQobnVsbCwga2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgICAgIG5leHQobnVsbCwga2V5LCB2YWwpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFuZCBwZXJmb3JtcyBhIGxvZ2ljYWwgYW5kIGJldHdlZW4gdHdvIGNhbGxiYWNrcy5cbiAgICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBsZWZ0IFxuICAgICAqIEBwYXJhbSB7Y2FsbGJhY2t9IHJpZ2h0IFxuICAgICAqL1xuICAgIGFuZChsZWZ0LCByaWdodCkge1xuXG4gICAgICAgIHZhciBsaXN0ID0gW107XG5cbiAgICAgICAgcmV0dXJuIChrZXksIHZhbHVlLCBuZXh0KSA9PiB7XG5cbiAgICAgICAgICAgIGxlZnQuY2FsbCh0aGlzLCBrZXksIHZhbHVlLCAoZXJyLCBrZXkxLCB2YWx1ZTEpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChlcnIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dChlcnIsIGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0LmNhbGwodGhpcywga2V5MSwgdmFsdWUxLCBuZXh0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvciBwZXJmb3JtcyBhIGxvZ2ljYWwgb3IgYmV0d2VlbiB0d28gY2FsbGJhY2tzXG4gICAgICogQHBhcmFtIHtjYWxsYmFja30gbGVmdCBcbiAgICAgKiBAcGFyYW0ge2NhbGxiYWNrfSByaWdodCBcbiAgICAgKi9cbiAgICBvcihsZWZ0LCByaWdodCkge1xuXG4gICAgICAgIHJldHVybiAoa2V5LCB2YWx1ZSwgbmV4dCkgPT4ge1xuXG4gICAgICAgICAgICBsZWZ0LmNhbGwodGhpcywga2V5LCB2YWx1ZSwgKGVyciwga2V5MSwgdmFsdWUxKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyICE9PSBudWxsKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmlnaHQuY2FsbCh0aGlzLCBrZXksIHZhbHVlLCBuZXh0KTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbmV4dChudWxsLCBrZXkxLCB2YWx1ZTEpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgfVxuXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFJ1bGVzKClcbiJdfQ==