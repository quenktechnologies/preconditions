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

            var next = function next(_x, _x2, _x3) {
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
                        return target.call(null, key, value, next);
                    }

                    next(null, key, target);
                }
            };

            next(null, key, value);
        }
    }, {
        key: 'execute',
        value: function execute(criteria, obj, done) {
            var _this = this;

            var all = criteria.getCriteria();
            var left = Object.keys(all).length;
            var errorCount = 0;
            var errors = {};
            var result = {};

            if (typeof obj !== 'object' || obj === null) return done(new Error('Payload is empty!'));

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
                _this._run(Array.isArray(all[key]) ? all[key] : [all[key]], key, obj[key], next);
            });

            return null;
        }
    }]);

    return DefaultStrategy;
})();

exports['default'] = DefaultStrategy;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWZhdWx0U3RyYXRlZ3kuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzhCQUEyQixrQkFBa0I7Ozs7Ozs7Ozs7SUFPdkMsZUFBZTthQUFmLGVBQWU7OEJBQWYsZUFBZTs7O2lCQUFmLGVBQWU7O2VBRWIsY0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7O0FBRXpCLGdCQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDckIsZ0JBQUksTUFBTSxDQUFDOztBQUVYLGdCQUFJLElBQUksR0FBRyxTQUFQLElBQUk7OzswQ0FBNkI7d0JBQWpCLEdBQUc7d0JBQUUsR0FBRzt3QkFBRSxLQUFLOzs7QUFFL0Isd0JBQUksR0FBRyxLQUFLLElBQUksRUFDWixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVqQyx3QkFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFDZCxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVsQyx3QkFBSSxHQUFHLEtBQUssSUFBSSxFQUNaLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRWxDLDBCQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUVuQix3QkFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLEVBQzVCLE9BQU8sTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRXBDLHdCQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFDMUIsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUNmLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTs2QkFDWCxJQUFJOzhCQUFFLEdBQUc7OEJBQUUsTUFBTTs7O3FCQUNoQyxNQUFNO0FBQ0gsK0JBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztxQkFDOUM7O0FBRVQsd0JBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2lCQUUzQjthQUFBLENBQUM7O0FBRUYsZ0JBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBRTFCOzs7ZUFFTSxpQkFBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTs7O0FBRXpCLGdCQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDakMsZ0JBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ25DLGdCQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDbkIsZ0JBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixnQkFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDOztBQUVoQixnQkFBSSxBQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBTSxHQUFHLEtBQUssSUFBSSxBQUFDLEVBQzNDLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQzs7QUFFaEQsZ0JBQUksSUFBSSxHQUFHLFNBQVAsSUFBSSxDQUFZLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFOztBQUVqQyxvQkFBSSxFQUFFLENBQUM7O0FBRVAsb0JBQUksR0FBRyxFQUFFO0FBQ0wsMEJBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO0FBQzFCLDhCQUFVLEVBQUUsQ0FBQztpQkFDaEIsTUFBTSxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFDdkIsMEJBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7aUJBQ3ZCOztBQUVELG9CQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7O0FBRVosd0JBQUksVUFBVSxHQUFHLENBQUMsRUFBRTs7QUFFaEIsNEJBQUksQ0FBQyxnQ0FBbUIsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBRXpDLE1BQU07QUFDSCw0QkFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztxQkFDdEI7aUJBRUo7YUFFSixDQUFBOztBQUVELGdCQUFJLElBQUksS0FBSyxDQUFDLEVBQ1YsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUUzQixrQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FDaEIsT0FBTyxDQUFDLFVBQUEsR0FBRyxFQUFJO0FBQ1gsc0JBQUssSUFBSSxDQUNMLEFBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FDeEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTthQUVsRCxDQUFDLENBQUM7O0FBRUgsbUJBQU8sSUFBSSxDQUFDO1NBRWY7OztXQXhGQyxlQUFlOzs7cUJBMkZOLGVBQWUiLCJmaWxlIjoiRGVmYXVsdFN0cmF0ZWd5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV4ZWN1dGlvbkVycm9yIGZyb20gJy4vRXhlY3V0aW9uRXJyb3InO1xuXG4vKipcbiAqIERlZmF1bHRTdHJhdGVneSBydW5zIGNyaXRlcmlvbiBhbGwgb25lIGF0IGEgdGltZSBwcm92aWRpbmdcbiAqIGEgY2FsbGJhY2sgdG8gZWFjaCB0aGF0IGFsbG93cyBhc3luYyBvcGVyYXRpb25zIGR1cmluZyBmaWx0ZXJpbmcgdG8gYmUgcGVyZm9ybWVkLlxuICogQGltcGxlbWVudHMge1N0cmF0ZWd5fVxuICovXG5jbGFzcyBEZWZhdWx0U3RyYXRlZ3kge1xuXG4gICAgX3J1bihsaXN0LCBrZXksIHZhbHVlLCBkb25lKSB7XG5cbiAgICAgICAgdmFyIHEgPSBsaXN0LnNsaWNlKCk7XG4gICAgICAgIHZhciB0YXJnZXQ7XG5cbiAgICAgICAgdmFyIG5leHQgPSBmdW5jdGlvbihlcnIsIGtleSwgdmFsdWUpIHtcblxuICAgICAgICAgICAgaWYgKGVyciAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShlcnIsIGtleSwgdmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAocS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwga2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChrZXkgPT09IG51bGwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgbnVsbCwgbnVsbCk7XG5cbiAgICAgICAgICAgIHRhcmdldCA9IHEuc2hpZnQoKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldChrZXksIHZhbHVlLCBuZXh0KTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnKVxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgIT09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KG51bGwsIGtleSwgdGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuY2FsbChudWxsLCBrZXksIHZhbHVlLCBuZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXh0KG51bGwsIGtleSwgdGFyZ2V0KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIG5leHQobnVsbCwga2V5LCB2YWx1ZSk7XG5cbiAgICB9XG5cbiAgICBleGVjdXRlKGNyaXRlcmlhLCBvYmosIGRvbmUpIHtcblxuICAgICAgICB2YXIgYWxsID0gY3JpdGVyaWEuZ2V0Q3JpdGVyaWEoKTtcbiAgICAgICAgdmFyIGxlZnQgPSBPYmplY3Qua2V5cyhhbGwpLmxlbmd0aDtcbiAgICAgICAgdmFyIGVycm9yQ291bnQgPSAwO1xuICAgICAgICB2YXIgZXJyb3JzID0ge307XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgICAgICBpZiAoKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB8fCAob2JqID09PSBudWxsKSlcbiAgICAgICAgICAgIHJldHVybiBkb25lKG5ldyBFcnJvcignUGF5bG9hZCBpcyBlbXB0eSEnKSk7XG5cbiAgICAgICAgdmFyIG5leHQgPSBmdW5jdGlvbihlcnIsIGtleSwgdmFsdWUpIHtcblxuICAgICAgICAgICAgbGVmdC0tO1xuXG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JzW2tleV0gPSBlcnIubWVzc2FnZTtcbiAgICAgICAgICAgICAgICBlcnJvckNvdW50Kys7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGxlZnQgPT09IDApIHtcblxuICAgICAgICAgICAgICAgIGlmIChlcnJvckNvdW50ID4gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGRvbmUobmV3IEV4ZWN1dGlvbkVycm9yKGVycm9ycyksIG9iaik7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkb25lKG51bGwsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsZWZ0ID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgb2JqKTtcblxuICAgICAgICBPYmplY3Qua2V5cyhhbGwpLlxuICAgICAgICBmb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9ydW4oXG4gICAgICAgICAgICAgICAgKEFycmF5LmlzQXJyYXkoYWxsW2tleV0pKSA/XG4gICAgICAgICAgICAgICAgYWxsW2tleV0gOiBbYWxsW2tleV1dLCBrZXksIG9ialtrZXldLCBuZXh0KVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0U3RyYXRlZ3lcbiJdfQ==