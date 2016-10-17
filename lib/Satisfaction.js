'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _criteriaPatternCore = require('criteria-pattern-core');

var core = _interopRequireWildcard(_criteriaPatternCore);

var _BulkFailure = require('./BulkFailure');

var _BulkFailure2 = _interopRequireDefault(_BulkFailure);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

                    if (result instanceof core.Failure) {

                        errors[work[index]] = result.set('key', work[index]).setError(resolve_message(work[index], result.error, _this.messages)).toString();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TYXRpc2ZhY3Rpb24uanMiXSwibmFtZXMiOlsiY29yZSIsInJlc29sdmVfbWVzc2FnZSIsImtleSIsIm1zZyIsIm1lc3NhZ2VzIiwiY29tYmluZWQiLCJTYXRpc2ZhY3Rpb24iLCJ2YWx1ZXMiLCJtYXAiLCJ3b3JrIiwiT2JqZWN0Iiwia2V5cyIsIm9rIiwiZXJyb3JzIiwibyIsImFsbCIsImluZGV4IiwicmVzb2x2ZSIsInNhdGlzZnkiLCJ0aGVuIiwicmVzdWx0cyIsImZvckVhY2giLCJyZXN1bHQiLCJGYWlsdXJlIiwic2V0Iiwic2V0RXJyb3IiLCJlcnJvciIsInRvU3RyaW5nIiwidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7SUFBWUEsSTs7QUFDWjs7Ozs7Ozs7OztBQUVBLFNBQVNDLGVBQVQsQ0FBeUJDLEdBQXpCLEVBQThCQyxHQUE5QixFQUFtQ0MsUUFBbkMsRUFBNkM7O0FBRXpDLFFBQUlDLFdBQWNILEdBQWQsU0FBcUJDLEdBQXpCOztBQUVBLFFBQUlDLFNBQVNDLFFBQVQsQ0FBSixFQUNJLE9BQU9ELFNBQVNDLFFBQVQsQ0FBUDs7QUFFSixRQUFJRCxTQUFTRixHQUFULENBQUosRUFDSSxPQUFPRSxTQUFTRixHQUFULENBQVA7O0FBRUosUUFBSUUsU0FBU0QsR0FBVCxDQUFKLEVBQ0ksT0FBT0MsU0FBU0QsR0FBVCxDQUFQOztBQUVKLFdBQU9BLEdBQVA7QUFFSDs7QUFFRDs7Ozs7OztJQU1NRyxZO0FBRUYsMEJBQVlGLFFBQVosRUFBc0I7QUFBQTs7QUFFbEIsYUFBS0EsUUFBTCxHQUFnQkEsWUFBWSxFQUE1QjtBQUVIOzs7OzhCQUVLRyxNLEVBQVFDLEcsRUFBSztBQUFBOztBQUVmLGdCQUFJQyxPQUFPQyxPQUFPQyxJQUFQLENBQVlILEdBQVosQ0FBWDtBQUNBLGdCQUFJSSxLQUFLLElBQVQ7QUFDQSxnQkFBSUMsU0FBUyxFQUFiO0FBQ0EsZ0JBQUlDLElBQUksRUFBUjs7QUFFQSxnQkFBSyxRQUFPUCxNQUFQLHlDQUFPQSxNQUFQLE9BQWtCLFFBQW5CLElBQWlDQSxXQUFXLElBQWhELEVBQ0lBLFNBQVMsRUFBVDs7QUFFSixtQkFBTyxtQkFBUVEsR0FBUixDQUFZTixLQUFLRCxHQUFMLENBQVMsVUFBQ04sR0FBRCxFQUFNYyxLQUFOO0FBQUEsdUJBQ3hCLG1CQUFRQyxPQUFSLENBQWdCVCxJQUFJTixHQUFKLEVBQVNnQixPQUFULENBQWlCWCxPQUFPTCxHQUFQLENBQWpCLENBQWhCLENBRHdCO0FBQUEsYUFBVCxDQUFaLEVBRVBpQixJQUZPLENBRUYsbUJBQVc7O0FBRVpDLHdCQUFRQyxPQUFSLENBQWdCLFVBQUNDLE1BQUQsRUFBU04sS0FBVCxFQUFtQjs7QUFFL0Isd0JBQUlNLGtCQUFrQnRCLEtBQUt1QixPQUEzQixFQUFvQzs7QUFFaENWLCtCQUFPSixLQUFLTyxLQUFMLENBQVAsSUFBc0JNLE9BQ3RCRSxHQURzQixDQUNsQixLQURrQixFQUNYZixLQUFLTyxLQUFMLENBRFcsRUFFdEJTLFFBRnNCLENBRWJ4QixnQkFBZ0JRLEtBQUtPLEtBQUwsQ0FBaEIsRUFBNkJNLE9BQU9JLEtBQXBDLEVBQTJDLE1BQUt0QixRQUFoRCxDQUZhLEVBR3RCdUIsUUFIc0IsRUFBdEI7QUFJQWYsNkJBQUssS0FBTDtBQUVILHFCQVJELE1BUU87O0FBRUgsNEJBQUtVLFdBQVcsSUFBWixJQUFzQkEsV0FBV00sU0FBckMsRUFDSWQsRUFBRUwsS0FBS08sS0FBTCxDQUFGLElBQWlCTSxNQUFqQjtBQUVQO0FBRUosaUJBakJEOztBQW1CQSx1QkFBT1YsS0FBS0UsQ0FBTCxHQUFTLDBCQUFnQkQsTUFBaEIsQ0FBaEI7QUFFSCxhQXpCTSxDQUFQO0FBMkJIOzs7Ozs7a0JBR1VQLFkiLCJmaWxlIjoiU2F0aXNmYWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0ICogYXMgY29yZSBmcm9tICdjcml0ZXJpYS1wYXR0ZXJuLWNvcmUnO1xuaW1wb3J0IEJ1bGtGYWlsdXJlIGZyb20gJy4vQnVsa0ZhaWx1cmUnO1xuXG5mdW5jdGlvbiByZXNvbHZlX21lc3NhZ2Uoa2V5LCBtc2csIG1lc3NhZ2VzKSB7XG5cbiAgICB2YXIgY29tYmluZWQgPSBgJHtrZXl9LiR7bXNnfWA7XG5cbiAgICBpZiAobWVzc2FnZXNbY29tYmluZWRdKVxuICAgICAgICByZXR1cm4gbWVzc2FnZXNbY29tYmluZWRdO1xuXG4gICAgaWYgKG1lc3NhZ2VzW2tleV0pXG4gICAgICAgIHJldHVybiBtZXNzYWdlc1trZXldO1xuXG4gICAgaWYgKG1lc3NhZ2VzW21zZ10pXG4gICAgICAgIHJldHVybiBtZXNzYWdlc1ttc2ddO1xuXG4gICAgcmV0dXJuIG1zZztcblxufVxuXG4vKipcbiAqIFNhdGlzZmFjdGlvbiBydW5zIGNyaXRlcmlvbiBhbGwgb25lIGF0IGEgdGltZSBwcm92aWRpbmdcbiAqIGEgY2FsbGJhY2sgdG8gZWFjaCB0aGF0IGFsbG93cyBhc3luYyBvcGVyYXRpb25zIGR1cmluZyBmaWx0ZXJpbmcgdG8gYmUgcGVyZm9ybWVkLlxuICogQHBhcmFtIHtvYmplY3R9IG1lc3NhZ2VzIFxuICogQGltcGxlbWVudHMge1N0cmF0ZWd5fVxuICovXG5jbGFzcyBTYXRpc2ZhY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IobWVzc2FnZXMpIHtcblxuICAgICAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXMgfHwge307XG5cbiAgICB9XG5cbiAgICBhcHBseSh2YWx1ZXMsIG1hcCkge1xuXG4gICAgICAgIHZhciB3b3JrID0gT2JqZWN0LmtleXMobWFwKTtcbiAgICAgICAgdmFyIG9rID0gdHJ1ZTtcbiAgICAgICAgdmFyIGVycm9ycyA9IHt9O1xuICAgICAgICB2YXIgbyA9IHt9O1xuXG4gICAgICAgIGlmICgodHlwZW9mIHZhbHVlcyAhPT0gJ29iamVjdCcpIHx8ICh2YWx1ZXMgPT09IG51bGwpKVxuICAgICAgICAgICAgdmFsdWVzID0ge307XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHdvcmsubWFwKChrZXksIGluZGV4KSA9PlxuICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKG1hcFtrZXldLnNhdGlzZnkodmFsdWVzW2tleV0pKSkpLlxuICAgICAgICB0aGVuKHJlc3VsdHMgPT4ge1xuXG4gICAgICAgICAgICByZXN1bHRzLmZvckVhY2goKHJlc3VsdCwgaW5kZXgpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBjb3JlLkZhaWx1cmUpIHtcblxuICAgICAgICAgICAgICAgICAgICBlcnJvcnNbd29ya1tpbmRleF1dID0gcmVzdWx0LlxuICAgICAgICAgICAgICAgICAgICBzZXQoJ2tleScsIHdvcmtbaW5kZXhdKS5cbiAgICAgICAgICAgICAgICAgICAgc2V0RXJyb3IocmVzb2x2ZV9tZXNzYWdlKHdvcmtbaW5kZXhdLCByZXN1bHQuZXJyb3IsIHRoaXMubWVzc2FnZXMpKS5cbiAgICAgICAgICAgICAgICAgICAgdG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgb2sgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKChyZXN1bHQgIT09IG51bGwpIHx8IChyZXN1bHQgIT09IHVuZGVmaW5lZCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBvW3dvcmtbaW5kZXhdXSA9IHJlc3VsdDtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBvayA/IG8gOiBuZXcgQnVsa0ZhaWx1cmUoZXJyb3JzKTtcblxuICAgICAgICB9KTtcblxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2F0aXNmYWN0aW9uXG4iXX0=