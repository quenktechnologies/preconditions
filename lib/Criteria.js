'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _criteriaPatternCore = require('criteria-pattern-core');

var core = _interopRequireWildcard(_criteriaPatternCore);

var _Satisfaction = require('./Satisfaction');

var _Satisfaction2 = _interopRequireDefault(_Satisfaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function merge(that, o) {

    Object.keys(o).forEach(function (key) {

        Object.defineProperty(that, key, {
            configurable: false,
            enumerable: true,
            value: o[key]
        });
    });
}

/**
 * Criteria represents a set of Criterion that will be applied to 
 * the keys of an object (map).
 *
 * @param {object} schema
 * @property {object} messages
 */

var Criteria = function (_core$Criterion) {
    _inherits(Criteria, _core$Criterion);

    function Criteria() {
        var schema = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
        var messages = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, Criteria);

        var _this = _possibleConstructorReturn(this, (Criteria.__proto__ || Object.getPrototypeOf(Criteria)).call(this));

        if (schema) merge(_this, schema);

        Object.defineProperty(_this, '_messages', {
            enumerable: false,
            configurable: false,
            value: messages
        });

        Object.defineProperty(_this, '_strategy', {
            enumerable: false,
            configurable: false,
            value: new _Satisfaction2.default(messages)
        });

        return _this;
    }

    _createClass(Criteria, [{
        key: 'satisfy',
        value: function satisfy(value) {

            return this._strategy.apply(value, this);
        }
    }]);

    return Criteria;
}(core.Criterion);

exports.default = Criteria;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Dcml0ZXJpYS5qcyJdLCJuYW1lcyI6WyJjb3JlIiwibWVyZ2UiLCJ0aGF0IiwibyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwiZGVmaW5lUHJvcGVydHkiLCJjb25maWd1cmFibGUiLCJlbnVtZXJhYmxlIiwidmFsdWUiLCJDcml0ZXJpYSIsInNjaGVtYSIsIm1lc3NhZ2VzIiwiX3N0cmF0ZWd5IiwiYXBwbHkiLCJDcml0ZXJpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0lBQVlBLEk7O0FBQ1o7Ozs7Ozs7Ozs7Ozs7O0FBRUEsU0FBU0MsS0FBVCxDQUFlQyxJQUFmLEVBQXFCQyxDQUFyQixFQUF3Qjs7QUFFcEJDLFdBQU9DLElBQVAsQ0FBWUYsQ0FBWixFQUFlRyxPQUFmLENBQXVCLFVBQVNDLEdBQVQsRUFBYzs7QUFFakNILGVBQU9JLGNBQVAsQ0FBc0JOLElBQXRCLEVBQTRCSyxHQUE1QixFQUFpQztBQUM3QkUsMEJBQWMsS0FEZTtBQUU3QkMsd0JBQVksSUFGaUI7QUFHN0JDLG1CQUFPUixFQUFFSSxHQUFGO0FBSHNCLFNBQWpDO0FBTUgsS0FSRDtBQVVIOztBQUVEOzs7Ozs7OztJQU9NSyxROzs7QUFFRix3QkFBMEM7QUFBQSxZQUE5QkMsTUFBOEIseURBQXJCLElBQXFCO0FBQUEsWUFBZkMsUUFBZSx5REFBSixFQUFJOztBQUFBOztBQUFBOztBQUl0QyxZQUFJRCxNQUFKLEVBQ0laLGFBQVlZLE1BQVo7O0FBRUpULGVBQU9JLGNBQVAsUUFBNEIsV0FBNUIsRUFBeUM7QUFDckNFLHdCQUFZLEtBRHlCO0FBRXJDRCwwQkFBYyxLQUZ1QjtBQUdyQ0UsbUJBQU9HO0FBSDhCLFNBQXpDOztBQU1BVixlQUFPSSxjQUFQLFFBQTRCLFdBQTVCLEVBQXlDO0FBQ3JDRSx3QkFBWSxLQUR5QjtBQUVyQ0QsMEJBQWMsS0FGdUI7QUFHckNFLG1CQUFPLDJCQUFpQkcsUUFBakI7QUFIOEIsU0FBekM7O0FBYnNDO0FBbUJ6Qzs7OztnQ0FFT0gsSyxFQUFPOztBQUVYLG1CQUFPLEtBQUtJLFNBQUwsQ0FBZUMsS0FBZixDQUFxQkwsS0FBckIsRUFBNEIsSUFBNUIsQ0FBUDtBQUVIOzs7O0VBM0JrQlgsS0FBS2lCLFM7O2tCQStCYkwsUSIsImZpbGUiOiJDcml0ZXJpYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvcmUgZnJvbSAnY3JpdGVyaWEtcGF0dGVybi1jb3JlJztcbmltcG9ydCBTYXRpc2ZhY3Rpb24gZnJvbSAnLi9TYXRpc2ZhY3Rpb24nO1xuXG5mdW5jdGlvbiBtZXJnZSh0aGF0LCBvKSB7XG5cbiAgICBPYmplY3Qua2V5cyhvKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGF0LCBrZXksIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IG9ba2V5XVxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG59XG5cbi8qKlxuICogQ3JpdGVyaWEgcmVwcmVzZW50cyBhIHNldCBvZiBDcml0ZXJpb24gdGhhdCB3aWxsIGJlIGFwcGxpZWQgdG8gXG4gKiB0aGUga2V5cyBvZiBhbiBvYmplY3QgKG1hcCkuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHNjaGVtYVxuICogQHByb3BlcnR5IHtvYmplY3R9IG1lc3NhZ2VzXG4gKi9cbmNsYXNzIENyaXRlcmlhIGV4dGVuZHMgY29yZS5Dcml0ZXJpb24ge1xuXG4gICAgY29uc3RydWN0b3Ioc2NoZW1hID0gbnVsbCwgbWVzc2FnZXMgPSB7fSkge1xuXG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgaWYgKHNjaGVtYSlcbiAgICAgICAgICAgIG1lcmdlKHRoaXMsIHNjaGVtYSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfbWVzc2FnZXMnLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZTogbWVzc2FnZXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfc3RyYXRlZ3knLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZTogbmV3IFNhdGlzZmFjdGlvbihtZXNzYWdlcylcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBzYXRpc2Z5KHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0cmF0ZWd5LmFwcGx5KHZhbHVlLCB0aGlzKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBDcml0ZXJpYVxuIl19