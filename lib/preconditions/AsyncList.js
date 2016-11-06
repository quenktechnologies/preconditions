'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _List2 = require('./List');

var _List3 = _interopRequireDefault(_List2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * AsyncList is the async version of List.
 */
var AsyncList = function (_List) {
    _inherits(AsyncList, _List);

    function AsyncList() {
        _classCallCheck(this, AsyncList);

        return _possibleConstructorReturn(this, (AsyncList.__proto__ || Object.getPrototypeOf(AsyncList)).apply(this, arguments));
    }

    _createClass(AsyncList, [{
        key: 'apply',
        value: function apply(value) {
            var _this2 = this;

            (0, _beof2.default)({ value: value }).array();

            var errors = {};
            var ok = true;
            var result;
            var values = [];

            return _bluebird2.default.all(value.map(function (v, i) {
                return _this2.precondition.apply(v).then(function (result) {

                    if (result instanceof Error) {

                        errors[i] = result;
                        ok = false;
                    } else {

                        return result;
                    }
                });
            })).then(function (results) {
                return ok ? results : new MapError(errors);
            });
        }
    }]);

    return AsyncList;
}(_List3.default);

exports.default = AsyncList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVjb25kaXRpb25zL0FzeW5jTGlzdC5qcyJdLCJuYW1lcyI6WyJBc3luY0xpc3QiLCJ2YWx1ZSIsImFycmF5IiwiZXJyb3JzIiwib2siLCJyZXN1bHQiLCJ2YWx1ZXMiLCJhbGwiLCJtYXAiLCJ2IiwiaSIsInByZWNvbmRpdGlvbiIsImFwcGx5IiwidGhlbiIsIkVycm9yIiwicmVzdWx0cyIsIk1hcEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdNQSxTOzs7Ozs7Ozs7Ozs4QkFFSUMsSyxFQUFPO0FBQUE7O0FBRVQsZ0NBQUssRUFBRUEsWUFBRixFQUFMLEVBQWdCQyxLQUFoQjs7QUFFQSxnQkFBSUMsU0FBUyxFQUFiO0FBQ0EsZ0JBQUlDLEtBQUssSUFBVDtBQUNBLGdCQUFJQyxNQUFKO0FBQ0EsZ0JBQUlDLFNBQVMsRUFBYjs7QUFFQSxtQkFBTyxtQkFBUUMsR0FBUixDQUNITixNQUFNTyxHQUFOLENBQVUsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsdUJBQVUsT0FBS0MsWUFBTCxDQUFrQkMsS0FBbEIsQ0FBd0JILENBQXhCLEVBQTJCSSxJQUEzQixDQUFnQyxrQkFBVTs7QUFFMUQsd0JBQUlSLGtCQUFrQlMsS0FBdEIsRUFBNkI7O0FBRXpCWCwrQkFBT08sQ0FBUCxJQUFZTCxNQUFaO0FBQ0FELDZCQUFLLEtBQUw7QUFFSCxxQkFMRCxNQUtPOztBQUVILCtCQUFPQyxNQUFQO0FBRUg7QUFFSixpQkFibUIsQ0FBVjtBQUFBLGFBQVYsQ0FERyxFQWNFUSxJQWRGLENBY087QUFBQSx1QkFBV1QsS0FBS1csT0FBTCxHQUFlLElBQUlDLFFBQUosQ0FBYWIsTUFBYixDQUExQjtBQUFBLGFBZFAsQ0FBUDtBQWdCSDs7Ozs7O2tCQUlVSCxTIiwiZmlsZSI6IkFzeW5jTGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IExpc3QgZnJvbSAnLi9MaXN0JztcblxuLyoqXG4gKiBBc3luY0xpc3QgaXMgdGhlIGFzeW5jIHZlcnNpb24gb2YgTGlzdC5cbiAqL1xuY2xhc3MgQXN5bmNMaXN0IGV4dGVuZHMgTGlzdCB7XG5cbiAgICBhcHBseSh2YWx1ZSkge1xuXG4gICAgICAgIGJlb2YoeyB2YWx1ZSB9KS5hcnJheSgpO1xuXG4gICAgICAgIHZhciBlcnJvcnMgPSB7fTtcbiAgICAgICAgdmFyIG9rID0gdHJ1ZTtcbiAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIHZhbHVlLm1hcCgodiwgaSkgPT4gdGhpcy5wcmVjb25kaXRpb24uYXBwbHkodikudGhlbihyZXN1bHQgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzW2ldID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICBvayA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KSkpLnRoZW4ocmVzdWx0cyA9PiBvayA/IHJlc3VsdHMgOiBuZXcgTWFwRXJyb3IoZXJyb3JzKSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXN5bmNMaXN0XG4iXX0=