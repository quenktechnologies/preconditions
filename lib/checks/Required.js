'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Criterion2 = require('../Criterion');

var _Criterion3 = _interopRequireDefault(_Criterion2);

var DEFAULT_MSG = 'The field \'{key}\' is required!';
/**
 * Required ensures that the target value is not null, undefined, or an empty string.
 * @implements {Criteria}
 * @param {Criteria} [next=null] If passed, will be called if this criteria
 */

var Required = (function (_Criterion) {
    _inherits(Required, _Criterion);

    function Required(msg) {
        _classCallCheck(this, Required);

        _get(Object.getPrototypeOf(Required.prototype), 'constructor', this).call(this, msg || DEFAULT_MSG);
    }

    _createClass(Required, [{
        key: 'apply',
        value: function apply(key, value, done) {

            if (value === '' || value === null || value === undefined) return done(new Error(this.template({
                key: key,
                value: value
            })), key, value);

            done(null, key, value);
        }
    }]);

    return Required;
})(_Criterion3['default']);

exports['default'] = Required;
module.exports = exports['default'];