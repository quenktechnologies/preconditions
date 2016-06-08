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

var DEFAULT_ERROR_MESSAGE = 'Invalid value given for {key}, expected {expected}, got {actual}!';

/**
 * TypeOf checks the type of the value being passed through the criterion chain.
 * Sets [key, value, actual, expected]
 * @implements {Criteria}
 * @param {Criteria} [next=null] If passed, will be called if this criteria
 */

var TypeOf = (function (_Criterion) {
    _inherits(TypeOf, _Criterion);

    function TypeOf(type, emsg, next) {
        _classCallCheck(this, TypeOf);

        _get(Object.getPrototypeOf(TypeOf.prototype), 'constructor', this).call(this, next);
        this._type = type;
        this.message = emsg ? emsg : DEFAULT_ERROR_MESSAGE;
    }

    _createClass(TypeOf, [{
        key: 'apply',
        value: function apply(key, value, done) {

            var expected = this._type;
            var actual = typeof value;

            if (expected === TypeOf.types.ARRAY) if (Array.isArray(value)) return this.next(key, value, done);

            if (actual === expected) return this.next(key, value, done);

            return done(new Error(this.getMessage({
                key: key,
                value: value,
                expected: expected,
                actual: actual
            })));
        }
    }]);

    return TypeOf;
})(_Criterion3['default']);

TypeOf.types = {

    ARRAY: 'array',
    OBJECT: 'object',
    NUMBER: 'number',
    STRING: 'string'

};

exports['default'] = TypeOf;
module.exports = exports['default'];