'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ExecutionError = require('./ExecutionError');

var _ExecutionError2 = _interopRequireDefault(_ExecutionError);

/**
 * DefaultStrategy runs criterion all one at a time providing
 * a callback to each that allows async operations during filtering to be performed.
 * @implements {Strategy}
 */

var DefaultStrategy = (function () {
    function DefaultStrategy() {
        _classCallCheck(this, DefaultStrategy);
    }

    _createClass(DefaultStrategy, [{
        key: '_run',
        value: function _run(list, key, value, done) {

            var q = list.slice();
            var target;

            var next = function next(err, key, value) {

                if (err !== null) return done(err, key, value);

                if (q.length === 0) return done(null, key, value);

                target = q.shift();

                if (target) target.apply(key, value, next);
            };

            next(null, key, value);
        }
    }, {
        key: 'execute',
        value: function execute(criteria, obj, done) {
            var _this = this;

            var all = criteria.all();
            var left = Object.keys(all).length;
            var errorCount = 0;
            var errors = {};
            var result = {};

            var next = function next(err, key, value) {

                left--;

                if (err) {
                    errors[key] = err.message;
                    errorCount++;
                } else if (value !== null) {
                    result[key] = value;
                }

                if (left === 0) {

                    if (errorCount > 0) {

                        done(new _ExecutionError2['default'](errors), obj);
                    } else {
                        done(null, result);
                    }
                }
            };

            if (left === 0) return done(null, obj);

            Object.keys(all).forEach(function (key) {
                return _this._run(Array.isArray(all[key]) ? all[key] : [all[key]], key, obj[key], next);
            });

            return null;
        }
    }]);

    return DefaultStrategy;
})();

exports['default'] = DefaultStrategy;
module.exports = exports['default'];