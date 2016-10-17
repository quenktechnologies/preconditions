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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Dcml0ZXJpYS5qcyJdLCJuYW1lcyI6WyJjb3JlIiwiQ3JpdGVyaWEiLCJzY2hlbWEiLCJtZXNzYWdlcyIsIl9zdHJhdGVneSIsInZhbHVlIiwiYXBwbHkiLCJDcml0ZXJpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0lBQVlBLEk7O0FBQ1o7Ozs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7SUFPTUMsUTs7O0FBRUYsc0JBQVlDLE1BQVosRUFBb0JDLFFBQXBCLEVBQThCO0FBQUE7O0FBQUE7O0FBRzFCLGNBQUtELE1BQUwsR0FBY0EsTUFBZDtBQUNBLGNBQUtFLFNBQUwsR0FBaUIsMkJBQWlCRCxRQUFqQixDQUFqQjs7QUFKMEI7QUFNN0I7Ozs7Z0NBRU9FLEssRUFBTzs7QUFFWCxtQkFBTyxLQUFLRCxTQUFMLENBQWVFLEtBQWYsQ0FBcUJELEtBQXJCLEVBQTRCLEtBQUtILE1BQWpDLENBQVA7QUFFSDs7OztFQWRrQkYsS0FBS08sUzs7a0JBa0JiTixRIiwiZmlsZSI6IkNyaXRlcmlhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29yZSBmcm9tICdjcml0ZXJpYS1wYXR0ZXJuLWNvcmUnO1xuaW1wb3J0IFNhdGlzZmFjdGlvbiBmcm9tICcuL1NhdGlzZmFjdGlvbic7XG5cbi8qKlxuICogQ3JpdGVyaWEgcmVwcmVzZW50cyBhIHNldCBvZiBDcml0ZXJpb24gdGhhdCB3aWxsIGJlIGFwcGxpZWQgdG8gXG4gKiB0aGUga2V5cyBvZiBhbiBvYmplY3QgKG1hcCkuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHNjaGVtYVxuICogQHByb3BlcnR5IHtvYmplY3R9IG1lc3NhZ2VzXG4gKi9cbmNsYXNzIENyaXRlcmlhIGV4dGVuZHMgY29yZS5Dcml0ZXJpb24ge1xuXG4gICAgY29uc3RydWN0b3Ioc2NoZW1hLCBtZXNzYWdlcykge1xuXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc2NoZW1hID0gc2NoZW1hO1xuICAgICAgICB0aGlzLl9zdHJhdGVneSA9IG5ldyBTYXRpc2ZhY3Rpb24obWVzc2FnZXMpO1xuXG4gICAgfVxuXG4gICAgc2F0aXNmeSh2YWx1ZSkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9zdHJhdGVneS5hcHBseSh2YWx1ZSwgdGhpcy5zY2hlbWEpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENyaXRlcmlhXG4iXX0=