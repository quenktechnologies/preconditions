'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * MapError
 */
var MapError = function (_Error) {
    _inherits(MapError, _Error);

    function MapError() {
        var errors = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var message = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

        _classCallCheck(this, MapError);

        var _this = _possibleConstructorReturn(this, (MapError.__proto__ || Object.getPrototypeOf(MapError)).call(this, message));

        Object.defineProperties(_this, {

            errors: {
                configurable: true,
                enumerable: true,
                writable: true,
                value: errors
            },
            message: {
                configurable: true,
                enumerable: true,
                writable: true,
                value: message
            },
            name: {
                configurable: true,
                enumerable: false,
                writable: true,
                value: _this.constructor.name
            },
            stack: {
                configurable: true,
                enumerable: false,
                writable: true,
                value: new Error(message).stack
            },
            expand: {
                configurable: true,
                enumerable: false,
                writable: true,
                value: function value(str, context) {

                    return typeof str === 'string' ? str.replace(/\{([\w\$\.\-]*)}/g, function (s, k) {
                        return context[k] || '';
                    }) : '';
                }

            },
            asObject: {
                configurable: true,
                enumerable: false,
                writable: true,
                value: function value(templates) {
                    var _this2 = this;

                    var errors = this.errors;
                    var combined;
                    var message;

                    return Object.keys(errors).reduce(function (prev, curr) {

                        if (errors[curr].asObject) {

                            prev[curr] = errors[curr].asObject(templates);
                        } else if (errors[curr] instanceof Error) {

                            message = errors[curr].message;
                            combined = curr + '.' + message;

                            if (templates[combined]) {

                                prev[curr] = _this2.expand(templates[combined], errors[curr]);
                            } else if (templates[message]) {

                                prev[curr] = _this2.expand(templates[message], errors[curr]);
                            } else {

                                prev[curr] = _this2.expand(message, errors[curr]);
                            }
                        } else if (typeof errors[curr] === 'string') {

                            prev[curr] = _this2.expand(errors[curr], {}, templates);
                        } else {

                            prev[curr] = errors[curr];
                        }

                        return prev;
                    }, {});
                }

            }
        });

        if (Error.hasOwnProperty('captureStackTrace')) {
            Error.captureStackTrace(_this, _this.constructor);
            return _possibleConstructorReturn(_this);
        }

        return _this;
    }

    /**
     * expand a templated string.
     * @param {string} str
     * @param {object} context description
     * @returns {string}
     */


    _createClass(MapError, [{
        key: 'expand',
        value: function expand(str, context) {}

        /**
         * toObject turns this object into a regular js object.
         */

    }, {
        key: 'asObject',
        value: function asObject(templates) {}
    }]);

    return MapError;
}(Error);

exports.default = MapError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVjb25kaXRpb25zL01hcEVycm9yLmpzIl0sIm5hbWVzIjpbIk1hcEVycm9yIiwiZXJyb3JzIiwibWVzc2FnZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnRpZXMiLCJjb25maWd1cmFibGUiLCJlbnVtZXJhYmxlIiwid3JpdGFibGUiLCJ2YWx1ZSIsIm5hbWUiLCJjb25zdHJ1Y3RvciIsInN0YWNrIiwiRXJyb3IiLCJleHBhbmQiLCJzdHIiLCJjb250ZXh0IiwicmVwbGFjZSIsInMiLCJrIiwiYXNPYmplY3QiLCJ0ZW1wbGF0ZXMiLCJjb21iaW5lZCIsImtleXMiLCJyZWR1Y2UiLCJwcmV2IiwiY3VyciIsImhhc093blByb3BlcnR5IiwiY2FwdHVyZVN0YWNrVHJhY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztJQUdNQSxROzs7QUFFRix3QkFBdUM7QUFBQSxZQUEzQkMsTUFBMkIseURBQWxCLEVBQWtCO0FBQUEsWUFBZEMsT0FBYyx5REFBSixFQUFJOztBQUFBOztBQUFBLHdIQUU3QkEsT0FGNkI7O0FBSW5DQyxlQUFPQyxnQkFBUCxRQUE4Qjs7QUFFMUJILG9CQUFRO0FBQ0pJLDhCQUFjLElBRFY7QUFFSkMsNEJBQVksSUFGUjtBQUdKQywwQkFBVSxJQUhOO0FBSUpDLHVCQUFPUDtBQUpILGFBRmtCO0FBUTFCQyxxQkFBUztBQUNMRyw4QkFBYyxJQURUO0FBRUxDLDRCQUFZLElBRlA7QUFHTEMsMEJBQVUsSUFITDtBQUlMQyx1QkFBT047QUFKRixhQVJpQjtBQWMxQk8sa0JBQU07QUFDRkosOEJBQWMsSUFEWjtBQUVGQyw0QkFBWSxLQUZWO0FBR0ZDLDBCQUFVLElBSFI7QUFJRkMsdUJBQU8sTUFBS0UsV0FBTCxDQUFpQkQ7QUFKdEIsYUFkb0I7QUFvQjFCRSxtQkFBTztBQUNITiw4QkFBYyxJQURYO0FBRUhDLDRCQUFZLEtBRlQ7QUFHSEMsMEJBQVUsSUFIUDtBQUlIQyx1QkFBUSxJQUFJSSxLQUFKLENBQVVWLE9BQVYsQ0FBRCxDQUFxQlM7QUFKekIsYUFwQm1CO0FBMEIxQkUsb0JBQVE7QUFDSlIsOEJBQWMsSUFEVjtBQUVKQyw0QkFBWSxLQUZSO0FBR0pDLDBCQUFVLElBSE47QUFJSkMsdUJBQU8sZUFBU00sR0FBVCxFQUFjQyxPQUFkLEVBQXVCOztBQUUxQiwyQkFBUSxPQUFPRCxHQUFQLEtBQWUsUUFBaEIsR0FDSEEsSUFBSUUsT0FBSixDQUFZLG1CQUFaLEVBQWlDLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLCtCQUFVSCxRQUFRRyxDQUFSLEtBQWMsRUFBeEI7QUFBQSxxQkFBakMsQ0FERyxHQUM0RCxFQURuRTtBQUdIOztBQVRHLGFBMUJrQjtBQXNDMUJDLHNCQUFVO0FBQ05kLDhCQUFjLElBRFI7QUFFTkMsNEJBQVksS0FGTjtBQUdOQywwQkFBVSxJQUhKO0FBSU5DLHVCQUFPLGVBQVNZLFNBQVQsRUFBb0I7QUFBQTs7QUFFdkIsd0JBQUluQixTQUFTLEtBQUtBLE1BQWxCO0FBQ0Esd0JBQUlvQixRQUFKO0FBQ0Esd0JBQUluQixPQUFKOztBQUVBLDJCQUFPQyxPQUFPbUIsSUFBUCxDQUFZckIsTUFBWixFQUNQc0IsTUFETyxDQUNBLFVBQUNDLElBQUQsRUFBT0MsSUFBUCxFQUFnQjs7QUFFbkIsNEJBQUl4QixPQUFPd0IsSUFBUCxFQUFhTixRQUFqQixFQUEyQjs7QUFFdkJLLGlDQUFLQyxJQUFMLElBQWF4QixPQUFPd0IsSUFBUCxFQUFhTixRQUFiLENBQXNCQyxTQUF0QixDQUFiO0FBRUgseUJBSkQsTUFJTyxJQUFJbkIsT0FBT3dCLElBQVAsYUFBd0JiLEtBQTVCLEVBQW1DOztBQUV0Q1Ysc0NBQVVELE9BQU93QixJQUFQLEVBQWF2QixPQUF2QjtBQUNBbUIsdUNBQWNJLElBQWQsU0FBc0J2QixPQUF0Qjs7QUFFQSxnQ0FBSWtCLFVBQVVDLFFBQVYsQ0FBSixFQUF5Qjs7QUFFckJHLHFDQUFLQyxJQUFMLElBQWEsT0FBS1osTUFBTCxDQUFZTyxVQUFVQyxRQUFWLENBQVosRUFBaUNwQixPQUFPd0IsSUFBUCxDQUFqQyxDQUFiO0FBRUgsNkJBSkQsTUFJTyxJQUFJTCxVQUFVbEIsT0FBVixDQUFKLEVBQXdCOztBQUUzQnNCLHFDQUFLQyxJQUFMLElBQWEsT0FBS1osTUFBTCxDQUFZTyxVQUFVbEIsT0FBVixDQUFaLEVBQWdDRCxPQUFPd0IsSUFBUCxDQUFoQyxDQUFiO0FBRUgsNkJBSk0sTUFJQTs7QUFFSEQscUNBQUtDLElBQUwsSUFBYSxPQUFLWixNQUFMLENBQVlYLE9BQVosRUFBcUJELE9BQU93QixJQUFQLENBQXJCLENBQWI7QUFFSDtBQUVKLHlCQW5CTSxNQW1CQSxJQUFJLE9BQU94QixPQUFPd0IsSUFBUCxDQUFQLEtBQXdCLFFBQTVCLEVBQXNDOztBQUV6Q0QsaUNBQUtDLElBQUwsSUFBYSxPQUFLWixNQUFMLENBQVlaLE9BQU93QixJQUFQLENBQVosRUFBMEIsRUFBMUIsRUFBOEJMLFNBQTlCLENBQWI7QUFFSCx5QkFKTSxNQUlBOztBQUVISSxpQ0FBS0MsSUFBTCxJQUFheEIsT0FBT3dCLElBQVAsQ0FBYjtBQUVIOztBQUVELCtCQUFPRCxJQUFQO0FBRUgscUJBdENNLEVBc0NKLEVBdENJLENBQVA7QUF1Q0g7O0FBakRLO0FBdENnQixTQUE5Qjs7QUE0RkEsWUFBSVosTUFBTWMsY0FBTixDQUFxQixtQkFBckIsQ0FBSixFQUErQztBQUMzQ2Qsa0JBQU1lLGlCQUFOLFFBQThCLE1BQUtqQixXQUFuQztBQUNBO0FBQ0g7O0FBbkdrQztBQXFHdEM7O0FBRUQ7Ozs7Ozs7Ozs7K0JBTU9JLEcsRUFBS0MsTyxFQUFTLENBRXBCOztBQUVEOzs7Ozs7aUNBR1NLLFMsRUFBVyxDQUVuQjs7OztFQXhIa0JSLEs7O2tCQTRIUlosUSIsImZpbGUiOiJNYXBFcnJvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTWFwRXJyb3JcbiAqL1xuY2xhc3MgTWFwRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG5cbiAgICBjb25zdHJ1Y3RvcihlcnJvcnMgPSB7fSwgbWVzc2FnZSA9ICcnKSB7XG5cbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuXG4gICAgICAgICAgICBlcnJvcnM6IHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZXJyb3JzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWVzc2FnZToge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBtZXNzYWdlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZToge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0YWNrOiB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAobmV3IEVycm9yKG1lc3NhZ2UpKS5zdGFjayxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBleHBhbmQ6IHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHN0ciwgY29udGV4dCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAodHlwZW9mIHN0ciA9PT0gJ3N0cmluZycpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ci5yZXBsYWNlKC9cXHsoW1xcd1xcJFxcLlxcLV0qKX0vZywgKHMsIGspID0+IGNvbnRleHRba10gfHwgJycpIDogJyc7XG5cbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXNPYmplY3Q6IHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHRlbXBsYXRlcykge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvcnMgPSB0aGlzLmVycm9ycztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZXJyb3JzKS5cbiAgICAgICAgICAgICAgICAgICAgcmVkdWNlKChwcmV2LCBjdXJyKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcnNbY3Vycl0uYXNPYmplY3QpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZbY3Vycl0gPSBlcnJvcnNbY3Vycl0uYXNPYmplY3QodGVtcGxhdGVzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvcnNbY3Vycl0gaW5zdGFuY2VvZiBFcnJvcikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IGVycm9yc1tjdXJyXS5tZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbWJpbmVkID0gYCR7Y3Vycn0uJHttZXNzYWdlfWA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGVtcGxhdGVzW2NvbWJpbmVkXSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZbY3Vycl0gPSB0aGlzLmV4cGFuZCh0ZW1wbGF0ZXNbY29tYmluZWRdLCBlcnJvcnNbY3Vycl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0ZW1wbGF0ZXNbbWVzc2FnZV0pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2N1cnJdID0gdGhpcy5leHBhbmQodGVtcGxhdGVzW21lc3NhZ2VdLCBlcnJvcnNbY3Vycl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2N1cnJdID0gdGhpcy5leHBhbmQobWVzc2FnZSwgZXJyb3JzW2N1cnJdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZXJyb3JzW2N1cnJdID09PSAnc3RyaW5nJykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldltjdXJyXSA9IHRoaXMuZXhwYW5kKGVycm9yc1tjdXJyXSwge30sIHRlbXBsYXRlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2N1cnJdID0gZXJyb3JzW2N1cnJdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuXG4gICAgICAgICAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKEVycm9yLmhhc093blByb3BlcnR5KCdjYXB0dXJlU3RhY2tUcmFjZScpKSB7XG4gICAgICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZXhwYW5kIGEgdGVtcGxhdGVkIHN0cmluZy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHQgZGVzY3JpcHRpb25cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGV4cGFuZChzdHIsIGNvbnRleHQpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRvT2JqZWN0IHR1cm5zIHRoaXMgb2JqZWN0IGludG8gYSByZWd1bGFyIGpzIG9iamVjdC5cbiAgICAgKi9cbiAgICBhc09iamVjdCh0ZW1wbGF0ZXMpIHtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBNYXBFcnJvclxuIl19