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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Criterion = (function () {
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
})();

exports["default"] = Criterion;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Dcml0ZXJpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBY00sU0FBUztXQUFULFNBQVM7MEJBQVQsU0FBUzs7O2VBQVQsU0FBUzs7Ozs7Ozs7O1dBUUgsa0JBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFHMUI7OztTQVhDLFNBQVM7OztxQkFlQSxTQUFTIiwiZmlsZSI6IkNyaXRlcmlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICpcbiAqIEBjYWxsYmFjayBkb25lIENhbGxlZCBieSBDcml0ZXJpb24gaW1wbGVtZW50b3JzIHRvIGluZGljYXRlIGlmIHRoZSBuZXcgdmFsdWVzIGZvciBrZXkgYW5kIHZhbHVlXG4gKiBvZiB0aGUgcHJvcGVydHkgYXMgd2VsbCBhcyBhbnkgZXJyb3IgaWYgb25lIG9jY3Vycy5cbiAqIEBwYXJhbSB7bnVsbHxFcnJvcn0gZXJyIFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgXG4gKi9cblxuLyoqXG4gKiBDcml0ZXJpb24gaXMgdGhlIGFic3RyYWN0IGNsYXNzIHRoYXQgbXVzdCBiZSBzdWIgY2xhc3NlZCB0byBcbiAqIGNyZWF0ZSBhIGNoZWNrLCBmaWx0ZXIgb3Igb3RoZXIgb3BlcmF0aW9uIGR1cmluZyB0aGUgZXhlY3V0aW9uIG9mIENyaXRlcmlhLlxuICogQGFic3RyYWN0XG4gKi9cbmNsYXNzIENyaXRlcmlvbiB7XG5cbiAgICAvKipcbiAgICAgKiBzdGF0aXNmeSB0aGlzIENyaXRlcmlvbi5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBwcm9wZXJ0eSBuYW1lIGN1cnJlbnRseSBiZWluZyBhY3Rpb25lZC5cbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHlcbiAgICAgKiBAcGFyYW0ge2RvbmV9IGRvbmUgQSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIENyaXRlcmlvbiBoYXMgZmluaXNoZWQgaXRzIHdvcmsuXG4gICAgICovXG4gICAgc3RhdGlzZnkoa2V5LCB2YWx1ZSwgZG9uZSkge1xuXG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3JpdGVyaW9uXG4iXX0=