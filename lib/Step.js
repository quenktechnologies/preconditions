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
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Step = (function () {
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
})();

exports['default'] = Step;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TdGVwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWNNLElBQUk7QUFFSyxhQUZULElBQUksQ0FFTSxHQUFHLEVBQUU7OEJBRmYsSUFBSTs7QUFJRixZQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsSUFBSSxpQ0FBaUMsQ0FBQztLQUUzRDs7Ozs7Ozs7aUJBTkMsSUFBSTs7ZUFhRSxrQkFBQyxPQUFPLEVBQUU7O0FBRWQsbUJBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQzt1QkFBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQUEsQ0FBQyxDQUFDO1NBRTFFOzs7ZUFFRyxjQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTs7QUFFNUIsa0JBQU0sSUFBSSxjQUFjLENBQUMsMkJBQTJCLENBQUMsQ0FBQztTQUV6RDs7O1dBdkJDLElBQUk7OztxQkEyQkssSUFBSSIsImZpbGUiOiJTdGVwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKlxuICogQGNhbGxiYWNrIGRvbmUgQ2FsbGVkIGJ5IENyaXRlcmlvbiBpbXBsZW1lbnRvcnMgdG8gaW5kaWNhdGUgaWYgdGhlIG5ldyB2YWx1ZXMgZm9yIGtleSBhbmQgdmFsdWVcbiAqIG9mIHRoZSBwcm9wZXJ0eSBhcyB3ZWxsIGFzIGFueSBlcnJvciBpZiBvbmUgb2NjdXJzLlxuICogQHBhcmFtIHtudWxsfEVycm9yfSBlcnIgXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFxuICogQHBhcmFtIHsqfSB2YWx1ZSBcbiAqL1xuXG4vKipcbiAqIFN0ZXAgcmVwcmVzZW50cyBhIHNpbmdsZSBrZXkgb24gYW4gb2JqZWN0IGJlaW5nIGZpbHRlcmVkLiBcbiAqIEBhYnN0cmFjdFxuICogQGltcGxlbWVudHMge0NyaXRlcmlvbn1cbiAqL1xuY2xhc3MgU3RlcCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihtc2cpIHtcblxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtc2cgfHwgJ1RoZSB2YWx1ZSBmb3Ige2tleX0gaXMgaW52YWxpZCEnO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGVtcGxhdGUgaW50ZXJwb2xhdGVzIHRoZSB2YWx1ZXMgaW4gYSB0ZW1wbGF0ZSBzdHJpbmcgc29cbiAgICAgKiBpdCBjYW4gYmUgdXNlZCB0byBkaXNwbGF5IG1lYW5pbmdmdWxsIG1lc3NhZ2VzLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjb250ZXh0IFxuICAgICAqL1xuICAgIHRlbXBsYXRlKGNvbnRleHQpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5tZXNzYWdlLnJlcGxhY2UoL1xceyhbXFx3XFwkXFwuXFwtXSopfS9nLCAocywgaykgPT4gY29udGV4dFtrXSk7XG5cbiAgICB9XG5cbiAgICBjYWxsKGNvbnRleHQsIGtleSwgdmFsdWUsIGRvbmUpIHtcblxuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ2NhbGwoKSBtdXN0IGJlIG92ZXJyaWRlZCEnKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTdGVwXG4iXX0=