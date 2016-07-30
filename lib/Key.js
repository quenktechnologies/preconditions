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
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Key = (function () {
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
})();

exports['default'] = Key;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9LZXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBY00sR0FBRztBQUVNLGFBRlQsR0FBRyxDQUVPLEdBQUcsRUFBRTs4QkFGZixHQUFHOztBQUlELFlBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxJQUFJLGlDQUFpQyxDQUFDO0tBRTNEOzs7Ozs7OztpQkFOQyxHQUFHOztlQWFHLGtCQUFDLE9BQU8sRUFBRTs7QUFFZCxtQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDO3VCQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFBQSxDQUFDLENBQUM7U0FFMUU7OztlQUVPLGtCQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFOztBQUV2QixrQkFBTSxJQUFJLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1NBRTVEOzs7V0F2QkMsR0FBRzs7O3FCQTJCTSxHQUFHIiwiZmlsZSI6IktleS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICpcbiAqIEBjYWxsYmFjayBkb25lIENhbGxlZCBieSBDcml0ZXJpb24gaW1wbGVtZW50b3JzIHRvIGluZGljYXRlIGlmIHRoZSBuZXcgdmFsdWVzIGZvciBrZXkgYW5kIHZhbHVlXG4gKiBvZiB0aGUgcHJvcGVydHkgYXMgd2VsbCBhcyBhbnkgZXJyb3IgaWYgb25lIG9jY3Vycy5cbiAqIEBwYXJhbSB7bnVsbHxFcnJvcn0gZXJyIFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgXG4gKi9cblxuLyoqXG4gKiBLZXkgcmVwcmVzZW50cyBhIHNpbmdsZSBrZXkgb24gYW4gb2JqZWN0IGJlaW5nIGZpbHRlcmVkLiBcbiAqIEBhYnN0cmFjdFxuICogQGltcGxlbWVudHMge0NyaXRlcmlvbn1cbiAqL1xuY2xhc3MgS2V5IHtcblxuICAgIGNvbnN0cnVjdG9yKG1zZykge1xuXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1zZyB8fCAnVGhlIHZhbHVlIGZvciB7a2V5fSBpcyBpbnZhbGlkISc7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0ZW1wbGF0ZSBpbnRlcnBvbGF0ZXMgdGhlIHZhbHVlcyBpbiBhIHRlbXBsYXRlIHN0cmluZyBzb1xuICAgICAqIGl0IGNhbiBiZSB1c2VkIHRvIGRpc3BsYXkgbWVhbmluZ2Z1bGwgbWVzc2FnZXMuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHQgXG4gICAgICovXG4gICAgdGVtcGxhdGUoY29udGV4dCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2UucmVwbGFjZSgvXFx7KFtcXHdcXCRcXC5cXC1dKil9L2csIChzLCBrKSA9PiBjb250ZXh0W2tdKTtcblxuICAgIH1cblxuICAgIHN0YXRpc2Z5KGtleSwgdmFsdWUsIGRvbmUpIHtcblxuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ3NhdGlzZnkoKSBtdXN0IGJlIG92ZXJyaWRlZCEnKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBLZXlcbiJdfQ==