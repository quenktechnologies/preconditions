'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var INVALID_MSG = 'Invalid value supplied for \'{key}\'!';
var REQUIRED_MSG = 'This field is required!';
var MAX_MSG = 'This field takes a maximum of {max} characters!';
var MIN_MSG = 'This field takes a minimum of {min} characters!';
var ONE_OF_MSG = 'This field must be one of \'{enum}\!';

/**
 * Rules provides convenience methods for
 * creating some of the builting Criterion.
 */

var Rules = (function () {
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
                return typeof v === type ? n(null, key, value) : next(new Error(_this.getMessage((emsg || TYPE_OF_MSG, {
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
         */
    }, {
        key: 'oneOf',
        value: function oneOf(list, emsg) {
            var _this5 = this;

            return function (key, value, next) {
                return list.indexOf(value) < -1 ? next(new Error(_this5.getMessage(emsg || ONE_OF_MSG, {
                    key: key,
                    value: value,
                    'enum': list.join(',')
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
         * all runs all of the 
         */
    }, {
        key: 'all',
        value: function all() {

            var q = list.slice();
            var target;

            var next = function next(_x, _x2, _x3) {
                var _arguments = arguments;
                var _again = true;

                _function: while (_again) {
                    var err = _x,
                        key = _x2,
                        value = _x3;
                    _again = false;

                    if (err !== null) return done(err, key, value);

                    if (q.length === 0) return done(null, key, value);

                    if (key === null) return done(null, null, null);

                    target = q.shift();

                    if (typeof target === 'function') return target(key, value, next);

                    if (typeof target === 'object') if (target !== null) if (Array.isArray(target)) {
                        _x = null;
                        _x2 = key;
                        _x3 = target;
                        _again = true;
                        continue _function;
                    } else {
                        return target.apply(key, value, next);
                    }

                    next(null, key, target);
                }
            };

            next(null, key, value);
        }
    }]);

    return Rules;
})();

exports['default'] = Rules;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SdWxlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBTSxXQUFXLEdBQUcsdUNBQXVDLENBQUM7QUFDNUQsSUFBTSxZQUFZLEdBQUcseUJBQXlCLENBQUM7QUFDL0MsSUFBTSxPQUFPLEdBQUcsaURBQWlELENBQUM7QUFDbEUsSUFBTSxPQUFPLEdBQUcsaURBQWlELENBQUM7QUFDbEUsSUFBTSxVQUFVLEdBQUcsc0NBQXNDLENBQUM7Ozs7Ozs7SUFNcEQsS0FBSzthQUFMLEtBQUs7OEJBQUwsS0FBSzs7O2lCQUFMLEtBQUs7Ozs7Ozs7Ozs7ZUFTRyxvQkFBQyxRQUFRLEVBQUUsT0FBTyxFQUFFO0FBQzFCLG1CQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQzt1QkFBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQUEsQ0FBQyxDQUFDO1NBQ3RFOzs7Ozs7Ozs7ZUFPRyxjQUFDLElBQUksRUFBRTs7QUFFUCxtQkFBTyxVQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSTt1QkFBSyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFBQSxDQUFDO1NBRTdEOzs7Ozs7Ozs7ZUFPSyxnQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFOzs7QUFFZixtQkFBTyxVQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSTt1QkFBSyxBQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksR0FBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FDbEUsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLE1BQUssVUFBVSxFQUFFLElBQUksSUFBSSxXQUFXLEVBQUU7QUFDakQsdUJBQUcsRUFBSCxHQUFHO0FBQ0gseUJBQUssRUFBTCxLQUFLO2lCQUNSLENBQUEsQ0FBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQzthQUFBLENBQUM7U0FFekI7Ozs7Ozs7OztlQU9JLGVBQUMsR0FBRyxFQUFFLElBQUksRUFBRTs7O0FBRWIsbUJBQU8sVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUk7dUJBQUssQUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUNuRSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBSyxVQUFVLENBQUMsSUFBSSxJQUFJLFdBQVcsRUFBRTtBQUNoRCx1QkFBRyxFQUFILEdBQUc7QUFDSCx5QkFBSyxFQUFMLEtBQUs7aUJBQ1IsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQzthQUFBLENBQUM7U0FFeEI7Ozs7Ozs7O2VBTUcsZ0JBQUc7O0FBRUgsbUJBQU8sVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUk7dUJBQUssSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQ3ZDLEFBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxHQUMxQixLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDO2FBQUEsQ0FBQztTQUM3Qjs7Ozs7Ozs7Ozs7O2VBV0ksZUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7OztBQUU1QixtQkFBTyxVQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFLOztBQUV6QixvQkFBSSxJQUFJLEdBQUcsQUFBQyxPQUFPLEtBQUssS0FBSyxRQUFRLEdBQ2pDLEtBQUssR0FDTCxBQUFDLEtBQUssQ0FBQyxNQUFNLEdBQ2IsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7O0FBRXhCLG9CQUFJLElBQUksS0FBSyxJQUFJLEVBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBSyxVQUFVLENBQUMsV0FBVyxFQUFFO0FBQy9DLHVCQUFHLEVBQUgsR0FBRztBQUNILHlCQUFLLEVBQUwsS0FBSztBQUNMLHVCQUFHLEVBQUgsR0FBRztBQUNILHVCQUFHLEVBQUgsR0FBRztpQkFDTixDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRXJCLG9CQUFJLElBQUksR0FBRyxHQUFHLEVBQ1YsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQ2pCLE9BQUssVUFBVSxDQUFDLE1BQU0sSUFBSSxPQUFPLEVBQUU7QUFDL0IsdUJBQUcsRUFBSCxHQUFHO0FBQ0gseUJBQUssRUFBTCxLQUFLO0FBQ0wsdUJBQUcsRUFBSCxHQUFHO0FBQ0gsdUJBQUcsRUFBSCxHQUFHO2lCQUNOLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFekIsb0JBQUksSUFBSSxHQUFHLEdBQUcsRUFDVixPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFLLFVBQVUsQ0FBQyxNQUFNLElBQUksT0FBTyxFQUFFO0FBQ3JELHVCQUFHLEVBQUgsR0FBRztBQUNILHlCQUFLLEVBQUwsS0FBSztBQUNMLHVCQUFHLEVBQUgsR0FBRztBQUNILHVCQUFHLEVBQUgsR0FBRztpQkFDTixDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRXJCLG9CQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUUxQixDQUFDO1NBRUw7Ozs7Ozs7OztlQU9PLGtCQUFDLElBQUksRUFBRTs7O0FBRVgsbUJBQU8sVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUk7dUJBQ3BCLEFBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FDMUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQUssVUFBVSxDQUFDLElBQUksSUFBSSxZQUFZLEVBQUU7QUFDakQsdUJBQUcsRUFBSCxHQUFHO0FBQ0gseUJBQUssRUFBTCxLQUFLO2lCQUNSLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FDaEIsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDO2FBQUEsQ0FBQztTQUM5Qjs7Ozs7Ozs7O2VBT0ksZUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFOzs7QUFFZCxtQkFBTyxVQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSTt1QkFBSyxBQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQ2xELElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFLLFVBQVUsQ0FBQyxJQUFJLElBQUksVUFBVSxFQUFFO0FBQy9DLHVCQUFHLEVBQUgsR0FBRztBQUNILHlCQUFLLEVBQUwsS0FBSztBQUNMLDRCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUN2QixDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQ2hCLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQzthQUFBLENBQUM7U0FFOUI7Ozs7Ozs7ZUFLTyxrQkFBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTs7QUFFdkIsZ0JBQUksQ0FBQyxLQUFLLEVBQ04sT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFbEMsZ0JBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBRzFCOzs7Ozs7O2VBS0YsZUFBRzs7QUFFRSxnQkFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3JCLGdCQUFJLE1BQU0sQ0FBQzs7QUFFWCxnQkFBSSxJQUFJLEdBQUcsU0FBUCxJQUFJOzs7OzBDQUE2Qjt3QkFBakIsR0FBRzt3QkFBRSxHQUFHO3dCQUFFLEtBQUs7OztBQUUvQix3QkFBSSxHQUFHLEtBQUssSUFBSSxFQUNaLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRWpDLHdCQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUNkLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRWxDLHdCQUFHLEdBQUcsS0FBSyxJQUFJLEVBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsMEJBQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRW5CLHdCQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsRUFDNUIsT0FBTyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFcEMsd0JBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUMxQixJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQ2YsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFOzZCQUNYLElBQUk7OEJBQUUsR0FBRzs4QkFBRSxNQUFNOzs7cUJBQ2hDLE1BQU07QUFDSCwrQkFBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQ3pDOztBQUVULHdCQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztpQkFFM0I7YUFBQSxDQUFDOztBQUVGLGdCQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUUxQjs7O1dBdE1DLEtBQUs7OztxQkEyTUksS0FBSyIsImZpbGUiOiJSdWxlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IElOVkFMSURfTVNHID0gJ0ludmFsaWQgdmFsdWUgc3VwcGxpZWQgZm9yIFxcJ3trZXl9XFwnISc7XG5jb25zdCBSRVFVSVJFRF9NU0cgPSAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZCEnO1xuY29uc3QgTUFYX01TRyA9ICdUaGlzIGZpZWxkIHRha2VzIGEgbWF4aW11bSBvZiB7bWF4fSBjaGFyYWN0ZXJzISc7XG5jb25zdCBNSU5fTVNHID0gJ1RoaXMgZmllbGQgdGFrZXMgYSBtaW5pbXVtIG9mIHttaW59IGNoYXJhY3RlcnMhJztcbmNvbnN0IE9ORV9PRl9NU0cgPSAnVGhpcyBmaWVsZCBtdXN0IGJlIG9uZSBvZiBcXCd7ZW51bX1cXCEnO1xuXG4vKipcbiAqIFJ1bGVzIHByb3ZpZGVzIGNvbnZlbmllbmNlIG1ldGhvZHMgZm9yXG4gKiBjcmVhdGluZyBzb21lIG9mIHRoZSBidWlsdGluZyBDcml0ZXJpb24uXG4gKi9cbmNsYXNzIFJ1bGVzIHtcblxuICAgIC8qKlxuICAgICAqIGdldE1lc3NhZ2UgcHJvdmlkZXMgYSB0ZW1wbGF0ZSBtZXNzYWdlIHN0cmluZyBiYXNlZCBvbiB2YWx1ZXNcbiAgICAgKiBwYXNzZWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGVtcGxhdGUgXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHQgXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRNZXNzYWdlKHRlbXBsYXRlLCBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZS5yZXBsYWNlKC9cXHsoW1xcd1xcJFxcLlxcLV0qKX0vZywgKHMsIGspID0+IGNvbnRleHRba10pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNhc3Qgc3VwcGxpZXMgYSBDYXN0IHJ1bGUuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gdHlwZSBcbiAgICAgKiBAcmV0dXJucyB7Y2FsbGJhY2t9XG4gICAgICovXG4gICAgY2FzdCh0eXBlKSB7XG5cbiAgICAgICAgcmV0dXJuIChrZXksIHZhbHVlLCBuZXh0KSA9PiBuZXh0KG51bGwsIGtleSwgdHlwZSh2YWx1ZSkpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW5zdXJlcyB0aGUgdmFsdWUgc2F0aXNmaWVzIHRoZSB0eXBlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVtc2cgXG4gICAgICovXG4gICAgdHlwZU9mKHR5cGUsIGVtc2cpIHtcblxuICAgICAgICByZXR1cm4gKGtleSwgdmFsdWUsIG5leHQpID0+ICh0eXBlb2YgdiA9PT0gdHlwZSkgPyBuKG51bGwsIGtleSwgdmFsdWUpIDpcbiAgICAgICAgICAgIG5leHQobmV3IEVycm9yKHRoaXMuZ2V0TWVzc2FnZSgoZW1zZyB8fCBUWVBFX09GX01TRywge1xuICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgfSkpKSwga2V5LCB2YWx1ZSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBtYXRjaCBzdXBwbGllcyBhIE1hdGNoIHJ1bGUuXG4gICAgICogQHBhcmFtIHtSZWdFeHB9IHJlZyBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZW1zZyBcbiAgICAgKi9cbiAgICBtYXRjaChyZWcsIGVtc2cpIHtcblxuICAgICAgICByZXR1cm4gKGtleSwgdmFsdWUsIG5leHQpID0+IChyZWcudGVzdCh2YWx1ZSkpID8gbmV4dChudWxsLCBrZXksIHZhbHVlKSA6XG4gICAgICAgICAgICBuZXh0KG5ldyBFcnJvcih0aGlzLmdldE1lc3NhZ2UoZW1zZyB8fCBJTlZBTElEX01TRywge1xuICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgfSkpLCBrZXksIHZhbHVlKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRyaW0gdGhlIHZhbHVlXG4gICAgICogQHJldHVybnMge2NhbGxiYWNrfVxuICAgICAqL1xuICAgIHRyaW0oKSB7XG5cbiAgICAgICAgcmV0dXJuIChrZXksIHZhbHVlLCBuZXh0KSA9PiBuZXh0KG51bGwsIGtleSxcbiAgICAgICAgICAgICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSA/XG4gICAgICAgICAgICB2YWx1ZS50cmltKCkgOiB2YWx1ZSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiByYW5nZSBzdXBwbGllcyBhIFJhbmdlIHJ1bGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWluXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heCBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWluTXNnXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1heE1zZyBcbiAgICAgKiBAcmV0dXJucyB7Y2FsbGJhY2t9XG4gICAgICovXG4gICAgcmFuZ2UobWluLCBtYXgsIG1pbk1zZywgbWF4TXNnKSB7XG5cbiAgICAgICAgcmV0dXJuIChrZXksIHZhbHVlLCBuZXh0KSA9PiB7XG5cbiAgICAgICAgICAgIHZhciB0ZXN0ID0gKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpID9cbiAgICAgICAgICAgICAgICB2YWx1ZSA6XG4gICAgICAgICAgICAgICAgKHZhbHVlLmxlbmd0aCkgP1xuICAgICAgICAgICAgICAgIHZhbHVlLmxlbmd0aCA6IG51bGw7XG5cbiAgICAgICAgICAgIGlmICh0ZXN0ID09PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvcih0aGlzLmdldE1lc3NhZ2UoSU5WQUxJRF9NU0csIHtcbiAgICAgICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgbWF4LFxuICAgICAgICAgICAgICAgICAgICBtaW5cbiAgICAgICAgICAgICAgICB9KSksIGtleSwgdmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAodGVzdCA8IG1pbilcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0TWVzc2FnZShtaW5Nc2cgfHwgTUlOX01TRywge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5cbiAgICAgICAgICAgICAgICAgICAgfSkpLCBrZXksIHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHRlc3QgPiBtYXgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9yKHRoaXMuZ2V0TWVzc2FnZShtYXhNc2cgfHwgTUFYX01TRywge1xuICAgICAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBtYXgsXG4gICAgICAgICAgICAgICAgICAgIG1pblxuICAgICAgICAgICAgICAgIH0pKSwga2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgICAgIG5leHQobnVsbCwga2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgfTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlcXVpcmVkIGNoZWNrcyB0aGF0IHNvbWV0aGluZyB3YXMgc3VwcGxlZCBmb3IgdGhlIHZhbHVlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVtc2cgXG4gICAgICogQHJldHVybnMge2NhbGxiYWNrfVxuICAgICAqL1xuICAgIHJlcXVpcmVkKGVtc2cpIHtcblxuICAgICAgICByZXR1cm4gKGtleSwgdmFsdWUsIG5leHQpID0+XG4gICAgICAgICAgICAoW3VuZGVmaW5lZCwgbnVsbCwgJyddLmluZGV4T2YodmFsdWUpID4gLTEpID9cbiAgICAgICAgICAgIG5leHQobmV3IEVycm9yKHRoaXMuZ2V0TWVzc2FnZShlbXNnIHx8IFJFUVVJUkVEX01TRywge1xuICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgfSkpLCBrZXksIHZhbHVlKSA6XG4gICAgICAgICAgICBuZXh0KG51bGwsIGtleSwgdmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGVudW0gc3VwcGxpZXMgYSBPbmVPZiBydWxlXG4gICAgICogQHBhcmFtIHthcnJheX0gbGlzdCBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZW1zZyBcbiAgICAgKi9cbiAgICBvbmVPZihsaXN0LCBlbXNnKSB7XG5cbiAgICAgICAgcmV0dXJuIChrZXksIHZhbHVlLCBuZXh0KSA9PiAobGlzdC5pbmRleE9mKHZhbHVlKSA8IC0xKSA/XG4gICAgICAgICAgICBuZXh0KG5ldyBFcnJvcih0aGlzLmdldE1lc3NhZ2UoZW1zZyB8fCBPTkVfT0ZfTVNHLCB7XG4gICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgIGVudW06IGxpc3Quam9pbignLCcpXG4gICAgICAgICAgICB9KSksIGtleSwgdmFsdWUpIDpcbiAgICAgICAgICAgIG5leHQobnVsbCwga2V5LCB2YWx1ZSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvcHRpb25hbCB3aWxsIG5vdCBjb250aW51ZSB0aGUgY2hhaW4gaWYgdGhlIHZhbHVlIGlzIG5vdCBzZXRcbiAgICAgKi9cbiAgICBvcHRpb25hbChrZXksIHZhbHVlLCBuZXh0KSB7XG5cbiAgICAgICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgICAgIHJldHVybiBuZXh0KG51bGwsIG51bGwsIG51bGwpO1xuXG4gICAgICAgIG5leHQobnVsbCwga2V5LCB2YWx1ZSk7XG5cblxuICAgIH1cblxuLyoqXG4gKiBhbGwgcnVucyBhbGwgb2YgdGhlIFxuICovXG5hbGwoKSB7XG4gIFxuICAgICAgICB2YXIgcSA9IGxpc3Quc2xpY2UoKTtcbiAgICAgICAgdmFyIHRhcmdldDtcblxuICAgICAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uKGVyciwga2V5LCB2YWx1ZSkge1xuXG4gICAgICAgICAgICBpZiAoZXJyICE9PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBkb25lKGVyciwga2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChxLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCBrZXksIHZhbHVlKTtcblxuICAgICAgICAgICAgaWYoa2V5ID09PSBudWxsKVxuICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCBudWxsLCBudWxsKTtcblxuICAgICAgICAgICAgdGFyZ2V0ID0gcS5zaGlmdCgpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0KGtleSwgdmFsdWUsIG5leHQpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcpXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQobnVsbCwga2V5LCB0YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5hcHBseShrZXksIHZhbHVlLCBuZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXh0KG51bGwsIGtleSwgdGFyZ2V0KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIG5leHQobnVsbCwga2V5LCB2YWx1ZSk7XG5cbiAgICB9XG5cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSdWxlc1xuIl19