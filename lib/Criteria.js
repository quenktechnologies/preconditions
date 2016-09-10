'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _criteriaPatternCore = require('criteria-pattern-core');

var core = _interopRequireWildcard(_criteriaPatternCore);

var _Satisfaction = require('./Satisfaction');

var _Satisfaction2 = _interopRequireDefault(_Satisfaction);

/**
 * Criteria represents a set of Criterion that will be applied to 
 * the keys of an object (map).
 *
 * @param {object} schema
 * @property {object} messages
 */

var Criteria = (function (_core$Criterion) {
    _inherits(Criteria, _core$Criterion);

    function Criteria(schema, messages) {
        _classCallCheck(this, Criteria);

        _get(Object.getPrototypeOf(Criteria.prototype), 'constructor', this).call(this);
        this.schema = schema;
        this._strategy = new _Satisfaction2['default'](messages);
    }

    _createClass(Criteria, [{
        key: 'satisfy',
        value: function satisfy(value) {

            return this._strategy.apply(value, this.schema);
        }
    }]);

    return Criteria;
})(core.Criterion);

exports['default'] = Criteria;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Dcml0ZXJpYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7bUNBQXNCLHVCQUF1Qjs7SUFBakMsSUFBSTs7NEJBQ1MsZ0JBQWdCOzs7Ozs7Ozs7Ozs7SUFTbkMsUUFBUTtjQUFSLFFBQVE7O0FBRUMsYUFGVCxRQUFRLENBRUUsTUFBTSxFQUFFLFFBQVEsRUFBRTs4QkFGNUIsUUFBUTs7QUFJTixtQ0FKRixRQUFRLDZDQUlFO0FBQ1IsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsWUFBSSxDQUFDLFNBQVMsR0FBRyw4QkFBaUIsUUFBUSxDQUFDLENBQUM7S0FFL0M7O2lCQVJDLFFBQVE7O2VBVUgsaUJBQUMsS0FBSyxFQUFFOztBQUVYLG1CQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FFbkQ7OztXQWRDLFFBQVE7R0FBUyxJQUFJLENBQUMsU0FBUzs7cUJBa0J0QixRQUFRIiwiZmlsZSI6IkNyaXRlcmlhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29yZSBmcm9tICdjcml0ZXJpYS1wYXR0ZXJuLWNvcmUnO1xuaW1wb3J0IFNhdGlzZmFjdGlvbiBmcm9tICcuL1NhdGlzZmFjdGlvbic7XG5cbi8qKlxuICogQ3JpdGVyaWEgcmVwcmVzZW50cyBhIHNldCBvZiBDcml0ZXJpb24gdGhhdCB3aWxsIGJlIGFwcGxpZWQgdG8gXG4gKiB0aGUga2V5cyBvZiBhbiBvYmplY3QgKG1hcCkuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHNjaGVtYVxuICogQHByb3BlcnR5IHtvYmplY3R9IG1lc3NhZ2VzXG4gKi9cbmNsYXNzIENyaXRlcmlhIGV4dGVuZHMgY29yZS5Dcml0ZXJpb24ge1xuXG4gICAgY29uc3RydWN0b3Ioc2NoZW1hLCBtZXNzYWdlcykge1xuXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc2NoZW1hID0gc2NoZW1hO1xuICAgICAgICB0aGlzLl9zdHJhdGVneSA9IG5ldyBTYXRpc2ZhY3Rpb24obWVzc2FnZXMpO1xuXG4gICAgfVxuXG4gICAgc2F0aXNmeSh2YWx1ZSkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9zdHJhdGVneS5hcHBseSh2YWx1ZSwgdGhpcy5zY2hlbWEpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENyaXRlcmlhXG4iXX0=