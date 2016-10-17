'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _criteriaPatternCore = require('criteria-pattern-core');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * BulkFailure is a Failure class for object maps.
 * @property {object} errors - A map of error messages.

 */
var BulkFailure = function (_Failure) {
    _inherits(BulkFailure, _Failure);

    function BulkFailure(errors) {
        _classCallCheck(this, BulkFailure);

        var _this = _possibleConstructorReturn(this, (BulkFailure.__proto__ || Object.getPrototypeOf(BulkFailure)).call(this));

        _this.errors = errors;

        return _this;
    }

    return BulkFailure;
}(_criteriaPatternCore.Failure);

exports.default = BulkFailure;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CdWxrRmFpbHVyZS5qcyJdLCJuYW1lcyI6WyJCdWxrRmFpbHVyZSIsImVycm9ycyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7O0FBR0E7Ozs7O0lBS01BLFc7OztBQUVGLHlCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQUE7O0FBRWhCLGNBQUtBLE1BQUwsR0FBY0EsTUFBZDs7QUFGZ0I7QUFJbkI7Ozs7O2tCQUlVRCxXIiwiZmlsZSI6IkJ1bGtGYWlsdXJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBGYWlsdXJlXG59IGZyb20gJ2NyaXRlcmlhLXBhdHRlcm4tY29yZSc7XG4vKipcbiAqIEJ1bGtGYWlsdXJlIGlzIGEgRmFpbHVyZSBjbGFzcyBmb3Igb2JqZWN0IG1hcHMuXG4gKiBAcHJvcGVydHkge29iamVjdH0gZXJyb3JzIC0gQSBtYXAgb2YgZXJyb3IgbWVzc2FnZXMuXG5cbiAqL1xuY2xhc3MgQnVsa0ZhaWx1cmUgZXh0ZW5kcyBGYWlsdXJlIHtcblxuICAgIGNvbnN0cnVjdG9yKGVycm9ycykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVycm9ycyA9IGVycm9ycztcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBCdWxrRmFpbHVyZVxuIl19