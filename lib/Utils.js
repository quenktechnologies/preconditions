"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Utils provides internally helpful methods.
 */
var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, [{
        key: "merge",


        /**
         * merge the properties of src into dest ignoring
         * any that appear in exclude.
         * @param {Object} src
         * @param {Object} dest
         * @param {string|Array} [exclude]
         */
        value: function merge(src, dest, exclude) {

            exclude = Array.isArray(exclude) ? exclude : [exclude];

            Object.keys(src).forEach(function (key) {

                if (exclude.indexOf(key) > -1) return;

                Object.defineProperty(dest, key, {
                    configurable: false,
                    enumerable: true,
                    value: src[key]
                });
            });
        }

        /**
         * hidden hides a property from enumeration.
         * @param {Object} o
         * @param {string} key
         * @param {*} value
         */

    }, {
        key: "hidden",
        value: function hidden(o, key, value) {

            Object.defineProperty(o, key, {
                configurable: false,
                enumerable: false,
                value: value
            });
        }
    }]);

    return Utils;
}();

exports.default = new Utils();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9VdGlscy5qcyJdLCJuYW1lcyI6WyJVdGlscyIsInNyYyIsImRlc3QiLCJleGNsdWRlIiwiQXJyYXkiLCJpc0FycmF5IiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJpbmRleE9mIiwiZGVmaW5lUHJvcGVydHkiLCJjb25maWd1cmFibGUiLCJlbnVtZXJhYmxlIiwidmFsdWUiLCJvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7OztJQUdNQSxLOzs7Ozs7Ozs7QUFFRjs7Ozs7Ozs4QkFPTUMsRyxFQUFLQyxJLEVBQU1DLE8sRUFBUzs7QUFFdEJBLHNCQUFVQyxNQUFNQyxPQUFOLENBQWNGLE9BQWQsSUFBeUJBLE9BQXpCLEdBQW1DLENBQUNBLE9BQUQsQ0FBN0M7O0FBRUFHLG1CQUFPQyxJQUFQLENBQVlOLEdBQVosRUFBaUJPLE9BQWpCLENBQXlCLFVBQUNDLEdBQUQsRUFBUzs7QUFFOUIsb0JBQUlOLFFBQVFPLE9BQVIsQ0FBZ0JELEdBQWhCLElBQXVCLENBQUMsQ0FBNUIsRUFBK0I7O0FBRS9CSCx1QkFBT0ssY0FBUCxDQUFzQlQsSUFBdEIsRUFBNEJPLEdBQTVCLEVBQWlDO0FBQzdCRyxrQ0FBYyxLQURlO0FBRTdCQyxnQ0FBWSxJQUZpQjtBQUc3QkMsMkJBQU9iLElBQUlRLEdBQUo7QUFIc0IsaUJBQWpDO0FBTUgsYUFWRDtBQVdIOztBQUVEOzs7Ozs7Ozs7K0JBTU9NLEMsRUFBR04sRyxFQUFLSyxLLEVBQU87O0FBRWxCUixtQkFBT0ssY0FBUCxDQUFzQkksQ0FBdEIsRUFBeUJOLEdBQXpCLEVBQThCO0FBQzFCRyw4QkFBYyxLQURZO0FBRTFCQyw0QkFBWSxLQUZjO0FBRzFCQyx1QkFBT0E7QUFIbUIsYUFBOUI7QUFPSDs7Ozs7O2tCQUdVLElBQUlkLEtBQUosRSIsImZpbGUiOiJVdGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXRpbHMgcHJvdmlkZXMgaW50ZXJuYWxseSBoZWxwZnVsIG1ldGhvZHMuXG4gKi9cbmNsYXNzIFV0aWxzIHtcblxuICAgIC8qKlxuICAgICAqIG1lcmdlIHRoZSBwcm9wZXJ0aWVzIG9mIHNyYyBpbnRvIGRlc3QgaWdub3JpbmdcbiAgICAgKiBhbnkgdGhhdCBhcHBlYXIgaW4gZXhjbHVkZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3JjXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRlc3RcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xBcnJheX0gW2V4Y2x1ZGVdXG4gICAgICovXG4gICAgbWVyZ2Uoc3JjLCBkZXN0LCBleGNsdWRlKSB7XG5cbiAgICAgICAgZXhjbHVkZSA9IEFycmF5LmlzQXJyYXkoZXhjbHVkZSkgPyBleGNsdWRlIDogW2V4Y2x1ZGVdO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHNyYykuZm9yRWFjaCgoa2V5KSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChleGNsdWRlLmluZGV4T2Yoa2V5KSA+IC0xKSByZXR1cm47XG5cbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXN0LCBrZXksIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHNyY1trZXldXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBoaWRkZW4gaGlkZXMgYSBwcm9wZXJ0eSBmcm9tIGVudW1lcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICAgKi9cbiAgICBoaWRkZW4obywga2V5LCB2YWx1ZSkge1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrZXksIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICB9KTtcblxuXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgVXRpbHMoKTtcbiJdfQ==