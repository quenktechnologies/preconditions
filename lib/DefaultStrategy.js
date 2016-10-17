'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ExecutionError = require('./ExecutionError');

var _ExecutionError2 = _interopRequireDefault(_ExecutionError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * DefaultStrategy runs criterion all one at a time providing
 * a callback to each that allows async operations during filtering to be performed.
 * @implements {Strategy}
 */
var DefaultStrategy = function () {
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

                if (key === null) return done(null, null, null);

                target = q.shift();

                if (typeof target === 'function') return target(key, value, next);

                if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object') if (target !== null) if (Array.isArray(target)) {
                    return next(null, key, target);
                } else {
                    return target.call(null, key, value, next);
                }

                next(null, key, target);
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

            if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj === null) return done(new Error('Payload is empty!'));

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

                        done(new _ExecutionError2.default(errors), obj);
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
}();

exports.default = DefaultStrategy;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWZhdWx0U3RyYXRlZ3kuanMiXSwibmFtZXMiOlsiRGVmYXVsdFN0cmF0ZWd5IiwibGlzdCIsImtleSIsInZhbHVlIiwiZG9uZSIsInEiLCJzbGljZSIsInRhcmdldCIsIm5leHQiLCJlcnIiLCJsZW5ndGgiLCJzaGlmdCIsIkFycmF5IiwiaXNBcnJheSIsImNhbGwiLCJjcml0ZXJpYSIsIm9iaiIsImFsbCIsImdldENyaXRlcmlhIiwibGVmdCIsIk9iamVjdCIsImtleXMiLCJlcnJvckNvdW50IiwiZXJyb3JzIiwicmVzdWx0IiwiRXJyb3IiLCJtZXNzYWdlIiwiZm9yRWFjaCIsIl9ydW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7QUFFQTs7Ozs7SUFLTUEsZTs7Ozs7Ozs2QkFFR0MsSSxFQUFNQyxHLEVBQUtDLEssRUFBT0MsSSxFQUFNOztBQUV6QixnQkFBSUMsSUFBSUosS0FBS0ssS0FBTCxFQUFSO0FBQ0EsZ0JBQUlDLE1BQUo7O0FBRUEsZ0JBQUlDLE9BQU8sU0FBUEEsSUFBTyxDQUFTQyxHQUFULEVBQWNQLEdBQWQsRUFBbUJDLEtBQW5CLEVBQTBCOztBQUVqQyxvQkFBSU0sUUFBUSxJQUFaLEVBQ0ksT0FBT0wsS0FBS0ssR0FBTCxFQUFVUCxHQUFWLEVBQWVDLEtBQWYsQ0FBUDs7QUFFSixvQkFBSUUsRUFBRUssTUFBRixLQUFhLENBQWpCLEVBQ0ksT0FBT04sS0FBSyxJQUFMLEVBQVdGLEdBQVgsRUFBZ0JDLEtBQWhCLENBQVA7O0FBRUosb0JBQUlELFFBQVEsSUFBWixFQUNJLE9BQU9FLEtBQUssSUFBTCxFQUFXLElBQVgsRUFBaUIsSUFBakIsQ0FBUDs7QUFFSkcseUJBQVNGLEVBQUVNLEtBQUYsRUFBVDs7QUFFQSxvQkFBSSxPQUFPSixNQUFQLEtBQWtCLFVBQXRCLEVBQ0ksT0FBT0EsT0FBT0wsR0FBUCxFQUFZQyxLQUFaLEVBQW1CSyxJQUFuQixDQUFQOztBQUVKLG9CQUFJLFFBQU9ELE1BQVAseUNBQU9BLE1BQVAsT0FBa0IsUUFBdEIsRUFDSSxJQUFJQSxXQUFXLElBQWYsRUFDSSxJQUFJSyxNQUFNQyxPQUFOLENBQWNOLE1BQWQsQ0FBSixFQUEyQjtBQUN2QiwyQkFBT0MsS0FBSyxJQUFMLEVBQVdOLEdBQVgsRUFBZ0JLLE1BQWhCLENBQVA7QUFDSCxpQkFGRCxNQUVPO0FBQ0gsMkJBQU9BLE9BQU9PLElBQVAsQ0FBWSxJQUFaLEVBQWtCWixHQUFsQixFQUF1QkMsS0FBdkIsRUFBOEJLLElBQTlCLENBQVA7QUFDSDs7QUFFVEEscUJBQUssSUFBTCxFQUFXTixHQUFYLEVBQWdCSyxNQUFoQjtBQUVILGFBMUJEOztBQTRCQUMsaUJBQUssSUFBTCxFQUFXTixHQUFYLEVBQWdCQyxLQUFoQjtBQUVIOzs7Z0NBRU9ZLFEsRUFBVUMsRyxFQUFLWixJLEVBQU07QUFBQTs7QUFFekIsZ0JBQUlhLE1BQU1GLFNBQVNHLFdBQVQsRUFBVjtBQUNBLGdCQUFJQyxPQUFPQyxPQUFPQyxJQUFQLENBQVlKLEdBQVosRUFBaUJQLE1BQTVCO0FBQ0EsZ0JBQUlZLGFBQWEsQ0FBakI7QUFDQSxnQkFBSUMsU0FBUyxFQUFiO0FBQ0EsZ0JBQUlDLFNBQVMsRUFBYjs7QUFFQSxnQkFBSyxRQUFPUixHQUFQLHlDQUFPQSxHQUFQLE9BQWUsUUFBaEIsSUFBOEJBLFFBQVEsSUFBMUMsRUFDSSxPQUFPWixLQUFLLElBQUlxQixLQUFKLENBQVUsbUJBQVYsQ0FBTCxDQUFQOztBQUVKLGdCQUFJakIsT0FBTyxTQUFQQSxJQUFPLENBQVNDLEdBQVQsRUFBY1AsR0FBZCxFQUFtQkMsS0FBbkIsRUFBMEI7O0FBRWpDZ0I7O0FBRUEsb0JBQUlWLEdBQUosRUFBUztBQUNMYywyQkFBT3JCLEdBQVAsSUFBY08sSUFBSWlCLE9BQWxCO0FBQ0FKO0FBQ0gsaUJBSEQsTUFHTyxJQUFJbkIsVUFBVSxJQUFkLEVBQW9CO0FBQ3ZCcUIsMkJBQU90QixHQUFQLElBQWNDLEtBQWQ7QUFDSDs7QUFFRCxvQkFBSWdCLFNBQVMsQ0FBYixFQUFnQjs7QUFFWix3QkFBSUcsYUFBYSxDQUFqQixFQUFvQjs7QUFFaEJsQiw2QkFBSyw2QkFBbUJtQixNQUFuQixDQUFMLEVBQWlDUCxHQUFqQztBQUVILHFCQUpELE1BSU87QUFDSFosNkJBQUssSUFBTCxFQUFXb0IsTUFBWDtBQUNIO0FBRUo7QUFFSixhQXZCRDs7QUF5QkEsZ0JBQUlMLFNBQVMsQ0FBYixFQUNJLE9BQU9mLEtBQUssSUFBTCxFQUFXWSxHQUFYLENBQVA7O0FBRUpJLG1CQUFPQyxJQUFQLENBQVlKLEdBQVosRUFDQVUsT0FEQSxDQUNRLGVBQU87QUFDWCxzQkFBS0MsSUFBTCxDQUNLaEIsTUFBTUMsT0FBTixDQUFjSSxJQUFJZixHQUFKLENBQWQsQ0FBRCxHQUNBZSxJQUFJZixHQUFKLENBREEsR0FDVyxDQUFDZSxJQUFJZixHQUFKLENBQUQsQ0FGZixFQUUyQkEsR0FGM0IsRUFFZ0NjLElBQUlkLEdBQUosQ0FGaEMsRUFFMENNLElBRjFDO0FBSUgsYUFORDs7QUFRQSxtQkFBTyxJQUFQO0FBRUg7Ozs7OztrQkFHVVIsZSIsImZpbGUiOiJEZWZhdWx0U3RyYXRlZ3kuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXhlY3V0aW9uRXJyb3IgZnJvbSAnLi9FeGVjdXRpb25FcnJvcic7XG5cbi8qKlxuICogRGVmYXVsdFN0cmF0ZWd5IHJ1bnMgY3JpdGVyaW9uIGFsbCBvbmUgYXQgYSB0aW1lIHByb3ZpZGluZ1xuICogYSBjYWxsYmFjayB0byBlYWNoIHRoYXQgYWxsb3dzIGFzeW5jIG9wZXJhdGlvbnMgZHVyaW5nIGZpbHRlcmluZyB0byBiZSBwZXJmb3JtZWQuXG4gKiBAaW1wbGVtZW50cyB7U3RyYXRlZ3l9XG4gKi9cbmNsYXNzIERlZmF1bHRTdHJhdGVneSB7XG5cbiAgICBfcnVuKGxpc3QsIGtleSwgdmFsdWUsIGRvbmUpIHtcblxuICAgICAgICB2YXIgcSA9IGxpc3Quc2xpY2UoKTtcbiAgICAgICAgdmFyIHRhcmdldDtcblxuICAgICAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uKGVyciwga2V5LCB2YWx1ZSkge1xuXG4gICAgICAgICAgICBpZiAoZXJyICE9PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBkb25lKGVyciwga2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChxLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCBrZXksIHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKGtleSA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCBudWxsLCBudWxsKTtcblxuICAgICAgICAgICAgdGFyZ2V0ID0gcS5zaGlmdCgpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0KGtleSwgdmFsdWUsIG5leHQpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcpXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQobnVsbCwga2V5LCB0YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5jYWxsKG51bGwsIGtleSwgdmFsdWUsIG5leHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5leHQobnVsbCwga2V5LCB0YXJnZXQpO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgbmV4dChudWxsLCBrZXksIHZhbHVlKTtcblxuICAgIH1cblxuICAgIGV4ZWN1dGUoY3JpdGVyaWEsIG9iaiwgZG9uZSkge1xuXG4gICAgICAgIHZhciBhbGwgPSBjcml0ZXJpYS5nZXRDcml0ZXJpYSgpO1xuICAgICAgICB2YXIgbGVmdCA9IE9iamVjdC5rZXlzKGFsbCkubGVuZ3RoO1xuICAgICAgICB2YXIgZXJyb3JDb3VudCA9IDA7XG4gICAgICAgIHZhciBlcnJvcnMgPSB7fTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgICAgIGlmICgodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHx8IChvYmogPT09IG51bGwpKVxuICAgICAgICAgICAgcmV0dXJuIGRvbmUobmV3IEVycm9yKCdQYXlsb2FkIGlzIGVtcHR5IScpKTtcblxuICAgICAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uKGVyciwga2V5LCB2YWx1ZSkge1xuXG4gICAgICAgICAgICBsZWZ0LS07XG5cbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBlcnJvcnNba2V5XSA9IGVyci5tZXNzYWdlO1xuICAgICAgICAgICAgICAgIGVycm9yQ291bnQrKztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobGVmdCA9PT0gMCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yQ291bnQgPiAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9uZShuZXcgRXhlY3V0aW9uRXJyb3IoZXJyb3JzKSwgb2JqKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUobnVsbCwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxlZnQgPT09IDApXG4gICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCBvYmopO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGFsbCkuXG4gICAgICAgIGZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3J1bihcbiAgICAgICAgICAgICAgICAoQXJyYXkuaXNBcnJheShhbGxba2V5XSkpID9cbiAgICAgICAgICAgICAgICBhbGxba2V5XSA6IFthbGxba2V5XV0sIGtleSwgb2JqW2tleV0sIG5leHQpXG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlZmF1bHRTdHJhdGVneVxuIl19