'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _AsyncChainable2 = require('./AsyncChainable');

var _AsyncChainable3 = _interopRequireDefault(_AsyncChainable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * AsyncAdapter allows a synchronous Predicate to be chained to an
 * asynchronous one. The synchrounous one is executed via bluebird's
 * Promise.try.
 * @param {Predicate} sync
 * @param {AsyncPredicate} async
 */
var AsyncAdapter = function (_AsyncChainable) {
    _inherits(AsyncAdapter, _AsyncChainable);

    function AsyncAdapter(sync, async) {
        _classCallCheck(this, AsyncAdapter);

        var _this = _possibleConstructorReturn(this, (AsyncAdapter.__proto__ || Object.getPrototypeOf(AsyncAdapter)).call(this));

        _this._sync = sync;
        _this._async = async;

        return _this;
    }

    _createClass(AsyncAdapter, [{
        key: 'apply',
        value: function apply(value) {
            var _this2 = this;

            return _bluebird2.default.try(function () {
                return _this2._sync.apply(value);
            }).then(function (result) {
                return result instanceof Error ? result : _this2._async.apply(value);
            });
        }
    }]);

    return AsyncAdapter;
}(_AsyncChainable3.default);

exports.default = AsyncAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVjb25kaXRpb25zL0FzeW5jQWRhcHRlci5qcyJdLCJuYW1lcyI6WyJBc3luY0FkYXB0ZXIiLCJzeW5jIiwiYXN5bmMiLCJfc3luYyIsIl9hc3luYyIsInZhbHVlIiwidHJ5IiwiYXBwbHkiLCJ0aGVuIiwicmVzdWx0IiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7OztJQU9NQSxZOzs7QUFFRiwwQkFBWUMsSUFBWixFQUFrQkMsS0FBbEIsRUFBeUI7QUFBQTs7QUFBQTs7QUFJckIsY0FBS0MsS0FBTCxHQUFhRixJQUFiO0FBQ0EsY0FBS0csTUFBTCxHQUFjRixLQUFkOztBQUxxQjtBQU94Qjs7Ozs4QkFFS0csSyxFQUFPO0FBQUE7O0FBRVQsbUJBQU8sbUJBQVFDLEdBQVIsQ0FBWTtBQUFBLHVCQUFNLE9BQUtILEtBQUwsQ0FBV0ksS0FBWCxDQUFpQkYsS0FBakIsQ0FBTjtBQUFBLGFBQVosRUFDUEcsSUFETyxDQUNGO0FBQUEsdUJBQVVDLGtCQUFrQkMsS0FBbEIsR0FBMEJELE1BQTFCLEdBQW1DLE9BQUtMLE1BQUwsQ0FBWUcsS0FBWixDQUFrQkYsS0FBbEIsQ0FBN0M7QUFBQSxhQURFLENBQVA7QUFHSDs7Ozs7O2tCQUlVTCxZIiwiZmlsZSI6IkFzeW5jQWRhcHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IEFzeW5jQ2hhaW5hYmxlIGZyb20gJy4vQXN5bmNDaGFpbmFibGUnO1xuXG4vKipcbiAqIEFzeW5jQWRhcHRlciBhbGxvd3MgYSBzeW5jaHJvbm91cyBQcmVkaWNhdGUgdG8gYmUgY2hhaW5lZCB0byBhblxuICogYXN5bmNocm9ub3VzIG9uZS4gVGhlIHN5bmNocm91bm91cyBvbmUgaXMgZXhlY3V0ZWQgdmlhIGJsdWViaXJkJ3NcbiAqIFByb21pc2UudHJ5LlxuICogQHBhcmFtIHtQcmVkaWNhdGV9IHN5bmNcbiAqIEBwYXJhbSB7QXN5bmNQcmVkaWNhdGV9IGFzeW5jXG4gKi9cbmNsYXNzIEFzeW5jQWRhcHRlciBleHRlbmRzIEFzeW5jQ2hhaW5hYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKHN5bmMsIGFzeW5jKSB7XG5cbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLl9zeW5jID0gc3luYztcbiAgICAgICAgdGhpcy5fYXN5bmMgPSBhc3luYztcblxuICAgIH1cblxuICAgIGFwcGx5KHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UudHJ5KCgpID0+IHRoaXMuX3N5bmMuYXBwbHkodmFsdWUpKS5cbiAgICAgICAgdGhlbihyZXN1bHQgPT4gcmVzdWx0IGluc3RhbmNlb2YgRXJyb3IgPyByZXN1bHQgOiB0aGlzLl9hc3luYy5hcHBseSh2YWx1ZSkpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEFzeW5jQWRhcHRlclxuIl19