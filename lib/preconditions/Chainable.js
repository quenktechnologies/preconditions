'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Or = exports.And = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Precondition = require('./Precondition');

var _Precondition2 = _interopRequireDefault(_Precondition);

var _AsyncAdapter = require('./AsyncAdapter');

var _AsyncAdapter2 = _interopRequireDefault(_AsyncAdapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* jshint ignore:start */

/**
 * Chainable provides an api that lets Precondition be chained to one another.
 * @abstract
 * @implements {Precondition}
 */
var Chainable = function () {
    function Chainable() {
        _classCallCheck(this, Chainable);
    }

    _createClass(Chainable, [{
        key: 'and',


        /**
         * and
         * @param {Precondition} right
         * @returns {And}
         */
        value: function and(right) {

            return new And(this, right);
        }

        /**
         * or
         * @param {Precondition} right
         * @returns {Or}
         */

    }, {
        key: 'or',
        value: function or(right) {

            return new Or(this, right);
        }

        /**
         * async adapts the api to the async version.
         * @param {AsyncPrecondition} predicate
         * @return {AsyncChainable}
         */

    }, {
        key: 'async',
        value: function async(predicate) {

            return new _AsyncAdapter2.default(this, predicate);
        }
    }, {
        key: 'apply',
        value: function apply() {

            throw new ReferenceError('Chainable.apply() was not implemented!');
        }
    }]);

    return Chainable;
}();
/* jshint ignore: end */

/**
 * And executes the left Precondition first then right only if the result of the left is ok.
 * @param {Precondition} left
 * @param {Precondition} right
 *
 */


var And = function (_Chainable) {
    _inherits(And, _Chainable);

    function And(left, right) {
        _classCallCheck(this, And);

        var _this = _possibleConstructorReturn(this, (And.__proto__ || Object.getPrototypeOf(And)).call(this));

        (0, _beof2.default)({ left: left }).interface(_Precondition2.default);
        (0, _beof2.default)({ right: right }).interface(_Precondition2.default);

        _this.left = left;
        _this.right = right;

        return _this;
    }

    _createClass(And, [{
        key: 'apply',
        value: function apply(value) {

            var result = this.left.apply(value);
            return result instanceof Error ? result : this.right.apply(value);
        }
    }]);

    return And;
}(Chainable);

/**
 * Or executes the left Precondition first then right only if the result of the left is not ok.
 * @param {Precondition} left
 * @param {Precondition} right
 *
 */


var Or = function () {
    function Or(left, right) {
        _classCallCheck(this, Or);

        (0, _beof2.default)({ left: left }).interface(_Precondition2.default);
        (0, _beof2.default)({ right: right }).interface(_Precondition2.default);

        this.left = left;
        this.right = right;
    }

    _createClass(Or, [{
        key: 'apply',
        value: function apply(value) {

            var result = this.left.apply(value);
            return result instanceof Error ? this.right.apply(value) : result;
        }
    }]);

    return Or;
}();

exports.And = And;
exports.Or = Or;
exports.default = Chainable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVjb25kaXRpb25zL0NoYWluYWJsZS5qcyJdLCJuYW1lcyI6WyJDaGFpbmFibGUiLCJyaWdodCIsIkFuZCIsIk9yIiwicHJlZGljYXRlIiwiUmVmZXJlbmNlRXJyb3IiLCJsZWZ0IiwiaW50ZXJmYWNlIiwidmFsdWUiLCJyZXN1bHQiLCJhcHBseSIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOztBQUVBOzs7OztJQUtNQSxTOzs7Ozs7Ozs7QUFFRjs7Ozs7NEJBS0lDLEssRUFBTzs7QUFFUCxtQkFBTyxJQUFJQyxHQUFKLENBQVEsSUFBUixFQUFjRCxLQUFkLENBQVA7QUFFSDs7QUFFRDs7Ozs7Ozs7MkJBS0dBLEssRUFBTzs7QUFFTixtQkFBTyxJQUFJRSxFQUFKLENBQU8sSUFBUCxFQUFhRixLQUFiLENBQVA7QUFFSDs7QUFFRDs7Ozs7Ozs7OEJBS01HLFMsRUFBVzs7QUFFYixtQkFBTywyQkFBaUIsSUFBakIsRUFBdUJBLFNBQXZCLENBQVA7QUFFSDs7O2dDQUVPOztBQUVKLGtCQUFNLElBQUlDLGNBQUosQ0FBbUIsd0NBQW5CLENBQU47QUFFSDs7Ozs7QUFHTDs7QUFHQTs7Ozs7Ozs7SUFNTUgsRzs7O0FBRUYsaUJBQVlJLElBQVosRUFBa0JMLEtBQWxCLEVBQXlCO0FBQUE7O0FBQUE7O0FBSXJCLDRCQUFLLEVBQUVLLFVBQUYsRUFBTCxFQUFlQyxTQUFmO0FBQ0EsNEJBQUssRUFBRU4sWUFBRixFQUFMLEVBQWdCTSxTQUFoQjs7QUFFQSxjQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxjQUFLTCxLQUFMLEdBQWFBLEtBQWI7O0FBUnFCO0FBVXhCOzs7OzhCQUVLTyxLLEVBQU87O0FBRVQsZ0JBQUlDLFNBQVMsS0FBS0gsSUFBTCxDQUFVSSxLQUFWLENBQWdCRixLQUFoQixDQUFiO0FBQ0EsbUJBQVFDLGtCQUFrQkUsS0FBbkIsR0FBNEJGLE1BQTVCLEdBQXFDLEtBQUtSLEtBQUwsQ0FBV1MsS0FBWCxDQUFpQkYsS0FBakIsQ0FBNUM7QUFFSDs7OztFQW5CYVIsUzs7QUF1QmxCOzs7Ozs7OztJQU1NRyxFO0FBRUYsZ0JBQVlHLElBQVosRUFBa0JMLEtBQWxCLEVBQXlCO0FBQUE7O0FBRXJCLDRCQUFLLEVBQUVLLFVBQUYsRUFBTCxFQUFlQyxTQUFmO0FBQ0EsNEJBQUssRUFBRU4sWUFBRixFQUFMLEVBQWdCTSxTQUFoQjs7QUFFQSxhQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxhQUFLTCxLQUFMLEdBQWFBLEtBQWI7QUFFSDs7Ozs4QkFFS08sSyxFQUFPOztBQUVULGdCQUFJQyxTQUFTLEtBQUtILElBQUwsQ0FBVUksS0FBVixDQUFnQkYsS0FBaEIsQ0FBYjtBQUNBLG1CQUFRQyxrQkFBa0JFLEtBQW5CLEdBQTRCLEtBQUtWLEtBQUwsQ0FBV1MsS0FBWCxDQUFpQkYsS0FBakIsQ0FBNUIsR0FBc0RDLE1BQTdEO0FBRUg7Ozs7OztRQUlJUCxHLEdBQUFBLEc7UUFBS0MsRSxHQUFBQSxFO2tCQUNDSCxTIiwiZmlsZSI6IkNoYWluYWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByZWNvbmRpdGlvbiBmcm9tICcuL1ByZWNvbmRpdGlvbic7XG5pbXBvcnQgQXN5bmNBZGFwdGVyIGZyb20gJy4vQXN5bmNBZGFwdGVyJztcblxuLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXG4vKipcbiAqIENoYWluYWJsZSBwcm92aWRlcyBhbiBhcGkgdGhhdCBsZXRzIFByZWNvbmRpdGlvbiBiZSBjaGFpbmVkIHRvIG9uZSBhbm90aGVyLlxuICogQGFic3RyYWN0XG4gKiBAaW1wbGVtZW50cyB7UHJlY29uZGl0aW9ufVxuICovXG5jbGFzcyBDaGFpbmFibGUge1xuXG4gICAgLyoqXG4gICAgICogYW5kXG4gICAgICogQHBhcmFtIHtQcmVjb25kaXRpb259IHJpZ2h0XG4gICAgICogQHJldHVybnMge0FuZH1cbiAgICAgKi9cbiAgICBhbmQocmlnaHQpIHtcblxuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCByaWdodCk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvclxuICAgICAqIEBwYXJhbSB7UHJlY29uZGl0aW9ufSByaWdodFxuICAgICAqIEByZXR1cm5zIHtPcn1cbiAgICAgKi9cbiAgICBvcihyaWdodCkge1xuXG4gICAgICAgIHJldHVybiBuZXcgT3IodGhpcywgcmlnaHQpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYXN5bmMgYWRhcHRzIHRoZSBhcGkgdG8gdGhlIGFzeW5jIHZlcnNpb24uXG4gICAgICogQHBhcmFtIHtBc3luY1ByZWNvbmRpdGlvbn0gcHJlZGljYXRlXG4gICAgICogQHJldHVybiB7QXN5bmNDaGFpbmFibGV9XG4gICAgICovXG4gICAgYXN5bmMocHJlZGljYXRlKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBc3luY0FkYXB0ZXIodGhpcywgcHJlZGljYXRlKTtcblxuICAgIH1cblxuICAgIGFwcGx5KCkge1xuXG4gICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignQ2hhaW5hYmxlLmFwcGx5KCkgd2FzIG5vdCBpbXBsZW1lbnRlZCEnKTtcblxuICAgIH1cblxufVxuLyoganNoaW50IGlnbm9yZTogZW5kICovXG5cblxuLyoqXG4gKiBBbmQgZXhlY3V0ZXMgdGhlIGxlZnQgUHJlY29uZGl0aW9uIGZpcnN0IHRoZW4gcmlnaHQgb25seSBpZiB0aGUgcmVzdWx0IG9mIHRoZSBsZWZ0IGlzIG9rLlxuICogQHBhcmFtIHtQcmVjb25kaXRpb259IGxlZnRcbiAqIEBwYXJhbSB7UHJlY29uZGl0aW9ufSByaWdodFxuICpcbiAqL1xuY2xhc3MgQW5kIGV4dGVuZHMgQ2hhaW5hYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQsIHJpZ2h0KSB7XG5cbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBiZW9mKHsgbGVmdCB9KS5pbnRlcmZhY2UoUHJlY29uZGl0aW9uKTtcbiAgICAgICAgYmVvZih7IHJpZ2h0IH0pLmludGVyZmFjZShQcmVjb25kaXRpb24pO1xuXG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcblxuICAgIH1cblxuICAgIGFwcGx5KHZhbHVlKSB7XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMubGVmdC5hcHBseSh2YWx1ZSk7XG4gICAgICAgIHJldHVybiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpID8gcmVzdWx0IDogdGhpcy5yaWdodC5hcHBseSh2YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBPciBleGVjdXRlcyB0aGUgbGVmdCBQcmVjb25kaXRpb24gZmlyc3QgdGhlbiByaWdodCBvbmx5IGlmIHRoZSByZXN1bHQgb2YgdGhlIGxlZnQgaXMgbm90IG9rLlxuICogQHBhcmFtIHtQcmVjb25kaXRpb259IGxlZnRcbiAqIEBwYXJhbSB7UHJlY29uZGl0aW9ufSByaWdodFxuICpcbiAqL1xuY2xhc3MgT3Ige1xuXG4gICAgY29uc3RydWN0b3IobGVmdCwgcmlnaHQpIHtcblxuICAgICAgICBiZW9mKHsgbGVmdCB9KS5pbnRlcmZhY2UoUHJlY29uZGl0aW9uKTtcbiAgICAgICAgYmVvZih7IHJpZ2h0IH0pLmludGVyZmFjZShQcmVjb25kaXRpb24pO1xuXG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcblxuICAgIH1cblxuICAgIGFwcGx5KHZhbHVlKSB7XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMubGVmdC5hcHBseSh2YWx1ZSk7XG4gICAgICAgIHJldHVybiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpID8gdGhpcy5yaWdodC5hcHBseSh2YWx1ZSkgOiByZXN1bHQ7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IHsgQW5kLCBPciB9XG5leHBvcnQgZGVmYXVsdCBDaGFpbmFibGVcbiJdfQ==