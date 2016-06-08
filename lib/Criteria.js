'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _DefaultStrategy = require('./DefaultStrategy');

var _DefaultStrategy2 = _interopRequireDefault(_DefaultStrategy);

var _Criterion = require('./Criterion');

var _Criterion2 = _interopRequireDefault(_Criterion);

/**
 * Criteria is the main entry point for using this library.
 * It represents a set of Criterion that will be applied
 * to each property in an object passed to apply that it knows about.
 *
 * @abstract
 * @implements {CriteriaRule}
 */

var Criteria = (function () {
    function Criteria() {
        _classCallCheck(this, Criteria);
    }

    _createClass(Criteria, [{
        key: 'getCriteria',

        /**
         * getCriteria returns a map of Criteron this objects.
         * @returns {object}
         */
        value: function getCriteria() {
            var _this = this;

            var o = {};

            Object.keys(this).forEach(function (key) {

                if (_this.hasOwnProperty(key)) if (key[0] !== '_') o[key] = _this[key];
            });

            return o;
        }

        /**
         * onComplete is called if there are no errors after applying all the rules.
         * @param {object} result 
         * @param {function} done 
         */
    }, {
        key: 'onComplete',
        value: function onComplete(result, done) {

            done(null, result);
        }
    }, {
        key: 'apply',
        value: function apply(key, value, done) {
            var _this2 = this;

            new _DefaultStrategy2['default']().execute(this, value, function (err, o) {
                return err !== null ? done(err, key, value) : _this2.onComplete(o, function (err, o) {
                    return done(err, key, o);
                });
            });
        }

        /**
         * execute the rules to the passed object.
         * If a callback is provided, it is called with the results,
         * the return value of the internal strategy in use is also returned which
         * is expected to be null or a Promise.
         * @param {object} obj The object to apply through the pipe.
         * @param {function} cb A callback that is called with the results.
         * @returns {null|Promise} 
         */
    }, {
        key: 'execute',
        value: function execute(obj, done) {
            var _this3 = this;

            new _DefaultStrategy2['default']().execute(this, obj, function (err, o) {
                return err !== null ? done(err, obj) : _this3.onComplete(o, done);
            });
        }
    }]);

    return Criteria;
})();

exports['default'] = Criteria;
module.exports = exports['default'];