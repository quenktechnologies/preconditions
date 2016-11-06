'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Func2 = require('./Func');

var _Func3 = _interopRequireDefault(_Func2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * AsyncFunc is the async version of Func.
 */
var AsyncFunc = function (_Func) {
    _inherits(AsyncFunc, _Func);

    function AsyncFunc() {
        _classCallCheck(this, AsyncFunc);

        return _possibleConstructorReturn(this, (AsyncFunc.__proto__ || Object.getPrototypeOf(AsyncFunc)).apply(this, arguments));
    }

    _createClass(AsyncFunc, [{
        key: 'apply',
        value: function apply(value) {

            return _bluebird2.default.resolve(_get(AsyncFunc.prototype.__proto__ || Object.getPrototypeOf(AsyncFunc.prototype), 'apply', this).call(this, value));
        }
    }]);

    return AsyncFunc;
}(_Func3.default);

exports.default = AsyncFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVjb25kaXRpb25zL0FzeW5jRnVuYy5qcyJdLCJuYW1lcyI6WyJBc3luY0Z1bmMiLCJ2YWx1ZSIsInJlc29sdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR01BLFM7Ozs7Ozs7Ozs7OzhCQUVJQyxLLEVBQU87O0FBRVQsbUJBQU8sbUJBQVFDLE9BQVIsNkdBQTRCRCxLQUE1QixFQUFQO0FBRUg7Ozs7OztrQkFJVUQsUyIsImZpbGUiOiJBc3luY0Z1bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgRnVuYyBmcm9tICcuL0Z1bmMnO1xuXG4vKipcbiAqIEFzeW5jRnVuYyBpcyB0aGUgYXN5bmMgdmVyc2lvbiBvZiBGdW5jLlxuICovXG5jbGFzcyBBc3luY0Z1bmMgZXh0ZW5kcyBGdW5jIHtcblxuICAgIGFwcGx5KHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShzdXBlci5hcHBseSh2YWx1ZSkpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEFzeW5jRnVuY1xuIl19