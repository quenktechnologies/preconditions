'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _DefaultStrategy = require('./DefaultStrategy');

var _DefaultStrategy2 = _interopRequireDefault(_DefaultStrategy);

var _Criterion2 = require('./Criterion');

var _Criterion3 = _interopRequireDefault(_Criterion2);

/**
 * Criteria is the main entry point for using this library.
 * It represents a set of Criterion that will be applied
 * to each property in an object passed to apply that it knows about.
 *
 * @abstract
 * @implements {Criterion}
 * @param {Strategy} [strategy=DefaultStrategy] The strategy to use when applyning the pipe.
 * @param {Criterion} [next=null]
 */

var Criteria = (function (_Criterion) {
    _inherits(Criteria, _Criterion);

    function Criteria(strategy, next) {
        _classCallCheck(this, Criteria);

        _get(Object.getPrototypeOf(Criteria.prototype), 'constructor', this).call(this, next);
        this._strategy = strategy || new _DefaultStrategy2['default']();
    }

    /**
     * all returns a map of Criteron this objects.
     * @returns {object}
     */

    _createClass(Criteria, [{
        key: 'all',
        value: function all() {
            var _this = this;

            var o = {};

            Object.keys(this).forEach(function (key) {

                if (_this[key] instanceof _Criterion3['default']) o[key] = _this[key];
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

            this._strategy.execute(this, value, function (err, o) {
                return err !== null ? next(err, key, value) : _this2.onComplete(o, function (err, o) {
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

            return this._strategy.execute(this, obj, function (err, o) {
                return err !== null ? done(err, obj) : _this3.onComplete(o, done);
            });
        }
    }]);

    return Criteria;
})(_Criterion3['default']);

exports['default'] = Criteria;
module.exports = exports['default'];