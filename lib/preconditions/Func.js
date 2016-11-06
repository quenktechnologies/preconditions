'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Chainable2 = require('./Chainable');

var _Chainable3 = _interopRequireDefault(_Chainable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Func wraps a function so it can be treated as a chainable Precondition.
 * @param {function<null|error>} fn
 */
var Func = function (_Chainable) {
    _inherits(Func, _Chainable);

    function Func(fn) {
        _classCallCheck(this, Func);

        var _this = _possibleConstructorReturn(this, (Func.__proto__ || Object.getPrototypeOf(Func)).call(this));

        (0, _beof2.default)({ fn: fn }).function();

        _this._fn = fn;

        return _this;
    }

    _createClass(Func, [{
        key: 'apply',
        value: function apply(value) {

            return this._fn(value);
        }
    }]);

    return Func;
}(_Chainable3.default);

exports.default = Func;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVjb25kaXRpb25zL0Z1bmMuanMiXSwibmFtZXMiOlsiRnVuYyIsImZuIiwiZnVuY3Rpb24iLCJfZm4iLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7OztJQUlNQSxJOzs7QUFFRixrQkFBWUMsRUFBWixFQUFnQjtBQUFBOztBQUFBOztBQUlaLDRCQUFLLEVBQUVBLE1BQUYsRUFBTCxFQUFhQyxRQUFiOztBQUVBLGNBQUtDLEdBQUwsR0FBV0YsRUFBWDs7QUFOWTtBQVFmOzs7OzhCQUVLRyxLLEVBQU87O0FBRVQsbUJBQU8sS0FBS0QsR0FBTCxDQUFTQyxLQUFULENBQVA7QUFFSDs7Ozs7O2tCQUlVSixJIiwiZmlsZSI6IkZ1bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBDaGFpbmFibGUgZnJvbSAnLi9DaGFpbmFibGUnO1xuXG4vKipcbiAqIEZ1bmMgd3JhcHMgYSBmdW5jdGlvbiBzbyBpdCBjYW4gYmUgdHJlYXRlZCBhcyBhIGNoYWluYWJsZSBQcmVjb25kaXRpb24uXG4gKiBAcGFyYW0ge2Z1bmN0aW9uPG51bGx8ZXJyb3I+fSBmblxuICovXG5jbGFzcyBGdW5jIGV4dGVuZHMgQ2hhaW5hYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKGZuKSB7XG5cbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBiZW9mKHsgZm4gfSkuZnVuY3Rpb24oKTtcblxuICAgICAgICB0aGlzLl9mbiA9IGZuO1xuXG4gICAgfVxuXG4gICAgYXBwbHkodmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZm4odmFsdWUpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEZ1bmNcbiJdfQ==