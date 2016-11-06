"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Precondition represents some condition that must be satisfied
 * to continue. Implement it to validate or transform input.
 * @interface
 */
var Precondition = function () {
  function Precondition() {
    _classCallCheck(this, Precondition);
  }

  _createClass(Precondition, [{
    key: "apply",


    /**
     * apply this Precondition
     * Returning an instance of Error indicates the Precondition failed.
     * @param {*} value
     * @returns {*|Error}
     */
    value: function apply() {}
  }]);

  return Precondition;
}();

exports.default = Precondition;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVjb25kaXRpb25zL1ByZWNvbmRpdGlvbi5qcyJdLCJuYW1lcyI6WyJQcmVjb25kaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7SUFLTUEsWTs7Ozs7Ozs7O0FBRUY7Ozs7Ozs0QkFNUSxDQUVQOzs7Ozs7a0JBSVVBLFkiLCJmaWxlIjoiUHJlY29uZGl0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQcmVjb25kaXRpb24gcmVwcmVzZW50cyBzb21lIGNvbmRpdGlvbiB0aGF0IG11c3QgYmUgc2F0aXNmaWVkXG4gKiB0byBjb250aW51ZS4gSW1wbGVtZW50IGl0IHRvIHZhbGlkYXRlIG9yIHRyYW5zZm9ybSBpbnB1dC5cbiAqIEBpbnRlcmZhY2VcbiAqL1xuY2xhc3MgUHJlY29uZGl0aW9uIHtcblxuICAgIC8qKlxuICAgICAqIGFwcGx5IHRoaXMgUHJlY29uZGl0aW9uXG4gICAgICogUmV0dXJuaW5nIGFuIGluc3RhbmNlIG9mIEVycm9yIGluZGljYXRlcyB0aGUgUHJlY29uZGl0aW9uIGZhaWxlZC5cbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAgICogQHJldHVybnMgeyp8RXJyb3J9XG4gICAgICovXG4gICAgYXBwbHkoKSB7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJlY29uZGl0aW9uXG4iXX0=