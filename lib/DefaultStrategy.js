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
                        return target.satisfy(key, value, next);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWZhdWx0U3RyYXRlZ3kuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzhCQUEyQixrQkFBa0I7Ozs7Ozs7Ozs7SUFPdkMsZUFBZTthQUFmLGVBQWU7OEJBQWYsZUFBZTs7O2lCQUFmLGVBQWU7O2VBRWIsY0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7O0FBRXpCLGdCQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDckIsZ0JBQUksTUFBTSxDQUFDOztBQUVYLGdCQUFJLElBQUksR0FBRyxTQUFQLElBQUk7OzswQ0FBNkI7d0JBQWpCLEdBQUc7d0JBQUUsR0FBRzt3QkFBRSxLQUFLOzs7QUFFL0Isd0JBQUksR0FBRyxLQUFLLElBQUksRUFDWixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVqQyx3QkFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFDZCxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVsQyx3QkFBRyxHQUFHLEtBQUssSUFBSSxFQUNiLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRWhDLDBCQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUVuQix3QkFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLEVBQzVCLE9BQU8sTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRXBDLHdCQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFDMUIsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUNmLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTs2QkFDWCxJQUFJOzhCQUFFLEdBQUc7OEJBQUUsTUFBTTs7O3FCQUNoQyxNQUFNO0FBQ0gsK0JBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUMzQzs7QUFFVCx3QkFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBRTNCO2FBQUEsQ0FBQzs7QUFFRixnQkFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FFMUI7OztlQUVNLGlCQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFOzs7QUFFekIsZ0JBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNqQyxnQkFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDbkMsZ0JBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztBQUNuQixnQkFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLGdCQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7O0FBRWhCLGdCQUFJLEFBQUMsT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFNLEdBQUcsS0FBSyxJQUFJLEFBQUMsRUFDM0MsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDOztBQUVoRCxnQkFBSSxJQUFJLEdBQUcsU0FBUCxJQUFJLENBQVksR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7O0FBRWpDLG9CQUFJLEVBQUUsQ0FBQzs7QUFFUCxvQkFBSSxHQUFHLEVBQUU7QUFDTCwwQkFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7QUFDMUIsOEJBQVUsRUFBRSxDQUFDO2lCQUNoQixNQUFNLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtBQUN2QiwwQkFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztpQkFDdkI7O0FBRUQsb0JBQUksSUFBSSxLQUFLLENBQUMsRUFBRTs7QUFFWix3QkFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFOztBQUVoQiw0QkFBSSxDQUFDLGdDQUFtQixNQUFNLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFFekMsTUFBTTtBQUNILDRCQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO3FCQUN0QjtpQkFFSjthQUVKLENBQUE7O0FBRUQsZ0JBQUksSUFBSSxLQUFLLENBQUMsRUFDVixPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRTNCLGtCQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUNoQixPQUFPLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDWCxzQkFBSyxJQUFJLENBQ0wsQUFBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUN4QixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO2FBRWxELENBQUMsQ0FBQzs7QUFFSCxtQkFBTyxJQUFJLENBQUM7U0FFZjs7O1dBeEZDLGVBQWU7OztxQkEyRk4sZUFBZSIsImZpbGUiOiJEZWZhdWx0U3RyYXRlZ3kuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXhlY3V0aW9uRXJyb3IgZnJvbSAnLi9FeGVjdXRpb25FcnJvcic7XG5cbi8qKlxuICogRGVmYXVsdFN0cmF0ZWd5IHJ1bnMgY3JpdGVyaW9uIGFsbCBvbmUgYXQgYSB0aW1lIHByb3ZpZGluZ1xuICogYSBjYWxsYmFjayB0byBlYWNoIHRoYXQgYWxsb3dzIGFzeW5jIG9wZXJhdGlvbnMgZHVyaW5nIGZpbHRlcmluZyB0byBiZSBwZXJmb3JtZWQuXG4gKiBAaW1wbGVtZW50cyB7U3RyYXRlZ3l9XG4gKi9cbmNsYXNzIERlZmF1bHRTdHJhdGVneSB7XG5cbiAgICBfcnVuKGxpc3QsIGtleSwgdmFsdWUsIGRvbmUpIHtcblxuICAgICAgICB2YXIgcSA9IGxpc3Quc2xpY2UoKTtcbiAgICAgICAgdmFyIHRhcmdldDtcblxuICAgICAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uKGVyciwga2V5LCB2YWx1ZSkge1xuXG4gICAgICAgICAgICBpZiAoZXJyICE9PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBkb25lKGVyciwga2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChxLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCBrZXksIHZhbHVlKTtcblxuICAgICAgICAgICAgaWYoa2V5ID09PSBudWxsKVxuICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCBudWxsLCBudWxsKTtcblxuICAgICAgICAgICAgdGFyZ2V0ID0gcS5zaGlmdCgpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0KGtleSwgdmFsdWUsIG5leHQpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcpXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQobnVsbCwga2V5LCB0YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5zYXRpc2Z5KGtleSwgdmFsdWUsIG5leHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5leHQobnVsbCwga2V5LCB0YXJnZXQpO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgbmV4dChudWxsLCBrZXksIHZhbHVlKTtcblxuICAgIH1cblxuICAgIGV4ZWN1dGUoY3JpdGVyaWEsIG9iaiwgZG9uZSkge1xuXG4gICAgICAgIHZhciBhbGwgPSBjcml0ZXJpYS5nZXRDcml0ZXJpYSgpO1xuICAgICAgICB2YXIgbGVmdCA9IE9iamVjdC5rZXlzKGFsbCkubGVuZ3RoO1xuICAgICAgICB2YXIgZXJyb3JDb3VudCA9IDA7XG4gICAgICAgIHZhciBlcnJvcnMgPSB7fTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgICAgIGlmICgodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHx8IChvYmogPT09IG51bGwpKVxuICAgICAgICAgICAgcmV0dXJuIGRvbmUobmV3IEVycm9yKCdQYXlsb2FkIGlzIGVtcHR5IScpKTtcblxuICAgICAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uKGVyciwga2V5LCB2YWx1ZSkge1xuXG4gICAgICAgICAgICBsZWZ0LS07XG5cbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBlcnJvcnNba2V5XSA9IGVyci5tZXNzYWdlO1xuICAgICAgICAgICAgICAgIGVycm9yQ291bnQrKztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobGVmdCA9PT0gMCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yQ291bnQgPiAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9uZShuZXcgRXhlY3V0aW9uRXJyb3IoZXJyb3JzKSwgb2JqKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUobnVsbCwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxlZnQgPT09IDApXG4gICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCBvYmopO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGFsbCkuXG4gICAgICAgIGZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3J1bihcbiAgICAgICAgICAgICAgICAoQXJyYXkuaXNBcnJheShhbGxba2V5XSkpID9cbiAgICAgICAgICAgICAgICBhbGxba2V5XSA6IFthbGxba2V5XV0sIGtleSwgb2JqW2tleV0sIG5leHQpXG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlZmF1bHRTdHJhdGVneVxuIl19