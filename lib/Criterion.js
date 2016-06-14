/**
 *
 * @callback done Called by Criterion implementors to indicate if the new values for key and value
 * of the property as well as any error if one occurs.
 * @param {null|Error} err 
 * @param {string} key 
 * @param {*} value 
 */

/**
 * Criterion is the abstract class that must be sub classed to 
 * create a check, filter or other operation during the execution of Criteria.
 * @abstract
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Criterion = (function () {
  function Criterion(msg) {
    _classCallCheck(this, Criterion);

    this.message = msg || 'The value for {key} is invalid!';
  }

  /**
   * template interpolates the values in a template string so
   * it can be used to display meaningfull messages.
   * @param {object} context 
   */

  _createClass(Criterion, [{
    key: 'template',
    value: function template(context) {

      return this.message.replace(/\{([\w\$\.\-]*)}/g, function (s, k) {
        return context[k];
      });
    }

    /**
     * apply the Criterion.
     * @param {string} key The property name currently being actioned.
     * @param {*} value The value of the property
     * @param {done} done A callback that will be called when the Criterion has finished its work.
     */
  }, {
    key: 'apply',
    value: function apply(key, value, done) {

      throw new ReferenceError('apply() must be overrided!');
    }
  }]);

  return Criterion;
})();

exports['default'] = Criterion;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Dcml0ZXJpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBY00sU0FBUztBQUVBLFdBRlQsU0FBUyxDQUVDLEdBQUcsRUFBRTswQkFGZixTQUFTOztBQUlQLFFBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxJQUFJLGlDQUFpQyxDQUFDO0dBRTNEOzs7Ozs7OztlQU5DLFNBQVM7O1dBYUgsa0JBQUMsT0FBTyxFQUFFOztBQUVkLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQztlQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUM7S0FFMUU7Ozs7Ozs7Ozs7V0FRSSxlQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFOztBQUVwQixZQUFNLElBQUksY0FBYyxDQUFDLDRCQUE0QixDQUFDLENBQUM7S0FFMUQ7OztTQTdCQyxTQUFTOzs7cUJBaUNBLFNBQVMiLCJmaWxlIjoiQ3JpdGVyaW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKlxuICogQGNhbGxiYWNrIGRvbmUgQ2FsbGVkIGJ5IENyaXRlcmlvbiBpbXBsZW1lbnRvcnMgdG8gaW5kaWNhdGUgaWYgdGhlIG5ldyB2YWx1ZXMgZm9yIGtleSBhbmQgdmFsdWVcbiAqIG9mIHRoZSBwcm9wZXJ0eSBhcyB3ZWxsIGFzIGFueSBlcnJvciBpZiBvbmUgb2NjdXJzLlxuICogQHBhcmFtIHtudWxsfEVycm9yfSBlcnIgXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFxuICogQHBhcmFtIHsqfSB2YWx1ZSBcbiAqL1xuXG4vKipcbiAqIENyaXRlcmlvbiBpcyB0aGUgYWJzdHJhY3QgY2xhc3MgdGhhdCBtdXN0IGJlIHN1YiBjbGFzc2VkIHRvIFxuICogY3JlYXRlIGEgY2hlY2ssIGZpbHRlciBvciBvdGhlciBvcGVyYXRpb24gZHVyaW5nIHRoZSBleGVjdXRpb24gb2YgQ3JpdGVyaWEuXG4gKiBAYWJzdHJhY3RcbiAqL1xuY2xhc3MgQ3JpdGVyaW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKG1zZykge1xuXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1zZyB8fCAnVGhlIHZhbHVlIGZvciB7a2V5fSBpcyBpbnZhbGlkISc7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0ZW1wbGF0ZSBpbnRlcnBvbGF0ZXMgdGhlIHZhbHVlcyBpbiBhIHRlbXBsYXRlIHN0cmluZyBzb1xuICAgICAqIGl0IGNhbiBiZSB1c2VkIHRvIGRpc3BsYXkgbWVhbmluZ2Z1bGwgbWVzc2FnZXMuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHQgXG4gICAgICovXG4gICAgdGVtcGxhdGUoY29udGV4dCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2UucmVwbGFjZSgvXFx7KFtcXHdcXCRcXC5cXC1dKil9L2csIChzLCBrKSA9PiBjb250ZXh0W2tdKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFwcGx5IHRoZSBDcml0ZXJpb24uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcHJvcGVydHkgbmFtZSBjdXJyZW50bHkgYmVpbmcgYWN0aW9uZWQuXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIHByb3BlcnR5XG4gICAgICogQHBhcmFtIHtkb25lfSBkb25lIEEgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBDcml0ZXJpb24gaGFzIGZpbmlzaGVkIGl0cyB3b3JrLlxuICAgICAqL1xuICAgIGFwcGx5KGtleSwgdmFsdWUsIGRvbmUpIHtcblxuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ2FwcGx5KCkgbXVzdCBiZSBvdmVycmlkZWQhJyk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3JpdGVyaW9uXG4iXX0=