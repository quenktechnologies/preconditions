'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Map2 = require('./Map');

var _Map3 = _interopRequireDefault(_Map2);

var _MapError = require('./MapError');

var _MapError2 = _interopRequireDefault(_MapError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * AsyncMap is the async version of Map.
 * @param {Object.<string, AsyncTransform>} [schema=null]
 */
var AsyncMap = function (_Map) {
    _inherits(AsyncMap, _Map);

    function AsyncMap() {
        _classCallCheck(this, AsyncMap);

        return _possibleConstructorReturn(this, (AsyncMap.__proto__ || Object.getPrototypeOf(AsyncMap)).apply(this, arguments));
    }

    _createClass(AsyncMap, [{
        key: 'apply',
        value: function apply(value) {
            var _this2 = this;

            (0, _beof2.default)({ value: value }).object();

            var ok = true;
            var errors = {};
            var work = Object.keys(this).filter(function (k) {
                return typeof _this2[k] !== 'function';
            });
            var values = {};

            return _bluebird2.default.all(work.map(function (k) {
                return _this2[k].apply(value[k]).then(function (result) {

                    if (result instanceof Error) {
                        result.key = k;
                        errors[k] = result;
                        ok = false;
                    } else if (result != null) {

                        values[k] = result;
                    }
                });
            })).then(function (result) {
                return ok ? values : new _MapError2.default(errors);
            });
        }
    }]);

    return AsyncMap;
}(_Map3.default);

exports.default = AsyncMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVjb25kaXRpb25zL0FzeW5jTWFwLmpzIl0sIm5hbWVzIjpbIkFzeW5jTWFwIiwidmFsdWUiLCJvYmplY3QiLCJvayIsImVycm9ycyIsIndvcmsiLCJPYmplY3QiLCJrZXlzIiwiZmlsdGVyIiwiayIsInZhbHVlcyIsImFsbCIsIm1hcCIsImFwcGx5IiwidGhlbiIsInJlc3VsdCIsIkVycm9yIiwia2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7OztJQUlNQSxROzs7Ozs7Ozs7Ozs4QkFFSUMsSyxFQUFPO0FBQUE7O0FBRVQsZ0NBQUssRUFBRUEsWUFBRixFQUFMLEVBQWdCQyxNQUFoQjs7QUFFQSxnQkFBSUMsS0FBSyxJQUFUO0FBQ0EsZ0JBQUlDLFNBQVMsRUFBYjtBQUNBLGdCQUFJQyxPQUFPQyxPQUFPQyxJQUFQLENBQVksSUFBWixFQUFrQkMsTUFBbEIsQ0FBeUI7QUFBQSx1QkFBSyxPQUFPLE9BQUtDLENBQUwsQ0FBUCxLQUFtQixVQUF4QjtBQUFBLGFBQXpCLENBQVg7QUFDQSxnQkFBSUMsU0FBUyxFQUFiOztBQUVBLG1CQUFPLG1CQUFRQyxHQUFSLENBQ0hOLEtBQUtPLEdBQUwsQ0FBUztBQUFBLHVCQUNMLE9BQUtILENBQUwsRUFBUUksS0FBUixDQUFjWixNQUFNUSxDQUFOLENBQWQsRUFBd0JLLElBQXhCLENBQTZCLGtCQUFVOztBQUVuQyx3QkFBSUMsa0JBQWtCQyxLQUF0QixFQUE2QjtBQUN6QkQsK0JBQU9FLEdBQVAsR0FBYVIsQ0FBYjtBQUNBTCwrQkFBT0ssQ0FBUCxJQUFZTSxNQUFaO0FBQ0FaLDZCQUFLLEtBQUw7QUFDSCxxQkFKRCxNQUlPLElBQUlZLFVBQVUsSUFBZCxFQUFvQjs7QUFFdkJMLCtCQUFPRCxDQUFQLElBQVlNLE1BQVo7QUFFSDtBQUVKLGlCQVpELENBREs7QUFBQSxhQUFULENBREcsRUFlUEQsSUFmTyxDQWVGO0FBQUEsdUJBQVdYLEVBQUQsR0FBT08sTUFBUCxHQUFnQix1QkFBYU4sTUFBYixDQUExQjtBQUFBLGFBZkUsQ0FBUDtBQWlCSDs7Ozs7O2tCQUlVSixRIiwiZmlsZSI6IkFzeW5jTWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgTWFwIGZyb20gJy4vTWFwJztcbmltcG9ydCBNYXBFcnJvciBmcm9tICcuL01hcEVycm9yJztcblxuLyoqXG4gKiBBc3luY01hcCBpcyB0aGUgYXN5bmMgdmVyc2lvbiBvZiBNYXAuXG4gKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCBBc3luY1RyYW5zZm9ybT59IFtzY2hlbWE9bnVsbF1cbiAqL1xuY2xhc3MgQXN5bmNNYXAgZXh0ZW5kcyBNYXAge1xuXG4gICAgYXBwbHkodmFsdWUpIHtcblxuICAgICAgICBiZW9mKHsgdmFsdWUgfSkub2JqZWN0KCk7XG5cbiAgICAgICAgdmFyIG9rID0gdHJ1ZTtcbiAgICAgICAgdmFyIGVycm9ycyA9IHt9O1xuICAgICAgICB2YXIgd29yayA9IE9iamVjdC5rZXlzKHRoaXMpLmZpbHRlcihrID0+IHR5cGVvZiB0aGlzW2tdICE9PSAnZnVuY3Rpb24nKTtcbiAgICAgICAgdmFyIHZhbHVlcyA9IHt9O1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIHdvcmsubWFwKGsgPT5cbiAgICAgICAgICAgICAgICB0aGlzW2tdLmFwcGx5KHZhbHVlW2tdKS50aGVuKHJlc3VsdCA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQua2V5ID0gaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yc1trXSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9rID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ICE9IG51bGwpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW2tdID0gcmVzdWx0O1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pKSkuXG4gICAgICAgIHRoZW4ocmVzdWx0ID0+IChvaykgPyB2YWx1ZXMgOiBuZXcgTWFwRXJyb3IoZXJyb3JzKSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXN5bmNNYXBcbiJdfQ==