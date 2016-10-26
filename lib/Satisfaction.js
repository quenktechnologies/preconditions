'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _criteriaPatternCore = require('criteria-pattern-core');

var _BulkFailure = require('./BulkFailure');

var _BulkFailure2 = _interopRequireDefault(_BulkFailure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function resolve_message(key, msg, messages) {

    var combined = key + '.' + msg;

    if (messages[combined]) return messages[combined];

    if (messages[key]) return messages[key];

    if (messages[msg]) return messages[msg];

    return msg;
}

/**
 * Satisfaction runs criterion all one at a time providing
 * a callback to each that allows async operations during filtering to be performed.
 * @param {object} messages 
 * @implements {Strategy}
 */

var Satisfaction = function () {
    function Satisfaction(messages) {
        _classCallCheck(this, Satisfaction);

        this.messages = messages || {};
    }

    _createClass(Satisfaction, [{
        key: 'apply',
        value: function apply(values, map) {
            var _this = this;

            var work = Object.keys(map);
            var ok = true;
            var errors = {};
            var o = {};

            if ((typeof values === 'undefined' ? 'undefined' : _typeof(values)) !== 'object' || values === null) values = {};

            return _bluebird2.default.all(work.map(function (key, index) {
                return _bluebird2.default.resolve(map[key].satisfy(values[key]));
            })).then(function (results) {

                results.forEach(function (result, index) {

                    if (result instanceof _BulkFailure2.default) {

                        errors[work[index]] = result.errors;
                        ok = false;
                    } else if (result instanceof _criteriaPatternCore.Failure) {

                        errors[work[index]] = result.toMessage(work[index], _this.messages);
                        ok = false;
                    } else {

                        if (result !== null || result !== undefined) o[work[index]] = result;
                    }
                });

                return ok ? o : new _BulkFailure2.default(errors);
            });
        }
    }]);

    return Satisfaction;
}();

exports.default = Satisfaction;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TYXRpc2ZhY3Rpb24uanMiXSwibmFtZXMiOlsicmVzb2x2ZV9tZXNzYWdlIiwia2V5IiwibXNnIiwibWVzc2FnZXMiLCJjb21iaW5lZCIsIlNhdGlzZmFjdGlvbiIsInZhbHVlcyIsIm1hcCIsIndvcmsiLCJPYmplY3QiLCJrZXlzIiwib2siLCJlcnJvcnMiLCJvIiwiYWxsIiwiaW5kZXgiLCJyZXNvbHZlIiwic2F0aXNmeSIsInRoZW4iLCJyZXN1bHRzIiwiZm9yRWFjaCIsInJlc3VsdCIsInRvTWVzc2FnZSIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBR0E7Ozs7Ozs7O0FBRUEsU0FBU0EsZUFBVCxDQUF5QkMsR0FBekIsRUFBOEJDLEdBQTlCLEVBQW1DQyxRQUFuQyxFQUE2Qzs7QUFFekMsUUFBSUMsV0FBY0gsR0FBZCxTQUFxQkMsR0FBekI7O0FBRUEsUUFBSUMsU0FBU0MsUUFBVCxDQUFKLEVBQ0ksT0FBT0QsU0FBU0MsUUFBVCxDQUFQOztBQUVKLFFBQUlELFNBQVNGLEdBQVQsQ0FBSixFQUNJLE9BQU9FLFNBQVNGLEdBQVQsQ0FBUDs7QUFFSixRQUFJRSxTQUFTRCxHQUFULENBQUosRUFDSSxPQUFPQyxTQUFTRCxHQUFULENBQVA7O0FBRUosV0FBT0EsR0FBUDtBQUVIOztBQUVEOzs7Ozs7O0lBTU1HLFk7QUFFRiwwQkFBWUYsUUFBWixFQUFzQjtBQUFBOztBQUVsQixhQUFLQSxRQUFMLEdBQWdCQSxZQUFZLEVBQTVCO0FBRUg7Ozs7OEJBRUtHLE0sRUFBUUMsRyxFQUFLO0FBQUE7O0FBRWYsZ0JBQUlDLE9BQU9DLE9BQU9DLElBQVAsQ0FBWUgsR0FBWixDQUFYO0FBQ0EsZ0JBQUlJLEtBQUssSUFBVDtBQUNBLGdCQUFJQyxTQUFTLEVBQWI7QUFDQSxnQkFBSUMsSUFBSSxFQUFSOztBQUVBLGdCQUFLLFFBQU9QLE1BQVAseUNBQU9BLE1BQVAsT0FBa0IsUUFBbkIsSUFBaUNBLFdBQVcsSUFBaEQsRUFDSUEsU0FBUyxFQUFUOztBQUVKLG1CQUFPLG1CQUFRUSxHQUFSLENBQVlOLEtBQUtELEdBQUwsQ0FBUyxVQUFDTixHQUFELEVBQU1jLEtBQU47QUFBQSx1QkFDeEIsbUJBQVFDLE9BQVIsQ0FBZ0JULElBQUlOLEdBQUosRUFBU2dCLE9BQVQsQ0FBaUJYLE9BQU9MLEdBQVAsQ0FBakIsQ0FBaEIsQ0FEd0I7QUFBQSxhQUFULENBQVosRUFFUGlCLElBRk8sQ0FFRixtQkFBVzs7QUFFWkMsd0JBQVFDLE9BQVIsQ0FBZ0IsVUFBQ0MsTUFBRCxFQUFTTixLQUFULEVBQW1COztBQUUvQix3QkFBSU0sdUNBQUosRUFBbUM7O0FBRS9CVCwrQkFBT0osS0FBS08sS0FBTCxDQUFQLElBQXNCTSxPQUFPVCxNQUE3QjtBQUNBRCw2QkFBSyxLQUFMO0FBRUgscUJBTEQsTUFLTyxJQUFJVSw4Q0FBSixFQUErQjs7QUFFbENULCtCQUFPSixLQUFLTyxLQUFMLENBQVAsSUFBc0JNLE9BQU9DLFNBQVAsQ0FBaUJkLEtBQUtPLEtBQUwsQ0FBakIsRUFBOEIsTUFBS1osUUFBbkMsQ0FBdEI7QUFDQVEsNkJBQUssS0FBTDtBQUVILHFCQUxNLE1BS0E7O0FBRUgsNEJBQUtVLFdBQVcsSUFBWixJQUFzQkEsV0FBV0UsU0FBckMsRUFDSVYsRUFBRUwsS0FBS08sS0FBTCxDQUFGLElBQWlCTSxNQUFqQjtBQUVQO0FBRUosaUJBbkJEOztBQXFCQSx1QkFBT1YsS0FBS0UsQ0FBTCxHQUFTLDBCQUFnQkQsTUFBaEIsQ0FBaEI7QUFFSCxhQTNCTSxDQUFQO0FBNkJIOzs7Ozs7a0JBR1VQLFkiLCJmaWxlIjoiU2F0aXNmYWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHtcbiAgICBGYWlsdXJlXG59IGZyb20gJ2NyaXRlcmlhLXBhdHRlcm4tY29yZSc7XG5pbXBvcnQgQnVsa0ZhaWx1cmUgZnJvbSAnLi9CdWxrRmFpbHVyZSc7XG5cbmZ1bmN0aW9uIHJlc29sdmVfbWVzc2FnZShrZXksIG1zZywgbWVzc2FnZXMpIHtcblxuICAgIHZhciBjb21iaW5lZCA9IGAke2tleX0uJHttc2d9YDtcblxuICAgIGlmIChtZXNzYWdlc1tjb21iaW5lZF0pXG4gICAgICAgIHJldHVybiBtZXNzYWdlc1tjb21iaW5lZF07XG5cbiAgICBpZiAobWVzc2FnZXNba2V5XSlcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VzW2tleV07XG5cbiAgICBpZiAobWVzc2FnZXNbbXNnXSlcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VzW21zZ107XG5cbiAgICByZXR1cm4gbXNnO1xuXG59XG5cbi8qKlxuICogU2F0aXNmYWN0aW9uIHJ1bnMgY3JpdGVyaW9uIGFsbCBvbmUgYXQgYSB0aW1lIHByb3ZpZGluZ1xuICogYSBjYWxsYmFjayB0byBlYWNoIHRoYXQgYWxsb3dzIGFzeW5jIG9wZXJhdGlvbnMgZHVyaW5nIGZpbHRlcmluZyB0byBiZSBwZXJmb3JtZWQuXG4gKiBAcGFyYW0ge29iamVjdH0gbWVzc2FnZXMgXG4gKiBAaW1wbGVtZW50cyB7U3RyYXRlZ3l9XG4gKi9cbmNsYXNzIFNhdGlzZmFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlcykge1xuXG4gICAgICAgIHRoaXMubWVzc2FnZXMgPSBtZXNzYWdlcyB8fCB7fTtcblxuICAgIH1cblxuICAgIGFwcGx5KHZhbHVlcywgbWFwKSB7XG5cbiAgICAgICAgdmFyIHdvcmsgPSBPYmplY3Qua2V5cyhtYXApO1xuICAgICAgICB2YXIgb2sgPSB0cnVlO1xuICAgICAgICB2YXIgZXJyb3JzID0ge307XG4gICAgICAgIHZhciBvID0ge307XG5cbiAgICAgICAgaWYgKCh0eXBlb2YgdmFsdWVzICE9PSAnb2JqZWN0JykgfHwgKHZhbHVlcyA9PT0gbnVsbCkpXG4gICAgICAgICAgICB2YWx1ZXMgPSB7fTtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwod29yay5tYXAoKGtleSwgaW5kZXgpID0+XG4gICAgICAgICAgICBQcm9taXNlLnJlc29sdmUobWFwW2tleV0uc2F0aXNmeSh2YWx1ZXNba2V5XSkpKSkuXG4gICAgICAgIHRoZW4ocmVzdWx0cyA9PiB7XG5cbiAgICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaCgocmVzdWx0LCBpbmRleCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEJ1bGtGYWlsdXJlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzW3dvcmtbaW5kZXhdXSA9IHJlc3VsdC5lcnJvcnM7XG4gICAgICAgICAgICAgICAgICAgIG9rID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEZhaWx1cmUpIHtcblxuICAgICAgICAgICAgICAgICAgICBlcnJvcnNbd29ya1tpbmRleF1dID0gcmVzdWx0LnRvTWVzc2FnZSh3b3JrW2luZGV4XSwgdGhpcy5tZXNzYWdlcyk7XG4gICAgICAgICAgICAgICAgICAgIG9rID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICgocmVzdWx0ICE9PSBudWxsKSB8fCAocmVzdWx0ICE9PSB1bmRlZmluZWQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgb1t3b3JrW2luZGV4XV0gPSByZXN1bHQ7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gb2sgPyBvIDogbmV3IEJ1bGtGYWlsdXJlKGVycm9ycyk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNhdGlzZmFjdGlvblxuIl19