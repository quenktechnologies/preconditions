"use strict";

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
 * Criterion is the abstract class that must be sub classed to 
 * create a check, filter or other operation during the execution of Criteria.
 * @abstract
 */
var Criterion = function () {
  function Criterion() {
    _classCallCheck(this, Criterion);
  }

  _createClass(Criterion, [{
    key: "statisfy",


    /**
     * statisfy this Criterion.
     * @param {string} key The property name currently being actioned.
     * @param {*} value The value of the property
     * @param {done} done A callback that will be called when the Criterion has finished its work.
     */
    value: function statisfy(key, value, done) {}
  }]);

  return Criterion;
}();

exports.default = Criterion;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Dcml0ZXJpb24uanMiXSwibmFtZXMiOlsiQ3JpdGVyaW9uIiwia2V5IiwidmFsdWUiLCJkb25lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7OztBQVNBOzs7OztJQUtNQSxTOzs7Ozs7Ozs7QUFFRjs7Ozs7OzZCQU1TQyxHLEVBQUtDLEssRUFBT0MsSSxFQUFNLENBRzFCOzs7Ozs7a0JBSVVILFMiLCJmaWxlIjoiQ3JpdGVyaW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKlxuICogQGNhbGxiYWNrIGRvbmUgQ2FsbGVkIGJ5IENyaXRlcmlvbiBpbXBsZW1lbnRvcnMgdG8gaW5kaWNhdGUgaWYgdGhlIG5ldyB2YWx1ZXMgZm9yIGtleSBhbmQgdmFsdWVcbiAqIG9mIHRoZSBwcm9wZXJ0eSBhcyB3ZWxsIGFzIGFueSBlcnJvciBpZiBvbmUgb2NjdXJzLlxuICogQHBhcmFtIHtudWxsfEVycm9yfSBlcnIgXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFxuICogQHBhcmFtIHsqfSB2YWx1ZSBcbiAqL1xuXG4vKipcbiAqIENyaXRlcmlvbiBpcyB0aGUgYWJzdHJhY3QgY2xhc3MgdGhhdCBtdXN0IGJlIHN1YiBjbGFzc2VkIHRvIFxuICogY3JlYXRlIGEgY2hlY2ssIGZpbHRlciBvciBvdGhlciBvcGVyYXRpb24gZHVyaW5nIHRoZSBleGVjdXRpb24gb2YgQ3JpdGVyaWEuXG4gKiBAYWJzdHJhY3RcbiAqL1xuY2xhc3MgQ3JpdGVyaW9uIHtcblxuICAgIC8qKlxuICAgICAqIHN0YXRpc2Z5IHRoaXMgQ3JpdGVyaW9uLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIHByb3BlcnR5IG5hbWUgY3VycmVudGx5IGJlaW5nIGFjdGlvbmVkLlxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7ZG9uZX0gZG9uZSBBIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgQ3JpdGVyaW9uIGhhcyBmaW5pc2hlZCBpdHMgd29yay5cbiAgICAgKi9cbiAgICBzdGF0aXNmeShrZXksIHZhbHVlLCBkb25lKSB7XG5cblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBDcml0ZXJpb25cbiJdfQ==