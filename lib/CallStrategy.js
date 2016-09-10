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

function resolve_message(key, msg, messages) {

    var val = concern;
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

        this.messages = messages;
    }

    _createClass(Satisfaction, [{
        key: 'apply',
        value: function apply(values, map) {
            var _this = this;

            var work = Object.keys(map);
            var report = {
                ok: true,
                errors: {},
                values: null
            };

            if (typeof values !== 'object') return _bluebird2['default'].reject(new TypeError('The value supplied must be an object! ' + ('Got \'' + typeof values + '!\'')));

            return _bluebird2['default'].all(work.map(function (key, index) {
                return _bluebird2['default'].resolve(map[key].satisfy(values[key]));
            })).then(function (results) {

                results.forEach(function (result, index) {

                    if (result instanceof core.Failure) {

                        report.errors[work[index]] = result.set('key', key).setMessage(resolve_message(key, result.error, _this.messages)).toString();

                        report.ok = false;
                    } else {

                        if (result !== null) report.values[work[index]] = result;
                    }
                });

                return report;
            });
        }
    }]);

    return Satisfaction;
})();

exports['default'] = Satisfaction;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DYWxsU3RyYXRlZ3kuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7d0JBQW9CLFVBQVU7Ozs7bUNBQ1IsdUJBQXVCOztJQUFqQyxJQUFJOztBQUVoQixTQUFTLGVBQWUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRTs7QUFFekMsUUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDO0FBQ2xCLFFBQUksUUFBUSxHQUFNLEdBQUcsU0FBSSxHQUFHLEFBQUUsQ0FBQzs7QUFFL0IsUUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQ2xCLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUU5QixRQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFDYixPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFekIsV0FBTyxHQUFHLENBQUM7Q0FFZDs7Ozs7Ozs7O0lBUUssWUFBWTtBQUVILGFBRlQsWUFBWSxDQUVGLFFBQVEsRUFBRTs4QkFGcEIsWUFBWTs7QUFJVixZQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztLQUU1Qjs7aUJBTkMsWUFBWTs7ZUFRVCxlQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7OztBQUVmLGdCQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLGdCQUFJLE1BQU0sR0FBRztBQUNULGtCQUFFLEVBQUUsSUFBSTtBQUNSLHNCQUFNLEVBQUUsRUFBRTtBQUNWLHNCQUFNLEVBQUUsSUFBSTthQUNmLENBQUM7O0FBRUYsZ0JBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUMxQixPQUFPLHNCQUFRLE1BQU0sQ0FBQyxJQUFJLFNBQVMsQ0FBQyx1REFDeEIsT0FBTyxNQUFNLFNBQUksQ0FBQyxDQUFDLENBQUM7O0FBRXBDLG1CQUFPLHNCQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBRyxFQUFFLEtBQUs7dUJBQ25DLHNCQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQUEsQ0FBQyxDQUFDLENBQ3BELElBQUksQ0FBQyxVQUFBLE9BQU8sRUFBSTs7QUFFWix1QkFBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUs7O0FBRS9CLHdCQUFJLE1BQU0sWUFBWSxJQUFJLENBQUMsT0FBTyxFQUFFOztBQUVoQyw4QkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQ25DLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQ2YsVUFBVSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFLLFFBQVEsQ0FBQyxDQUFDLENBQzdELFFBQVEsRUFBRSxDQUFDOztBQUVYLDhCQUFNLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztxQkFFckIsTUFBTTs7QUFFSCw0QkFBSSxNQUFNLEtBQUssSUFBSSxFQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO3FCQUUzQztpQkFFSixDQUFDLENBQUM7O0FBRUgsdUJBQU8sTUFBTSxDQUFDO2FBRWpCLENBQUMsQ0FBQztTQUVOOzs7V0FqREMsWUFBWTs7O3FCQW9ESCxZQUFZIiwiZmlsZSI6IkNhbGxTdHJhdGVneS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCAqIGFzIGNvcmUgZnJvbSAnY3JpdGVyaWEtcGF0dGVybi1jb3JlJztcblxuZnVuY3Rpb24gcmVzb2x2ZV9tZXNzYWdlKGtleSwgbXNnLCBtZXNzYWdlcykge1xuXG4gICAgdmFyIHZhbCA9IGNvbmNlcm47XG4gICAgdmFyIGNvbWJpbmVkID0gYCR7a2V5fS4ke21zZ31gO1xuXG4gICAgaWYgKG1lc3NhZ2VzW2NvbWJpbmVkXSlcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VzW2NvbWJpbmVkXTtcblxuICAgIGlmIChtZXNzYWdlc1ttc2ddKVxuICAgICAgICByZXR1cm4gbWVzc2FnZXNbbXNnXTtcblxuICAgIHJldHVybiBtc2c7XG5cbn1cblxuLyoqXG4gKiBTYXRpc2ZhY3Rpb24gcnVucyBjcml0ZXJpb24gYWxsIG9uZSBhdCBhIHRpbWUgcHJvdmlkaW5nXG4gKiBhIGNhbGxiYWNrIHRvIGVhY2ggdGhhdCBhbGxvd3MgYXN5bmMgb3BlcmF0aW9ucyBkdXJpbmcgZmlsdGVyaW5nIHRvIGJlIHBlcmZvcm1lZC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBtZXNzYWdlcyBcbiAqIEBpbXBsZW1lbnRzIHtTdHJhdGVneX1cbiAqL1xuY2xhc3MgU2F0aXNmYWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2VzKSB7XG5cbiAgICAgICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzO1xuXG4gICAgfVxuXG4gICAgYXBwbHkodmFsdWVzLCBtYXApIHtcblxuICAgICAgICB2YXIgd29yayA9IE9iamVjdC5rZXlzKG1hcCk7XG4gICAgICAgIHZhciByZXBvcnQgPSB7XG4gICAgICAgICAgICBvazogdHJ1ZSxcbiAgICAgICAgICAgIGVycm9yczoge30sXG4gICAgICAgICAgICB2YWx1ZXM6IG51bGxcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlcyAhPT0gJ29iamVjdCcpXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihgVGhlIHZhbHVlIHN1cHBsaWVkIG11c3QgYmUgYW4gb2JqZWN0ISBgICtcbiAgICAgICAgICAgICAgICBgR290ICcke3R5cGVvZiB2YWx1ZXN9ISdgKSk7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHdvcmsubWFwKChrZXksIGluZGV4KSA9PlxuICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKG1hcFtrZXldLnNhdGlzZnkodmFsdWVzW2tleV0pKSkpLlxuICAgICAgICB0aGVuKHJlc3VsdHMgPT4ge1xuXG4gICAgICAgICAgICByZXN1bHRzLmZvckVhY2goKHJlc3VsdCwgaW5kZXgpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBjb3JlLkZhaWx1cmUpIHtcblxuICAgICAgICAgICAgICAgICAgICByZXBvcnQuZXJyb3JzW3dvcmtbaW5kZXhdXSA9IHJlc3VsdC5cbiAgICAgICAgICAgICAgICAgICAgc2V0KCdrZXknLCBrZXkpLlxuICAgICAgICAgICAgICAgICAgICBzZXRNZXNzYWdlKHJlc29sdmVfbWVzc2FnZShrZXksIHJlc3VsdC5lcnJvciwgdGhpcy5tZXNzYWdlcykpLlxuICAgICAgICAgICAgICAgICAgICB0b1N0cmluZygpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydC5vayA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwb3J0LnZhbHVlc1t3b3JrW2luZGV4XV0gPSByZXN1bHQ7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0O1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTYXRpc2ZhY3Rpb25cbiJdfQ==