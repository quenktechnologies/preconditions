'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var INVALID_MSG = 'Invalid value supplied for \'${key}\'!';
var REQUIRED_MSG = 'The field \'{key}\' is required!';
var MAX_MSG = 'The field \'${key}\' has a maxium of {max}!';
var MIN_MSG = 'The field \'${key}\' has a minimum of {min}!';
var ONE_OF_MSG = 'The field \'{key}\' must be one of \'${enum}\!';

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
                return n(null, k, type(v));
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

                value = typeof value === 'number' ? value : value.length ? value.length : null;

                if (value === null) return next(new Error(_this3.getMessage(INVALID_MSG, {
                    key: key,
                    value: value,
                    max: max,
                    min: min
                })));

                if (value < min) return next(new Error(_this3.getMessage(minMsg || MIN_MSG, {
                    key: key,
                    value: value
                })), key, value);

                if (value > max) return next(new Error(_this3.getMessage(maxMsg || MAX_MSG, {
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
    }]);

    return Rules;
})();

exports['default'] = Rules;
module.exports = exports['default'];