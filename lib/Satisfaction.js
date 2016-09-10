'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _criteriaPatternCore = require('criteria-pattern-core');

var core = _interopRequireWildcard(_criteriaPatternCore);

var _BulkFailure = require('./BulkFailure');

var _BulkFailure2 = _interopRequireDefault(_BulkFailure);

function resolve_message(key, msg, messages) {

    var combined = key + '.' + msg;

    if (messages[combined]) return messages[combined];

    if (messages[msg]) return messages[msg];

    return msg;
}

/**
 * Satisfaction runs criterion all one at a time providing
 * a callback to each that allows async operations during filtering to be performed.
 * @param {object} messages 
 * @implements {Strategy}
 */

var Satisfaction = (function () {
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

            if (typeof values !== 'object') return _bluebird2['default'].reject(new TypeError('The value supplied must be an object! ' + ('Got \'' + typeof values + '!\'')));

            return _bluebird2['default'].all(work.map(function (key, index) {
                return _bluebird2['default'].resolve(map[key].satisfy(values[key]));
            })).then(function (results) {

                results.forEach(function (result, index) {

                    if (result instanceof core.Failure) {

                        errors[work[index]] = result.set('key', work[index]).setError(resolve_message(work[index], result.error, _this.messages)).toString();
                        ok = false;
                    } else {

                        if (result !== null) o[work[index]] = result;
                    }
                });

                return ok ? o : new _BulkFailure2['default'](errors);
            });
        }
    }]);

    return Satisfaction;
})();

exports['default'] = Satisfaction;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TYXRpc2ZhY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7d0JBQW9CLFVBQVU7Ozs7bUNBQ1IsdUJBQXVCOztJQUFqQyxJQUFJOzsyQkFDUSxlQUFlOzs7O0FBRXZDLFNBQVMsZUFBZSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFOztBQUV6QyxRQUFJLFFBQVEsR0FBTSxHQUFHLFNBQUksR0FBRyxBQUFFLENBQUM7O0FBRS9CLFFBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUNsQixPQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFOUIsUUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQ2IsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXpCLFdBQU8sR0FBRyxDQUFDO0NBRWQ7Ozs7Ozs7OztJQVFLLFlBQVk7QUFFSCxhQUZULFlBQVksQ0FFRixRQUFRLEVBQUU7OEJBRnBCLFlBQVk7O0FBSVYsWUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksRUFBRSxDQUFDO0tBRWxDOztpQkFOQyxZQUFZOztlQVFULGVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTs7O0FBRWYsZ0JBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsZ0JBQUksRUFBRSxHQUFHLElBQUksQ0FBQztBQUNkLGdCQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsZ0JBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFWCxnQkFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQzFCLE9BQU8sc0JBQVEsTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLHVEQUN4QixPQUFPLE1BQU0sU0FBSSxDQUFDLENBQUMsQ0FBQzs7QUFFcEMsbUJBQU8sc0JBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSzt1QkFDbkMsc0JBQVEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFBQSxDQUFDLENBQUMsQ0FDcEQsSUFBSSxDQUFDLFVBQUEsT0FBTyxFQUFJOztBQUVaLHVCQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFFLEtBQUssRUFBSzs7QUFFL0Isd0JBQUksTUFBTSxZQUFZLElBQUksQ0FBQyxPQUFPLEVBQUU7O0FBRWhDLDhCQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUM1QixHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUN2QixRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQUssUUFBUSxDQUFDLENBQUMsQ0FDbkUsUUFBUSxFQUFFLENBQUM7QUFDWCwwQkFBRSxHQUFHLEtBQUssQ0FBQztxQkFFZCxNQUFNOztBQUVILDRCQUFJLE1BQU0sS0FBSyxJQUFJLEVBQ2YsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztxQkFFL0I7aUJBRUosQ0FBQyxDQUFDOztBQUVILHVCQUFPLEVBQUUsR0FBRyxDQUFDLEdBQUcsNkJBQWdCLE1BQU0sQ0FBQyxDQUFDO2FBRTNDLENBQUMsQ0FBQztTQUVOOzs7V0E5Q0MsWUFBWTs7O3FCQWlESCxZQUFZIiwiZmlsZSI6IlNhdGlzZmFjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCAqIGFzIGNvcmUgZnJvbSAnY3JpdGVyaWEtcGF0dGVybi1jb3JlJztcbmltcG9ydCBCdWxrRmFpbHVyZSBmcm9tICcuL0J1bGtGYWlsdXJlJztcblxuZnVuY3Rpb24gcmVzb2x2ZV9tZXNzYWdlKGtleSwgbXNnLCBtZXNzYWdlcykge1xuXG4gICAgdmFyIGNvbWJpbmVkID0gYCR7a2V5fS4ke21zZ31gO1xuXG4gICAgaWYgKG1lc3NhZ2VzW2NvbWJpbmVkXSlcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VzW2NvbWJpbmVkXTtcblxuICAgIGlmIChtZXNzYWdlc1ttc2ddKVxuICAgICAgICByZXR1cm4gbWVzc2FnZXNbbXNnXTtcblxuICAgIHJldHVybiBtc2c7XG5cbn1cblxuLyoqXG4gKiBTYXRpc2ZhY3Rpb24gcnVucyBjcml0ZXJpb24gYWxsIG9uZSBhdCBhIHRpbWUgcHJvdmlkaW5nXG4gKiBhIGNhbGxiYWNrIHRvIGVhY2ggdGhhdCBhbGxvd3MgYXN5bmMgb3BlcmF0aW9ucyBkdXJpbmcgZmlsdGVyaW5nIHRvIGJlIHBlcmZvcm1lZC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBtZXNzYWdlcyBcbiAqIEBpbXBsZW1lbnRzIHtTdHJhdGVneX1cbiAqL1xuY2xhc3MgU2F0aXNmYWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2VzKSB7XG5cbiAgICAgICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzIHx8IHt9O1xuXG4gICAgfVxuXG4gICAgYXBwbHkodmFsdWVzLCBtYXApIHtcblxuICAgICAgICB2YXIgd29yayA9IE9iamVjdC5rZXlzKG1hcCk7XG4gICAgICAgIHZhciBvayA9IHRydWU7XG4gICAgICAgIHZhciBlcnJvcnMgPSB7fTtcbiAgICAgICAgdmFyIG8gPSB7fTtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlcyAhPT0gJ29iamVjdCcpXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihgVGhlIHZhbHVlIHN1cHBsaWVkIG11c3QgYmUgYW4gb2JqZWN0ISBgICtcbiAgICAgICAgICAgICAgICBgR290ICcke3R5cGVvZiB2YWx1ZXN9ISdgKSk7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHdvcmsubWFwKChrZXksIGluZGV4KSA9PlxuICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKG1hcFtrZXldLnNhdGlzZnkodmFsdWVzW2tleV0pKSkpLlxuICAgICAgICB0aGVuKHJlc3VsdHMgPT4ge1xuXG4gICAgICAgICAgICByZXN1bHRzLmZvckVhY2goKHJlc3VsdCwgaW5kZXgpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBjb3JlLkZhaWx1cmUpIHtcblxuICAgICAgICAgICAgICAgICAgICBlcnJvcnNbd29ya1tpbmRleF1dID0gcmVzdWx0LlxuICAgICAgICAgICAgICAgICAgICBzZXQoJ2tleScsIHdvcmtbaW5kZXhdKS5cbiAgICAgICAgICAgICAgICAgICAgc2V0RXJyb3IocmVzb2x2ZV9tZXNzYWdlKHdvcmtbaW5kZXhdLCByZXN1bHQuZXJyb3IsIHRoaXMubWVzc2FnZXMpKS5cbiAgICAgICAgICAgICAgICAgICAgdG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgb2sgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgIG9bd29ya1tpbmRleF1dID0gcmVzdWx0O1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIG9rID8gbyA6IG5ldyBCdWxrRmFpbHVyZShlcnJvcnMpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTYXRpc2ZhY3Rpb25cbiJdfQ==