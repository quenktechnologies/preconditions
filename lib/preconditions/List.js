'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _MapError = require('./MapError');

var _MapError2 = _interopRequireDefault(_MapError);

var _Precondition = require('./Precondition');

var _Precondition2 = _interopRequireDefault(_Precondition);

var _Chainable2 = require('./Chainable');

var _Chainable3 = _interopRequireDefault(_Chainable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * List applies a precondition to an array of items.
 * @param {Precondition} precondition
 */
var List = function (_Chainable) {
    _inherits(List, _Chainable);

    function List(precondition) {
        _classCallCheck(this, List);

        var _this = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this));

        (0, _beof2.default)({ precondition: precondition }).interface(_Precondition2.default);

        _this.precondition = precondition;

        return _this;
    }

    _createClass(List, [{
        key: 'apply',
        value: function apply(value) {
            var _this2 = this;

            (0, _beof2.default)({ value: value }).array();

            var errors = {};
            var ok = true;
            var result;
            var values = [];

            value.forEach(function (v, i) {

                result = _this2.precondition.apply(v);

                if (result instanceof Error) {

                    errors[i] = result;
                    ok = false;
                } else {

                    values.push(result);
                }
            });

            return ok ? values : new _MapError2.default(errors);
        }
    }]);

    return List;
}(_Chainable3.default);

exports.default = List;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVjb25kaXRpb25zL0xpc3QuanMiXSwibmFtZXMiOlsiTGlzdCIsInByZWNvbmRpdGlvbiIsImludGVyZmFjZSIsInZhbHVlIiwiYXJyYXkiLCJlcnJvcnMiLCJvayIsInJlc3VsdCIsInZhbHVlcyIsImZvckVhY2giLCJ2IiwiaSIsImFwcGx5IiwiRXJyb3IiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7OztJQUlNQSxJOzs7QUFFRixrQkFBWUMsWUFBWixFQUEwQjtBQUFBOztBQUFBOztBQUl0Qiw0QkFBSyxFQUFFQSwwQkFBRixFQUFMLEVBQXVCQyxTQUF2Qjs7QUFFQSxjQUFLRCxZQUFMLEdBQW9CQSxZQUFwQjs7QUFOc0I7QUFRekI7Ozs7OEJBRUtFLEssRUFBTztBQUFBOztBQUVULGdDQUFLLEVBQUVBLFlBQUYsRUFBTCxFQUFnQkMsS0FBaEI7O0FBRUEsZ0JBQUlDLFNBQVMsRUFBYjtBQUNBLGdCQUFJQyxLQUFLLElBQVQ7QUFDQSxnQkFBSUMsTUFBSjtBQUNBLGdCQUFJQyxTQUFTLEVBQWI7O0FBRUFMLGtCQUFNTSxPQUFOLENBQWMsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKLEVBQVU7O0FBRXBCSix5QkFBUyxPQUFLTixZQUFMLENBQWtCVyxLQUFsQixDQUF3QkYsQ0FBeEIsQ0FBVDs7QUFFQSxvQkFBSUgsa0JBQWtCTSxLQUF0QixFQUE2Qjs7QUFFekJSLDJCQUFPTSxDQUFQLElBQVlKLE1BQVo7QUFDQUQseUJBQUssS0FBTDtBQUVILGlCQUxELE1BS087O0FBRUhFLDJCQUFPTSxJQUFQLENBQVlQLE1BQVo7QUFFSDtBQUVKLGFBZkQ7O0FBaUJBLG1CQUFPRCxLQUFLRSxNQUFMLEdBQWMsdUJBQWFILE1BQWIsQ0FBckI7QUFFSDs7Ozs7O2tCQUlVTCxJIiwiZmlsZSI6Ikxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBNYXBFcnJvciBmcm9tICcuL01hcEVycm9yJztcbmltcG9ydCBQcmVjb25kaXRpb24gZnJvbSAnLi9QcmVjb25kaXRpb24nO1xuaW1wb3J0IENoYWluYWJsZSBmcm9tICcuL0NoYWluYWJsZSc7XG5cbi8qKlxuICogTGlzdCBhcHBsaWVzIGEgcHJlY29uZGl0aW9uIHRvIGFuIGFycmF5IG9mIGl0ZW1zLlxuICogQHBhcmFtIHtQcmVjb25kaXRpb259IHByZWNvbmRpdGlvblxuICovXG5jbGFzcyBMaXN0IGV4dGVuZHMgQ2hhaW5hYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByZWNvbmRpdGlvbikge1xuXG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgYmVvZih7IHByZWNvbmRpdGlvbiB9KS5pbnRlcmZhY2UoUHJlY29uZGl0aW9uKTtcblxuICAgICAgICB0aGlzLnByZWNvbmRpdGlvbiA9IHByZWNvbmRpdGlvbjtcblxuICAgIH1cblxuICAgIGFwcGx5KHZhbHVlKSB7XG5cbiAgICAgICAgYmVvZih7IHZhbHVlIH0pLmFycmF5KCk7XG5cbiAgICAgICAgdmFyIGVycm9ycyA9IHt9O1xuICAgICAgICB2YXIgb2sgPSB0cnVlO1xuICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICB2YXIgdmFsdWVzID0gW107XG5cbiAgICAgICAgdmFsdWUuZm9yRWFjaCgodiwgaSkgPT4ge1xuXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLnByZWNvbmRpdGlvbi5hcHBseSh2KTtcblxuICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7XG5cbiAgICAgICAgICAgICAgICBlcnJvcnNbaV0gPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgb2sgPSBmYWxzZTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHJlc3VsdCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gb2sgPyB2YWx1ZXMgOiBuZXcgTWFwRXJyb3IoZXJyb3JzKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBMaXN0XG4iXX0=