'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SyncAdapter = exports.AsyncOr = exports.AsyncAnd = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _AsyncPrecondition = require('./AsyncPrecondition');

var _AsyncPrecondition2 = _interopRequireDefault(_AsyncPrecondition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* jshint ignore:start */

/**
 * AsyncChainable is the async version of Chainable.
 * @abstract
 * @implements {AsyncPrecondition}
 */
var AsyncChainable = function () {
    function AsyncChainable() {
        _classCallCheck(this, AsyncChainable);
    }

    _createClass(AsyncChainable, [{
        key: 'and',


        /**
         * and
         * @param {AsyncPrecondition} right
         * @returns {AsyncAnd}
         */
        value: function and(right) {

            return new AsyncAnd(this, right);
        }

        /**
         * or
         * @param {AsyncPrecondition} right
         * @returns {AsyncOr}
         */

    }, {
        key: 'or',
        value: function or(right) {

            return new AsyncOr(this, right);
        }

        /**
         * sync adapts the sync api to become async
         * @param {AsyncPrecondition} predicate
         * @return {AsyncChainable}
         */

    }, {
        key: 'sync',
        value: function sync(predicate) {

            return new SyncAdapter(this, predicate);
        }
    }, {
        key: 'apply',
        value: function apply() {

            throw new ReferenceError('AsyncChainable.apply() was not implemented!');
        }
    }]);

    return AsyncChainable;
}();

/* jshint ignore:end */

/**
 * AsyncAnd is the async version of And.
 * @param {AsyncPrecondition} left
 * @param {AsyncPrecondition} right
 */


var AsyncAnd = function (_AsyncChainable) {
    _inherits(AsyncAnd, _AsyncChainable);

    function AsyncAnd(left, right) {
        _classCallCheck(this, AsyncAnd);

        var _this = _possibleConstructorReturn(this, (AsyncAnd.__proto__ || Object.getPrototypeOf(AsyncAnd)).call(this));

        _this._left = left;
        _this._right = right;

        return _this;
    }

    _createClass(AsyncAnd, [{
        key: 'apply',
        value: function apply(value) {
            var _this2 = this;

            return this._left.apply(value).then(function (result) {
                return result instanceof Error ? result : _this2._right.apply(value);
            });
        }
    }]);

    return AsyncAnd;
}(AsyncChainable);

/**
 * AsyncOr executes the left AsyncPrecondition first then right only if the result of the left is not ok.
 * @param {AsyncPrecondition} left
 * @param {AsyncPrecondition} right
 *
 */


var AsyncOr = function (_AsyncChainable2) {
    _inherits(AsyncOr, _AsyncChainable2);

    function AsyncOr(left, right) {
        _classCallCheck(this, AsyncOr);

        var _this3 = _possibleConstructorReturn(this, (AsyncOr.__proto__ || Object.getPrototypeOf(AsyncOr)).call(this));

        _this3._left = left;
        _this3._right = right;

        return _this3;
    }

    _createClass(AsyncOr, [{
        key: 'apply',
        value: function apply(value) {
            var _this4 = this;

            return this._left.apply(value).then(function (result) {
                return result instanceof Error ? _this4._right.apply(value) : result;
            });
        }
    }]);

    return AsyncOr;
}(AsyncChainable);

/**
 * SyncAdapter allows a synchronous AsyncPrecondition to be included in an already
 * asynchronous chain.
 * @param {AsyncAsyncPrecondition} async
 * @param {AsyncPrecondition} sync
 */


var SyncAdapter = function (_AsyncChainable3) {
    _inherits(SyncAdapter, _AsyncChainable3);

    function SyncAdapter(async, sync) {
        _classCallCheck(this, SyncAdapter);

        var _this5 = _possibleConstructorReturn(this, (SyncAdapter.__proto__ || Object.getPrototypeOf(SyncAdapter)).call(this));

        _this5._async = async;
        _this5._sync = sync;

        return _this5;
    }

    _createClass(SyncAdapter, [{
        key: 'apply',
        value: function apply(value) {
            var _this6 = this;

            return this._async.apply(value).then(function (result) {
                return result instanceof Error ? result : _bluebird2.default.try(function () {
                    return _this6._sync.apply(value);
                });
            });
        }
    }]);

    return SyncAdapter;
}(AsyncChainable);

exports.AsyncAnd = AsyncAnd;
exports.AsyncOr = AsyncOr;
exports.SyncAdapter = SyncAdapter;
exports.default = AsyncChainable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVjb25kaXRpb25zL0FzeW5jQ2hhaW5hYmxlLmpzIl0sIm5hbWVzIjpbIkFzeW5jQ2hhaW5hYmxlIiwicmlnaHQiLCJBc3luY0FuZCIsIkFzeW5jT3IiLCJwcmVkaWNhdGUiLCJTeW5jQWRhcHRlciIsIlJlZmVyZW5jZUVycm9yIiwibGVmdCIsIl9sZWZ0IiwiX3JpZ2h0IiwidmFsdWUiLCJhcHBseSIsInRoZW4iLCJyZXN1bHQiLCJFcnJvciIsImFzeW5jIiwic3luYyIsIl9hc3luYyIsIl9zeW5jIiwidHJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOztBQUVBOzs7OztJQUtNQSxjOzs7Ozs7Ozs7QUFFRjs7Ozs7NEJBS0lDLEssRUFBTzs7QUFFUCxtQkFBTyxJQUFJQyxRQUFKLENBQWEsSUFBYixFQUFtQkQsS0FBbkIsQ0FBUDtBQUVIOztBQUVEOzs7Ozs7OzsyQkFLR0EsSyxFQUFPOztBQUVOLG1CQUFPLElBQUlFLE9BQUosQ0FBWSxJQUFaLEVBQWtCRixLQUFsQixDQUFQO0FBRUg7O0FBRUQ7Ozs7Ozs7OzZCQUtLRyxTLEVBQVc7O0FBRVosbUJBQU8sSUFBSUMsV0FBSixDQUFnQixJQUFoQixFQUFzQkQsU0FBdEIsQ0FBUDtBQUVIOzs7Z0NBRVc7O0FBRVIsa0JBQU0sSUFBSUUsY0FBSixDQUFtQiw2Q0FBbkIsQ0FBTjtBQUVIOzs7Ozs7QUFJTDs7QUFFQTs7Ozs7OztJQUtNSixROzs7QUFFRixzQkFBWUssSUFBWixFQUFrQk4sS0FBbEIsRUFBeUI7QUFBQTs7QUFBQTs7QUFJckIsY0FBS08sS0FBTCxHQUFhRCxJQUFiO0FBQ0EsY0FBS0UsTUFBTCxHQUFjUixLQUFkOztBQUxxQjtBQU94Qjs7Ozs4QkFFS1MsSyxFQUFPO0FBQUE7O0FBRVQsbUJBQU8sS0FBS0YsS0FBTCxDQUFXRyxLQUFYLENBQWlCRCxLQUFqQixFQUNQRSxJQURPLENBQ0Y7QUFBQSx1QkFBVUMsa0JBQWtCQyxLQUFsQixHQUEwQkQsTUFBMUIsR0FBbUMsT0FBS0osTUFBTCxDQUFZRSxLQUFaLENBQWtCRCxLQUFsQixDQUE3QztBQUFBLGFBREUsQ0FBUDtBQUdIOzs7O0VBaEJrQlYsYzs7QUFvQnZCOzs7Ozs7OztJQU1NRyxPOzs7QUFFRixxQkFBWUksSUFBWixFQUFrQk4sS0FBbEIsRUFBeUI7QUFBQTs7QUFBQTs7QUFHckIsZUFBS08sS0FBTCxHQUFhRCxJQUFiO0FBQ0EsZUFBS0UsTUFBTCxHQUFjUixLQUFkOztBQUpxQjtBQU14Qjs7Ozs4QkFFS1MsSyxFQUFPO0FBQUE7O0FBRVQsbUJBQU8sS0FBS0YsS0FBTCxDQUFXRyxLQUFYLENBQWlCRCxLQUFqQixFQUNQRSxJQURPLENBQ0Y7QUFBQSx1QkFBV0Msa0JBQWtCQyxLQUFuQixHQUE0QixPQUFLTCxNQUFMLENBQVlFLEtBQVosQ0FBa0JELEtBQWxCLENBQTVCLEdBQXVERyxNQUFqRTtBQUFBLGFBREUsQ0FBUDtBQUdIOzs7O0VBZmlCYixjOztBQW1CdEI7Ozs7Ozs7O0lBTU1LLFc7OztBQUVGLHlCQUFZVSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBOztBQUdyQixlQUFLQyxNQUFMLEdBQWNGLEtBQWQ7QUFDQSxlQUFLRyxLQUFMLEdBQWFGLElBQWI7O0FBSnFCO0FBTXhCOzs7OzhCQUVLTixLLEVBQU87QUFBQTs7QUFFVCxtQkFBTyxLQUFLTyxNQUFMLENBQVlOLEtBQVosQ0FBa0JELEtBQWxCLEVBQ1BFLElBRE8sQ0FDRjtBQUFBLHVCQUFVQyxrQkFBa0JDLEtBQWxCLEdBQ1hELE1BRFcsR0FFWCxtQkFBUU0sR0FBUixDQUFZO0FBQUEsMkJBQU0sT0FBS0QsS0FBTCxDQUFXUCxLQUFYLENBQWlCRCxLQUFqQixDQUFOO0FBQUEsaUJBQVosQ0FGQztBQUFBLGFBREUsQ0FBUDtBQUtIOzs7O0VBakJxQlYsYzs7UUFxQmpCRSxRLEdBQUFBLFE7UUFBVUMsTyxHQUFBQSxPO1FBQVNFLFcsR0FBQUEsVztrQkFDYkwsYyIsImZpbGUiOiJBc3luY0NoYWluYWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IEFzeW5jUHJlY29uZGl0aW9uIGZyb20gJy4vQXN5bmNQcmVjb25kaXRpb24nO1xuXG4vKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cbi8qKlxuICogQXN5bmNDaGFpbmFibGUgaXMgdGhlIGFzeW5jIHZlcnNpb24gb2YgQ2hhaW5hYmxlLlxuICogQGFic3RyYWN0XG4gKiBAaW1wbGVtZW50cyB7QXN5bmNQcmVjb25kaXRpb259XG4gKi9cbmNsYXNzIEFzeW5jQ2hhaW5hYmxlIHtcblxuICAgIC8qKlxuICAgICAqIGFuZFxuICAgICAqIEBwYXJhbSB7QXN5bmNQcmVjb25kaXRpb259IHJpZ2h0XG4gICAgICogQHJldHVybnMge0FzeW5jQW5kfVxuICAgICAqL1xuICAgIGFuZChyaWdodCkge1xuXG4gICAgICAgIHJldHVybiBuZXcgQXN5bmNBbmQodGhpcywgcmlnaHQpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb3JcbiAgICAgKiBAcGFyYW0ge0FzeW5jUHJlY29uZGl0aW9ufSByaWdodFxuICAgICAqIEByZXR1cm5zIHtBc3luY09yfVxuICAgICAqL1xuICAgIG9yKHJpZ2h0KSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBc3luY09yKHRoaXMsIHJpZ2h0KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHN5bmMgYWRhcHRzIHRoZSBzeW5jIGFwaSB0byBiZWNvbWUgYXN5bmNcbiAgICAgKiBAcGFyYW0ge0FzeW5jUHJlY29uZGl0aW9ufSBwcmVkaWNhdGVcbiAgICAgKiBAcmV0dXJuIHtBc3luY0NoYWluYWJsZX1cbiAgICAgKi9cbiAgICBzeW5jKHByZWRpY2F0ZSkge1xuXG4gICAgICAgIHJldHVybiBuZXcgU3luY0FkYXB0ZXIodGhpcywgcHJlZGljYXRlKTtcblxuICAgIH1cblxuICAgICAgICBhcHBseSgpIHtcblxuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0FzeW5jQ2hhaW5hYmxlLmFwcGx5KCkgd2FzIG5vdCBpbXBsZW1lbnRlZCEnKTtcblxuICAgIH1cblxufVxuXG4vKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXG4vKipcbiAqIEFzeW5jQW5kIGlzIHRoZSBhc3luYyB2ZXJzaW9uIG9mIEFuZC5cbiAqIEBwYXJhbSB7QXN5bmNQcmVjb25kaXRpb259IGxlZnRcbiAqIEBwYXJhbSB7QXN5bmNQcmVjb25kaXRpb259IHJpZ2h0XG4gKi9cbmNsYXNzIEFzeW5jQW5kIGV4dGVuZHMgQXN5bmNDaGFpbmFibGUge1xuXG4gICAgY29uc3RydWN0b3IobGVmdCwgcmlnaHQpIHtcblxuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuX2xlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLl9yaWdodCA9IHJpZ2h0O1xuXG4gICAgfVxuXG4gICAgYXBwbHkodmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fbGVmdC5hcHBseSh2YWx1ZSkuXG4gICAgICAgIHRoZW4ocmVzdWx0ID0+IHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yID8gcmVzdWx0IDogdGhpcy5fcmlnaHQuYXBwbHkodmFsdWUpKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIEFzeW5jT3IgZXhlY3V0ZXMgdGhlIGxlZnQgQXN5bmNQcmVjb25kaXRpb24gZmlyc3QgdGhlbiByaWdodCBvbmx5IGlmIHRoZSByZXN1bHQgb2YgdGhlIGxlZnQgaXMgbm90IG9rLlxuICogQHBhcmFtIHtBc3luY1ByZWNvbmRpdGlvbn0gbGVmdFxuICogQHBhcmFtIHtBc3luY1ByZWNvbmRpdGlvbn0gcmlnaHRcbiAqXG4gKi9cbmNsYXNzIEFzeW5jT3IgZXh0ZW5kcyBBc3luY0NoYWluYWJsZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0LCByaWdodCkge1xuXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2xlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLl9yaWdodCA9IHJpZ2h0O1xuXG4gICAgfVxuXG4gICAgYXBwbHkodmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fbGVmdC5hcHBseSh2YWx1ZSkuXG4gICAgICAgIHRoZW4ocmVzdWx0ID0+IChyZXN1bHQgaW5zdGFuY2VvZiBFcnJvcikgPyB0aGlzLl9yaWdodC5hcHBseSh2YWx1ZSkgOiByZXN1bHQpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogU3luY0FkYXB0ZXIgYWxsb3dzIGEgc3luY2hyb25vdXMgQXN5bmNQcmVjb25kaXRpb24gdG8gYmUgaW5jbHVkZWQgaW4gYW4gYWxyZWFkeVxuICogYXN5bmNocm9ub3VzIGNoYWluLlxuICogQHBhcmFtIHtBc3luY0FzeW5jUHJlY29uZGl0aW9ufSBhc3luY1xuICogQHBhcmFtIHtBc3luY1ByZWNvbmRpdGlvbn0gc3luY1xuICovXG5jbGFzcyBTeW5jQWRhcHRlciBleHRlbmRzIEFzeW5jQ2hhaW5hYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKGFzeW5jLCBzeW5jKSB7XG5cbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fYXN5bmMgPSBhc3luYztcbiAgICAgICAgdGhpcy5fc3luYyA9IHN5bmM7XG5cbiAgICB9XG5cbiAgICBhcHBseSh2YWx1ZSkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9hc3luYy5hcHBseSh2YWx1ZSkuXG4gICAgICAgIHRoZW4ocmVzdWx0ID0+IHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yID9cbiAgICAgICAgICAgIHJlc3VsdCA6XG4gICAgICAgICAgICBQcm9taXNlLnRyeSgoKSA9PiB0aGlzLl9zeW5jLmFwcGx5KHZhbHVlKSkpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCB7IEFzeW5jQW5kLCBBc3luY09yLCBTeW5jQWRhcHRlciB9O1xuZXhwb3J0IGRlZmF1bHQgQXN5bmNDaGFpbmFibGVcbiJdfQ==