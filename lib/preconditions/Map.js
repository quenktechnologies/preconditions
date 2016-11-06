'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Chainable2 = require('./Chainable');

var _Chainable3 = _interopRequireDefault(_Chainable2);

var _MapError = require('./MapError');

var _MapError2 = _interopRequireDefault(_MapError);

var _Utils = require('../Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Map
 * @param {Object.<string, Precondition>} [schema=null]
 */
var Map = function (_Chainable) {
    _inherits(Map, _Chainable);

    function Map() {
        var schema = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        _classCallCheck(this, Map);

        var _this = _possibleConstructorReturn(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this));

        if (schema) _Utils2.default.merge(schema, _this, 'apply');

        return _this;
    }

    _createClass(Map, [{
        key: 'apply',
        value: function apply(value) {
            var _this2 = this;

            (0, _beof2.default)({ value: value }).object();

            var ok = true;
            var errors = {};
            var result;
            var values = {};

            Object.keys(this).forEach(function (k) {

                if (typeof _this2[k] === 'function') return;

                result = _this2[k].apply(value[k]);

                if (result instanceof Error) {

                    result.key = k;
                    errors[k] = result;
                    ok = false;
                } else if (result != null) {

                    values[k] = result;
                }
            });

            return ok ? values : new _MapError2.default(errors, value);
        }
    }]);

    return Map;
}(_Chainable3.default);

exports.default = Map;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVjb25kaXRpb25zL01hcC5qcyJdLCJuYW1lcyI6WyJNYXAiLCJzY2hlbWEiLCJtZXJnZSIsInZhbHVlIiwib2JqZWN0Iiwib2siLCJlcnJvcnMiLCJyZXN1bHQiLCJ2YWx1ZXMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImsiLCJhcHBseSIsIkVycm9yIiwia2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7OztJQUlNQSxHOzs7QUFFRixtQkFBMkI7QUFBQSxZQUFmQyxNQUFlLHlEQUFOLElBQU07O0FBQUE7O0FBQUE7O0FBSXZCLFlBQUlBLE1BQUosRUFDSSxnQkFBTUMsS0FBTixDQUFZRCxNQUFaLFNBQTBCLE9BQTFCOztBQUxtQjtBQU8xQjs7Ozs4QkFFS0UsSyxFQUFPO0FBQUE7O0FBRVQsZ0NBQUssRUFBRUEsWUFBRixFQUFMLEVBQWdCQyxNQUFoQjs7QUFFQSxnQkFBSUMsS0FBSyxJQUFUO0FBQ0EsZ0JBQUlDLFNBQVMsRUFBYjtBQUNBLGdCQUFJQyxNQUFKO0FBQ0EsZ0JBQUlDLFNBQVMsRUFBYjs7QUFFQUMsbUJBQU9DLElBQVAsQ0FBWSxJQUFaLEVBQWtCQyxPQUFsQixDQUEwQixhQUFLOztBQUUzQixvQkFBSSxPQUFPLE9BQUtDLENBQUwsQ0FBUCxLQUFtQixVQUF2QixFQUFtQzs7QUFFbkNMLHlCQUFTLE9BQUtLLENBQUwsRUFBUUMsS0FBUixDQUFjVixNQUFNUyxDQUFOLENBQWQsQ0FBVDs7QUFFQSxvQkFBSUwsa0JBQWtCTyxLQUF0QixFQUE2Qjs7QUFFekJQLDJCQUFPUSxHQUFQLEdBQWFILENBQWI7QUFDQU4sMkJBQU9NLENBQVAsSUFBWUwsTUFBWjtBQUNBRix5QkFBSyxLQUFMO0FBRUgsaUJBTkQsTUFNTyxJQUFHRSxVQUFVLElBQWIsRUFBbUI7O0FBRXRCQywyQkFBT0ksQ0FBUCxJQUFZTCxNQUFaO0FBRUg7QUFFSixhQWxCRDs7QUFvQkEsbUJBQVFGLEVBQUQsR0FBT0csTUFBUCxHQUFnQix1QkFBYUYsTUFBYixFQUFxQkgsS0FBckIsQ0FBdkI7QUFFSDs7Ozs7O2tCQUlVSCxHIiwiZmlsZSI6Ik1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IENoYWluYWJsZSBmcm9tICcuL0NoYWluYWJsZSc7XG5pbXBvcnQgTWFwRXJyb3IgZnJvbSAnLi9NYXBFcnJvcic7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vVXRpbHMnO1xuXG4vKipcbiAqIE1hcFxuICogQHBhcmFtIHtPYmplY3QuPHN0cmluZywgUHJlY29uZGl0aW9uPn0gW3NjaGVtYT1udWxsXVxuICovXG5jbGFzcyBNYXAgZXh0ZW5kcyBDaGFpbmFibGUge1xuXG4gICAgY29uc3RydWN0b3Ioc2NoZW1hID0gbnVsbCkge1xuXG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgaWYgKHNjaGVtYSlcbiAgICAgICAgICAgIFV0aWxzLm1lcmdlKHNjaGVtYSwgdGhpcywgJ2FwcGx5Jyk7XG5cbiAgICB9XG5cbiAgICBhcHBseSh2YWx1ZSkge1xuXG4gICAgICAgIGJlb2YoeyB2YWx1ZSB9KS5vYmplY3QoKTtcblxuICAgICAgICB2YXIgb2sgPSB0cnVlO1xuICAgICAgICB2YXIgZXJyb3JzID0ge307XG4gICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgIHZhciB2YWx1ZXMgPSB7fTtcblxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzKS5mb3JFYWNoKGsgPT4ge1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNba10gPT09ICdmdW5jdGlvbicpIHJldHVybjtcblxuICAgICAgICAgICAgcmVzdWx0ID0gdGhpc1trXS5hcHBseSh2YWx1ZVtrXSk7XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBFcnJvcikge1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0LmtleSA9IGs7XG4gICAgICAgICAgICAgICAgZXJyb3JzW2tdID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIG9rID0gZmFsc2U7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZihyZXN1bHQgIT0gbnVsbCkge1xuXG4gICAgICAgICAgICAgICAgdmFsdWVzW2tdID0gcmVzdWx0O1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIChvaykgPyB2YWx1ZXMgOiBuZXcgTWFwRXJyb3IoZXJyb3JzLCB2YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwXG4iXX0=