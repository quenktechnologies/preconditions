'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ExecutionError is used to neatly combine the
 * errors of the various criteria. It is not intended to be thrown but rather
 * passed as an indicator that errors have occured.
 * @param {object} errors A list of all the errors that have occured
 * @param {number} count  The number of errors that have occured.
 */
var ExecutionError = function (_Error) {
    _inherits(ExecutionError, _Error);

    function ExecutionError(errors) {
        _classCallCheck(this, ExecutionError);

        var _this = _possibleConstructorReturn(this, (ExecutionError.__proto__ || Object.getPrototypeOf(ExecutionError)).call(this, 'Errors have occured, use the \'errors\' property of this object to get more information!'));

        _this.name = _this.constructor.name;
        _this.errors = errors;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(_this, _this.constructor);
        } else {
            _this.stack = new Error(message).stack;
        }

        return _this;
    }

    return ExecutionError;
}(Error);

exports.default = ExecutionError;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FeGVjdXRpb25FcnJvci5qcyJdLCJuYW1lcyI6WyJFeGVjdXRpb25FcnJvciIsImVycm9ycyIsIm5hbWUiLCJjb25zdHJ1Y3RvciIsIkVycm9yIiwiY2FwdHVyZVN0YWNrVHJhY2UiLCJzdGFjayIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7O0lBT01BLGM7OztBQUVGLDRCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQUEsb0lBRVYsMEZBRlU7O0FBSWhCLGNBQUtDLElBQUwsR0FBWSxNQUFLQyxXQUFMLENBQWlCRCxJQUE3QjtBQUNBLGNBQUtELE1BQUwsR0FBY0EsTUFBZDs7QUFFQSxZQUFJLE9BQU9HLE1BQU1DLGlCQUFiLEtBQW1DLFVBQXZDLEVBQW1EO0FBQy9DRCxrQkFBTUMsaUJBQU4sUUFBOEIsTUFBS0YsV0FBbkM7QUFDSCxTQUZELE1BRU87QUFDSCxrQkFBS0csS0FBTCxHQUFjLElBQUlGLEtBQUosQ0FBVUcsT0FBVixDQUFELENBQXFCRCxLQUFsQztBQUNIOztBQVhlO0FBYW5COzs7RUFmd0JGLEs7O2tCQWtCZEosYyIsImZpbGUiOiJFeGVjdXRpb25FcnJvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRXhlY3V0aW9uRXJyb3IgaXMgdXNlZCB0byBuZWF0bHkgY29tYmluZSB0aGVcbiAqIGVycm9ycyBvZiB0aGUgdmFyaW91cyBjcml0ZXJpYS4gSXQgaXMgbm90IGludGVuZGVkIHRvIGJlIHRocm93biBidXQgcmF0aGVyXG4gKiBwYXNzZWQgYXMgYW4gaW5kaWNhdG9yIHRoYXQgZXJyb3JzIGhhdmUgb2NjdXJlZC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBlcnJvcnMgQSBsaXN0IG9mIGFsbCB0aGUgZXJyb3JzIHRoYXQgaGF2ZSBvY2N1cmVkXG4gKiBAcGFyYW0ge251bWJlcn0gY291bnQgIFRoZSBudW1iZXIgb2YgZXJyb3JzIHRoYXQgaGF2ZSBvY2N1cmVkLlxuICovXG5jbGFzcyBFeGVjdXRpb25FcnJvciBleHRlbmRzIEVycm9yIHtcblxuICAgIGNvbnN0cnVjdG9yKGVycm9ycykge1xuXG4gICAgICAgIHN1cGVyKCdFcnJvcnMgaGF2ZSBvY2N1cmVkLCB1c2UgdGhlIFxcJ2Vycm9yc1xcJyBwcm9wZXJ0eSBvZiB0aGlzIG9iamVjdCB0byBnZXQgbW9yZSBpbmZvcm1hdGlvbiEnKTtcblxuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIHRoaXMuZXJyb3JzID0gZXJyb3JzO1xuXG4gICAgICAgIGlmICh0eXBlb2YgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdGFjayA9IChuZXcgRXJyb3IobWVzc2FnZSkpLnN0YWNrO1xuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV4ZWN1dGlvbkVycm9yXG4iXX0=