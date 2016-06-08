/**
 * ExecutionError is used to neatly combine the
 * errors of the various criteria. It is not intended to be thrown but rather
 * passed as an indicator that errors have occured.
 * @param {object} errors A list of all the errors that have occured
 * @param {number} count  The number of errors that have occured.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExecutionError = (function (_Error) {
    _inherits(ExecutionError, _Error);

    function ExecutionError(errors) {
        _classCallCheck(this, ExecutionError);

        _get(Object.getPrototypeOf(ExecutionError.prototype), 'constructor', this).call(this, 'Errors have occured, use the \'errors\' property of this object to get more information!');

        this.name = this.constructor.name;
        this.errors = errors;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = new Error(message).stack;
        }
    }

    return ExecutionError;
})(Error);

exports['default'] = ExecutionError;
module.exports = exports['default'];