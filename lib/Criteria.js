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

/**
 * Criteria represents a set of Criterion that will be applied to 
 * the keys of an object (map).
 *
 * @param {object} schema
 * @property {object} messages
 */
var Criteria = function (_core$Criterion) {
    _inherits(Criteria, _core$Criterion);

    function Criteria(schema, messages) {
        _classCallCheck(this, Criteria);

        var _this = _possibleConstructorReturn(this, (Criteria.__proto__ || Object.getPrototypeOf(Criteria)).call(this));

        _this.schema = schema;
        _this.messages = messages;
        _this._strategy = new _Satisfaction2.default(messages);

        return _this;
    }

    _createClass(Criteria, [{
        key: 'satisfy',
        value: function satisfy(value) {

            return this._strategy.apply(value, this.schema);
        }
    }]);

    return Criteria;
}(core.Criterion);

exports.default = Criteria;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Dcml0ZXJpYS5qcyJdLCJuYW1lcyI6WyJjb3JlIiwiQ3JpdGVyaWEiLCJzY2hlbWEiLCJtZXNzYWdlcyIsIl9zdHJhdGVneSIsInZhbHVlIiwiYXBwbHkiLCJDcml0ZXJpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0lBQVlBLEk7O0FBQ1o7Ozs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7SUFPTUMsUTs7O0FBRUYsc0JBQVlDLE1BQVosRUFBb0JDLFFBQXBCLEVBQThCO0FBQUE7O0FBQUE7O0FBRzFCLGNBQUtELE1BQUwsR0FBY0EsTUFBZDtBQUNGLGNBQUtDLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0UsY0FBS0MsU0FBTCxHQUFpQiwyQkFBaUJELFFBQWpCLENBQWpCOztBQUwwQjtBQU83Qjs7OztnQ0FFT0UsSyxFQUFPOztBQUVYLG1CQUFPLEtBQUtELFNBQUwsQ0FBZUUsS0FBZixDQUFxQkQsS0FBckIsRUFBNEIsS0FBS0gsTUFBakMsQ0FBUDtBQUVIOzs7O0VBZmtCRixLQUFLTyxTOztrQkFtQmJOLFEiLCJmaWxlIjoiQ3JpdGVyaWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb3JlIGZyb20gJ2NyaXRlcmlhLXBhdHRlcm4tY29yZSc7XG5pbXBvcnQgU2F0aXNmYWN0aW9uIGZyb20gJy4vU2F0aXNmYWN0aW9uJztcblxuLyoqXG4gKiBDcml0ZXJpYSByZXByZXNlbnRzIGEgc2V0IG9mIENyaXRlcmlvbiB0aGF0IHdpbGwgYmUgYXBwbGllZCB0byBcbiAqIHRoZSBrZXlzIG9mIGFuIG9iamVjdCAobWFwKS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gc2NoZW1hXG4gKiBAcHJvcGVydHkge29iamVjdH0gbWVzc2FnZXNcbiAqL1xuY2xhc3MgQ3JpdGVyaWEgZXh0ZW5kcyBjb3JlLkNyaXRlcmlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihzY2hlbWEsIG1lc3NhZ2VzKSB7XG5cbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zY2hlbWEgPSBzY2hlbWE7XG4gICAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXM7XG4gICAgICAgIHRoaXMuX3N0cmF0ZWd5ID0gbmV3IFNhdGlzZmFjdGlvbihtZXNzYWdlcyk7XG5cbiAgICB9XG5cbiAgICBzYXRpc2Z5KHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0cmF0ZWd5LmFwcGx5KHZhbHVlLCB0aGlzLnNjaGVtYSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3JpdGVyaWFcbiJdfQ==