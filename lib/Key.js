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
 * Key represents a single key on an object being filtered. 
 * @abstract
 * @implements {Criterion}
 */
var Key = function () {
    function Key(msg) {
        _classCallCheck(this, Key);

        this.message = msg || 'The value for {key} is invalid!';
    }

    /**
     * template interpolates the values in a template string so
     * it can be used to display meaningfull messages.
     * @param {object} context 
     */


    _createClass(Key, [{
        key: 'template',
        value: function template(context) {

            return this.message.replace(/\{([\w\$\.\-]*)}/g, function (s, k) {
                return context[k];
            });
        }
    }, {
        key: 'statisfy',
        value: function statisfy(key, value, done) {

            throw new ReferenceError('satisfy() must be overrided!');
        }
    }]);

    return Key;
}();

exports.default = Key;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9LZXkuanMiXSwibmFtZXMiOlsiS2V5IiwibXNnIiwibWVzc2FnZSIsImNvbnRleHQiLCJyZXBsYWNlIiwicyIsImsiLCJrZXkiLCJ2YWx1ZSIsImRvbmUiLCJSZWZlcmVuY2VFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7QUFTQTs7Ozs7SUFLTUEsRztBQUVGLGlCQUFZQyxHQUFaLEVBQWlCO0FBQUE7O0FBRWIsYUFBS0MsT0FBTCxHQUFlRCxPQUFPLGlDQUF0QjtBQUVIOztBQUVEOzs7Ozs7Ozs7aUNBS1NFLE8sRUFBUzs7QUFFZCxtQkFBTyxLQUFLRCxPQUFMLENBQWFFLE9BQWIsQ0FBcUIsbUJBQXJCLEVBQTBDLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLHVCQUFVSCxRQUFRRyxDQUFSLENBQVY7QUFBQSxhQUExQyxDQUFQO0FBRUg7OztpQ0FFUUMsRyxFQUFLQyxLLEVBQU9DLEksRUFBTTs7QUFFdkIsa0JBQU0sSUFBSUMsY0FBSixDQUFtQiw4QkFBbkIsQ0FBTjtBQUVIOzs7Ozs7a0JBSVVWLEciLCJmaWxlIjoiS2V5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKlxuICogQGNhbGxiYWNrIGRvbmUgQ2FsbGVkIGJ5IENyaXRlcmlvbiBpbXBsZW1lbnRvcnMgdG8gaW5kaWNhdGUgaWYgdGhlIG5ldyB2YWx1ZXMgZm9yIGtleSBhbmQgdmFsdWVcbiAqIG9mIHRoZSBwcm9wZXJ0eSBhcyB3ZWxsIGFzIGFueSBlcnJvciBpZiBvbmUgb2NjdXJzLlxuICogQHBhcmFtIHtudWxsfEVycm9yfSBlcnIgXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFxuICogQHBhcmFtIHsqfSB2YWx1ZSBcbiAqL1xuXG4vKipcbiAqIEtleSByZXByZXNlbnRzIGEgc2luZ2xlIGtleSBvbiBhbiBvYmplY3QgYmVpbmcgZmlsdGVyZWQuIFxuICogQGFic3RyYWN0XG4gKiBAaW1wbGVtZW50cyB7Q3JpdGVyaW9ufVxuICovXG5jbGFzcyBLZXkge1xuXG4gICAgY29uc3RydWN0b3IobXNnKSB7XG5cbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbXNnIHx8ICdUaGUgdmFsdWUgZm9yIHtrZXl9IGlzIGludmFsaWQhJztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRlbXBsYXRlIGludGVycG9sYXRlcyB0aGUgdmFsdWVzIGluIGEgdGVtcGxhdGUgc3RyaW5nIHNvXG4gICAgICogaXQgY2FuIGJlIHVzZWQgdG8gZGlzcGxheSBtZWFuaW5nZnVsbCBtZXNzYWdlcy5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gY29udGV4dCBcbiAgICAgKi9cbiAgICB0ZW1wbGF0ZShjb250ZXh0KSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZS5yZXBsYWNlKC9cXHsoW1xcd1xcJFxcLlxcLV0qKX0vZywgKHMsIGspID0+IGNvbnRleHRba10pO1xuXG4gICAgfVxuXG4gICAgc3RhdGlzZnkoa2V5LCB2YWx1ZSwgZG9uZSkge1xuXG4gICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignc2F0aXNmeSgpIG11c3QgYmUgb3ZlcnJpZGVkIScpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEtleVxuIl19