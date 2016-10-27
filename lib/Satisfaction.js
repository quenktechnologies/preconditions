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

                if (values[key] === null || values[key] === undefined) if (map[key].required !== true) return null;

                return _bluebird2.default.resolve(map[key].satisfy(values[key]));
            })).then(function (results) {

                results.forEach(function (result, index) {

                    if (result instanceof _BulkFailure2.default) {

                        errors[work[index]] = result.errors;
                        ok = false;
                    } else if (result instanceof _criteriaPatternCore.Failure) {

                        errors[work[index]] = result.toMessage(work[index], _this.messages);
                        ok = false;
                    } else if (result !== null && result !== undefined) {

                        o[work[index]] = result;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TYXRpc2ZhY3Rpb24uanMiXSwibmFtZXMiOlsicmVzb2x2ZV9tZXNzYWdlIiwia2V5IiwibXNnIiwibWVzc2FnZXMiLCJjb21iaW5lZCIsIlNhdGlzZmFjdGlvbiIsInZhbHVlcyIsIm1hcCIsIndvcmsiLCJPYmplY3QiLCJrZXlzIiwib2siLCJlcnJvcnMiLCJvIiwiYWxsIiwiaW5kZXgiLCJ1bmRlZmluZWQiLCJyZXF1aXJlZCIsInJlc29sdmUiLCJzYXRpc2Z5IiwidGhlbiIsInJlc3VsdHMiLCJmb3JFYWNoIiwicmVzdWx0IiwidG9NZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFHQTs7Ozs7Ozs7QUFFQSxTQUFTQSxlQUFULENBQXlCQyxHQUF6QixFQUE4QkMsR0FBOUIsRUFBbUNDLFFBQW5DLEVBQTZDOztBQUV6QyxRQUFJQyxXQUFjSCxHQUFkLFNBQXFCQyxHQUF6Qjs7QUFFQSxRQUFJQyxTQUFTQyxRQUFULENBQUosRUFDSSxPQUFPRCxTQUFTQyxRQUFULENBQVA7O0FBRUosUUFBSUQsU0FBU0YsR0FBVCxDQUFKLEVBQ0ksT0FBT0UsU0FBU0YsR0FBVCxDQUFQOztBQUVKLFFBQUlFLFNBQVNELEdBQVQsQ0FBSixFQUNJLE9BQU9DLFNBQVNELEdBQVQsQ0FBUDs7QUFFSixXQUFPQSxHQUFQO0FBRUg7O0FBRUQ7Ozs7Ozs7SUFNTUcsWTtBQUVGLDBCQUFZRixRQUFaLEVBQXNCO0FBQUE7O0FBRWxCLGFBQUtBLFFBQUwsR0FBZ0JBLFlBQVksRUFBNUI7QUFFSDs7Ozs4QkFFS0csTSxFQUFRQyxHLEVBQUs7QUFBQTs7QUFFZixnQkFBSUMsT0FBT0MsT0FBT0MsSUFBUCxDQUFZSCxHQUFaLENBQVg7QUFDQSxnQkFBSUksS0FBSyxJQUFUO0FBQ0EsZ0JBQUlDLFNBQVMsRUFBYjtBQUNBLGdCQUFJQyxJQUFJLEVBQVI7O0FBRUEsZ0JBQUssUUFBT1AsTUFBUCx5Q0FBT0EsTUFBUCxPQUFrQixRQUFuQixJQUFpQ0EsV0FBVyxJQUFoRCxFQUNJQSxTQUFTLEVBQVQ7O0FBRUosbUJBQU8sbUJBQVFRLEdBQVIsQ0FBWU4sS0FBS0QsR0FBTCxDQUFTLFVBQUNOLEdBQUQsRUFBTWMsS0FBTixFQUFnQjs7QUFFeEMsb0JBQUtULE9BQU9MLEdBQVAsTUFBZ0IsSUFBakIsSUFBMkJLLE9BQU9MLEdBQVAsTUFBZ0JlLFNBQS9DLEVBQ0ksSUFBSVQsSUFBSU4sR0FBSixFQUFTZ0IsUUFBVCxLQUFzQixJQUExQixFQUNJLE9BQU8sSUFBUDs7QUFFUix1QkFBTyxtQkFBUUMsT0FBUixDQUFnQlgsSUFBSU4sR0FBSixFQUFTa0IsT0FBVCxDQUFpQmIsT0FBT0wsR0FBUCxDQUFqQixDQUFoQixDQUFQO0FBRUgsYUFSa0IsQ0FBWixFQVNQbUIsSUFUTyxDQVNGLG1CQUFXOztBQUVaQyx3QkFBUUMsT0FBUixDQUFnQixVQUFDQyxNQUFELEVBQVNSLEtBQVQsRUFBbUI7O0FBRS9CLHdCQUFJUSx1Q0FBSixFQUFtQzs7QUFFL0JYLCtCQUFPSixLQUFLTyxLQUFMLENBQVAsSUFBc0JRLE9BQU9YLE1BQTdCO0FBQ0FELDZCQUFLLEtBQUw7QUFFSCxxQkFMRCxNQUtPLElBQUlZLDhDQUFKLEVBQStCOztBQUVsQ1gsK0JBQU9KLEtBQUtPLEtBQUwsQ0FBUCxJQUFzQlEsT0FBT0MsU0FBUCxDQUFpQmhCLEtBQUtPLEtBQUwsQ0FBakIsRUFBOEIsTUFBS1osUUFBbkMsQ0FBdEI7QUFDQVEsNkJBQUssS0FBTDtBQUVILHFCQUxNLE1BS0EsSUFBS1ksV0FBVyxJQUFaLElBQXNCQSxXQUFXUCxTQUFyQyxFQUFpRDs7QUFFcERILDBCQUFFTCxLQUFLTyxLQUFMLENBQUYsSUFBaUJRLE1BQWpCO0FBRUg7QUFFSixpQkFsQkQ7O0FBb0JBLHVCQUFPWixLQUFLRSxDQUFMLEdBQVMsMEJBQWdCRCxNQUFoQixDQUFoQjtBQUVILGFBakNNLENBQVA7QUFtQ0g7Ozs7OztrQkFHVVAsWSIsImZpbGUiOiJTYXRpc2ZhY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQge1xuICAgIEZhaWx1cmVcbn0gZnJvbSAnY3JpdGVyaWEtcGF0dGVybi1jb3JlJztcbmltcG9ydCBCdWxrRmFpbHVyZSBmcm9tICcuL0J1bGtGYWlsdXJlJztcblxuZnVuY3Rpb24gcmVzb2x2ZV9tZXNzYWdlKGtleSwgbXNnLCBtZXNzYWdlcykge1xuXG4gICAgdmFyIGNvbWJpbmVkID0gYCR7a2V5fS4ke21zZ31gO1xuXG4gICAgaWYgKG1lc3NhZ2VzW2NvbWJpbmVkXSlcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VzW2NvbWJpbmVkXTtcblxuICAgIGlmIChtZXNzYWdlc1trZXldKVxuICAgICAgICByZXR1cm4gbWVzc2FnZXNba2V5XTtcblxuICAgIGlmIChtZXNzYWdlc1ttc2ddKVxuICAgICAgICByZXR1cm4gbWVzc2FnZXNbbXNnXTtcblxuICAgIHJldHVybiBtc2c7XG5cbn1cblxuLyoqXG4gKiBTYXRpc2ZhY3Rpb24gcnVucyBjcml0ZXJpb24gYWxsIG9uZSBhdCBhIHRpbWUgcHJvdmlkaW5nXG4gKiBhIGNhbGxiYWNrIHRvIGVhY2ggdGhhdCBhbGxvd3MgYXN5bmMgb3BlcmF0aW9ucyBkdXJpbmcgZmlsdGVyaW5nIHRvIGJlIHBlcmZvcm1lZC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBtZXNzYWdlcyBcbiAqIEBpbXBsZW1lbnRzIHtTdHJhdGVneX1cbiAqL1xuY2xhc3MgU2F0aXNmYWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2VzKSB7XG5cbiAgICAgICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzIHx8IHt9O1xuXG4gICAgfVxuXG4gICAgYXBwbHkodmFsdWVzLCBtYXApIHtcblxuICAgICAgICB2YXIgd29yayA9IE9iamVjdC5rZXlzKG1hcCk7XG4gICAgICAgIHZhciBvayA9IHRydWU7XG4gICAgICAgIHZhciBlcnJvcnMgPSB7fTtcbiAgICAgICAgdmFyIG8gPSB7fTtcblxuICAgICAgICBpZiAoKHR5cGVvZiB2YWx1ZXMgIT09ICdvYmplY3QnKSB8fCAodmFsdWVzID09PSBudWxsKSlcbiAgICAgICAgICAgIHZhbHVlcyA9IHt9O1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbCh3b3JrLm1hcCgoa2V5LCBpbmRleCkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoKHZhbHVlc1trZXldID09PSBudWxsKSB8fCAodmFsdWVzW2tleV0gPT09IHVuZGVmaW5lZCkpXG4gICAgICAgICAgICAgICAgaWYgKG1hcFtrZXldLnJlcXVpcmVkICE9PSB0cnVlKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShtYXBba2V5XS5zYXRpc2Z5KHZhbHVlc1trZXldKSlcblxuICAgICAgICB9KSkuXG4gICAgICAgIHRoZW4ocmVzdWx0cyA9PiB7XG5cbiAgICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaCgocmVzdWx0LCBpbmRleCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEJ1bGtGYWlsdXJlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzW3dvcmtbaW5kZXhdXSA9IHJlc3VsdC5lcnJvcnM7XG4gICAgICAgICAgICAgICAgICAgIG9rID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEZhaWx1cmUpIHtcblxuICAgICAgICAgICAgICAgICAgICBlcnJvcnNbd29ya1tpbmRleF1dID0gcmVzdWx0LnRvTWVzc2FnZSh3b3JrW2luZGV4XSwgdGhpcy5tZXNzYWdlcyk7XG4gICAgICAgICAgICAgICAgICAgIG9rID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChyZXN1bHQgIT09IG51bGwpICYmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkpIHtcblxuICAgICAgICAgICAgICAgICAgICBvW3dvcmtbaW5kZXhdXSA9IHJlc3VsdDtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBvayA/IG8gOiBuZXcgQnVsa0ZhaWx1cmUoZXJyb3JzKTtcblxuICAgICAgICB9KTtcblxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2F0aXNmYWN0aW9uXG4iXX0=