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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FeGVjdXRpb25FcnJvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBT00sY0FBYztjQUFkLGNBQWM7O0FBRUwsYUFGVCxjQUFjLENBRUosTUFBTSxFQUFFOzhCQUZsQixjQUFjOztBQUlaLG1DQUpGLGNBQWMsNkNBSU4sMEZBQTBGLEVBQUU7O0FBRWxHLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7QUFDbEMsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRXJCLFlBQUksT0FBTyxLQUFLLENBQUMsaUJBQWlCLEtBQUssVUFBVSxFQUFFO0FBQy9DLGlCQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUNuRCxNQUFNO0FBQ0gsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsQUFBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBRSxLQUFLLENBQUM7U0FDM0M7S0FFSjs7V0FmQyxjQUFjO0dBQVMsS0FBSzs7cUJBa0JuQixjQUFjIiwiZmlsZSI6IkV4ZWN1dGlvbkVycm9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBFeGVjdXRpb25FcnJvciBpcyB1c2VkIHRvIG5lYXRseSBjb21iaW5lIHRoZVxuICogZXJyb3JzIG9mIHRoZSB2YXJpb3VzIGNyaXRlcmlhLiBJdCBpcyBub3QgaW50ZW5kZWQgdG8gYmUgdGhyb3duIGJ1dCByYXRoZXJcbiAqIHBhc3NlZCBhcyBhbiBpbmRpY2F0b3IgdGhhdCBlcnJvcnMgaGF2ZSBvY2N1cmVkLlxuICogQHBhcmFtIHtvYmplY3R9IGVycm9ycyBBIGxpc3Qgb2YgYWxsIHRoZSBlcnJvcnMgdGhhdCBoYXZlIG9jY3VyZWRcbiAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCAgVGhlIG51bWJlciBvZiBlcnJvcnMgdGhhdCBoYXZlIG9jY3VyZWQuXG4gKi9cbmNsYXNzIEV4ZWN1dGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuXG4gICAgY29uc3RydWN0b3IoZXJyb3JzKSB7XG5cbiAgICAgICAgc3VwZXIoJ0Vycm9ycyBoYXZlIG9jY3VyZWQsIHVzZSB0aGUgXFwnZXJyb3JzXFwnIHByb3BlcnR5IG9mIHRoaXMgb2JqZWN0IHRvIGdldCBtb3JlIGluZm9ybWF0aW9uIScpO1xuXG4gICAgICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBlcnJvcnM7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YWNrID0gKG5ldyBFcnJvcihtZXNzYWdlKSkuc3RhY2s7XG4gICAgICAgIH1cblxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXhlY3V0aW9uRXJyb3JcbiJdfQ==