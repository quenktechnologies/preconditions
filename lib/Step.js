'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * @callback done Called by Criterion implementors to indicate if the new values for key and value
 * of the property as well as any error if one occurs.
 * @param {null|Error} err 
 * @param {string} key 
 * @param {*} value 
 */

/**
 * Step represents a single key on an object being filtered. 
 * @abstract
 * @implements {Criterion}
 */
var Step = function () {
    function Step(msg) {
        _classCallCheck(this, Step);

        this.message = msg || 'The value for {key} is invalid!';
    }

    /**
     * template interpolates the values in a template string so
     * it can be used to display meaningfull messages.
     * @param {object} context 
     */


    _createClass(Step, [{
        key: 'template',
        value: function template(context) {

            return this.message.replace(/\{([\w\$\.\-]*)}/g, function (s, k) {
                return context[k];
            });
        }
    }, {
        key: 'call',
        value: function call(context, key, value, done) {

            throw new ReferenceError('call() must be overrided!');
        }
    }]);

    return Step;
}();

exports.default = Step;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TdGVwLmpzIl0sIm5hbWVzIjpbIlN0ZXAiLCJtc2ciLCJtZXNzYWdlIiwiY29udGV4dCIsInJlcGxhY2UiLCJzIiwiayIsImtleSIsInZhbHVlIiwiZG9uZSIsIlJlZmVyZW5jZUVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7OztBQVNBOzs7OztJQUtNQSxJO0FBRUYsa0JBQVlDLEdBQVosRUFBaUI7QUFBQTs7QUFFYixhQUFLQyxPQUFMLEdBQWVELE9BQU8saUNBQXRCO0FBRUg7O0FBRUQ7Ozs7Ozs7OztpQ0FLU0UsTyxFQUFTOztBQUVkLG1CQUFPLEtBQUtELE9BQUwsQ0FBYUUsT0FBYixDQUFxQixtQkFBckIsRUFBMEMsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsdUJBQVVILFFBQVFHLENBQVIsQ0FBVjtBQUFBLGFBQTFDLENBQVA7QUFFSDs7OzZCQUVJSCxPLEVBQVNJLEcsRUFBS0MsSyxFQUFPQyxJLEVBQU07O0FBRTVCLGtCQUFNLElBQUlDLGNBQUosQ0FBbUIsMkJBQW5CLENBQU47QUFFSDs7Ozs7O2tCQUlVVixJIiwiZmlsZSI6IlN0ZXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqXG4gKiBAY2FsbGJhY2sgZG9uZSBDYWxsZWQgYnkgQ3JpdGVyaW9uIGltcGxlbWVudG9ycyB0byBpbmRpY2F0ZSBpZiB0aGUgbmV3IHZhbHVlcyBmb3Iga2V5IGFuZCB2YWx1ZVxuICogb2YgdGhlIHByb3BlcnR5IGFzIHdlbGwgYXMgYW55IGVycm9yIGlmIG9uZSBvY2N1cnMuXG4gKiBAcGFyYW0ge251bGx8RXJyb3J9IGVyciBcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgXG4gKiBAcGFyYW0geyp9IHZhbHVlIFxuICovXG5cbi8qKlxuICogU3RlcCByZXByZXNlbnRzIGEgc2luZ2xlIGtleSBvbiBhbiBvYmplY3QgYmVpbmcgZmlsdGVyZWQuIFxuICogQGFic3RyYWN0XG4gKiBAaW1wbGVtZW50cyB7Q3JpdGVyaW9ufVxuICovXG5jbGFzcyBTdGVwIHtcblxuICAgIGNvbnN0cnVjdG9yKG1zZykge1xuXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1zZyB8fCAnVGhlIHZhbHVlIGZvciB7a2V5fSBpcyBpbnZhbGlkISc7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0ZW1wbGF0ZSBpbnRlcnBvbGF0ZXMgdGhlIHZhbHVlcyBpbiBhIHRlbXBsYXRlIHN0cmluZyBzb1xuICAgICAqIGl0IGNhbiBiZSB1c2VkIHRvIGRpc3BsYXkgbWVhbmluZ2Z1bGwgbWVzc2FnZXMuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHQgXG4gICAgICovXG4gICAgdGVtcGxhdGUoY29udGV4dCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2UucmVwbGFjZSgvXFx7KFtcXHdcXCRcXC5cXC1dKil9L2csIChzLCBrKSA9PiBjb250ZXh0W2tdKTtcblxuICAgIH1cblxuICAgIGNhbGwoY29udGV4dCwga2V5LCB2YWx1ZSwgZG9uZSkge1xuXG4gICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignY2FsbCgpIG11c3QgYmUgb3ZlcnJpZGVkIScpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFN0ZXBcbiJdfQ==