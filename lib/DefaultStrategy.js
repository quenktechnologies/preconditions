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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWZhdWx0U3RyYXRlZ3kuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzhCQUEyQixrQkFBa0I7Ozs7Ozs7Ozs7SUFPdkMsZUFBZTthQUFmLGVBQWU7OEJBQWYsZUFBZTs7O2lCQUFmLGVBQWU7O2VBRWIsY0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7O0FBRXpCLGdCQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDckIsZ0JBQUksTUFBTSxDQUFDOztBQUVYLGdCQUFJLElBQUksR0FBRyxTQUFQLElBQUk7Ozs7MENBQTZCO3dCQUFqQixHQUFHO3dCQUFFLEdBQUc7d0JBQUUsS0FBSzs7O0FBRS9CLHdCQUFJLEdBQUcsS0FBSyxJQUFJLEVBQ1osT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFakMsd0JBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQ2QsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFbEMsd0JBQUcsR0FBRyxLQUFLLElBQUksRUFDYixPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUVoQywwQkFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFbkIsd0JBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxFQUM1QixPQUFPLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUVwQyx3QkFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQzFCLElBQUksTUFBTSxLQUFLLElBQUksRUFDZixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7NkJBQ1gsSUFBSTs4QkFBRSxHQUFHOzhCQUFFLE1BQU07OztxQkFDaEMsTUFBTTtBQUNILCtCQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztxQkFDekM7O0FBRVQsd0JBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2lCQUUzQjthQUFBLENBQUM7O0FBRUYsZ0JBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBRTFCOzs7ZUFFTSxpQkFBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTs7O0FBRXpCLGdCQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDakMsZ0JBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ25DLGdCQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDbkIsZ0JBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixnQkFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDOztBQUVoQixnQkFBSSxBQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBTSxHQUFHLEtBQUssSUFBSSxBQUFDLEVBQzNDLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQzs7QUFFaEQsZ0JBQUksSUFBSSxHQUFHLFNBQVAsSUFBSSxDQUFZLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFOztBQUVqQyxvQkFBSSxFQUFFLENBQUM7O0FBRVAsb0JBQUksR0FBRyxFQUFFO0FBQ0wsMEJBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO0FBQzFCLDhCQUFVLEVBQUUsQ0FBQztpQkFDaEIsTUFBTSxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFDdkIsMEJBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7aUJBQ3ZCOztBQUVELG9CQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7O0FBRVosd0JBQUksVUFBVSxHQUFHLENBQUMsRUFBRTs7QUFFaEIsNEJBQUksQ0FBQyxnQ0FBbUIsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBRXpDLE1BQU07QUFDSCw0QkFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztxQkFDdEI7aUJBRUo7YUFFSixDQUFBOztBQUVELGdCQUFJLElBQUksS0FBSyxDQUFDLEVBQ1YsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUUzQixrQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FDaEIsT0FBTyxDQUFDLFVBQUEsR0FBRyxFQUFJO0FBQ1gsc0JBQUssSUFBSSxDQUNMLEFBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FDeEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTthQUVsRCxDQUFDLENBQUM7O0FBRUgsbUJBQU8sSUFBSSxDQUFDO1NBRWY7OztXQXhGQyxlQUFlOzs7cUJBMkZOLGVBQWUiLCJmaWxlIjoiRGVmYXVsdFN0cmF0ZWd5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV4ZWN1dGlvbkVycm9yIGZyb20gJy4vRXhlY3V0aW9uRXJyb3InO1xuXG4vKipcbiAqIERlZmF1bHRTdHJhdGVneSBydW5zIGNyaXRlcmlvbiBhbGwgb25lIGF0IGEgdGltZSBwcm92aWRpbmdcbiAqIGEgY2FsbGJhY2sgdG8gZWFjaCB0aGF0IGFsbG93cyBhc3luYyBvcGVyYXRpb25zIGR1cmluZyBmaWx0ZXJpbmcgdG8gYmUgcGVyZm9ybWVkLlxuICogQGltcGxlbWVudHMge1N0cmF0ZWd5fVxuICovXG5jbGFzcyBEZWZhdWx0U3RyYXRlZ3kge1xuXG4gICAgX3J1bihsaXN0LCBrZXksIHZhbHVlLCBkb25lKSB7XG5cbiAgICAgICAgdmFyIHEgPSBsaXN0LnNsaWNlKCk7XG4gICAgICAgIHZhciB0YXJnZXQ7XG5cbiAgICAgICAgdmFyIG5leHQgPSBmdW5jdGlvbihlcnIsIGtleSwgdmFsdWUpIHtcblxuICAgICAgICAgICAgaWYgKGVyciAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShlcnIsIGtleSwgdmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAocS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwga2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmKGtleSA9PT0gbnVsbClcbiAgICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgbnVsbCwgbnVsbCk7XG5cbiAgICAgICAgICAgIHRhcmdldCA9IHEuc2hpZnQoKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldChrZXksIHZhbHVlLCBuZXh0KTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnKVxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgIT09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KG51bGwsIGtleSwgdGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuYXBwbHkoa2V5LCB2YWx1ZSwgbmV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmV4dChudWxsLCBrZXksIHRhcmdldCk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBuZXh0KG51bGwsIGtleSwgdmFsdWUpO1xuXG4gICAgfVxuXG4gICAgZXhlY3V0ZShjcml0ZXJpYSwgb2JqLCBkb25lKSB7XG5cbiAgICAgICAgdmFyIGFsbCA9IGNyaXRlcmlhLmdldENyaXRlcmlhKCk7XG4gICAgICAgIHZhciBsZWZ0ID0gT2JqZWN0LmtleXMoYWxsKS5sZW5ndGg7XG4gICAgICAgIHZhciBlcnJvckNvdW50ID0gMDtcbiAgICAgICAgdmFyIGVycm9ycyA9IHt9O1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICAgICAgaWYgKCh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JykgfHwgKG9iaiA9PT0gbnVsbCkpXG4gICAgICAgICAgICByZXR1cm4gZG9uZShuZXcgRXJyb3IoJ1BheWxvYWQgaXMgZW1wdHkhJykpO1xuXG4gICAgICAgIHZhciBuZXh0ID0gZnVuY3Rpb24oZXJyLCBrZXksIHZhbHVlKSB7XG5cbiAgICAgICAgICAgIGxlZnQtLTtcblxuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGVycm9yc1trZXldID0gZXJyLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgZXJyb3JDb3VudCsrO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChsZWZ0ID09PSAwKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyb3JDb3VudCA+IDApIHtcblxuICAgICAgICAgICAgICAgICAgICBkb25lKG5ldyBFeGVjdXRpb25FcnJvcihlcnJvcnMpLCBvYmopO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZShudWxsLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGVmdCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiBkb25lKG51bGwsIG9iaik7XG5cbiAgICAgICAgT2JqZWN0LmtleXMoYWxsKS5cbiAgICAgICAgZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fcnVuKFxuICAgICAgICAgICAgICAgIChBcnJheS5pc0FycmF5KGFsbFtrZXldKSkgP1xuICAgICAgICAgICAgICAgIGFsbFtrZXldIDogW2FsbFtrZXldXSwga2V5LCBvYmpba2V5XSwgbmV4dClcblxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdFN0cmF0ZWd5XG4iXX0=