/**
 * Strategy represents an api that the main Pipe class uses
 * to do its work. Custom Strategies can be created to allow
 * for more finely grained control over how the various chains of
 * a Pipe is handled.
 * @interface
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Strategy = (function () {
  function Strategy() {
    _classCallCheck(this, Strategy);
  }

  _createClass(Strategy, [{
    key: "apply",

    /**
     * apply this strategy
     * @param {object} source The source object to filter.
     * @param {Criteria} criteria 
     * @param {callback|null} done A callback that is used by the default (StepStrategy) strategy to indicate 
     * completion.
     * @returns {*}
     */
    value: function apply(source, criteria, done) {}
  }]);

  return Strategy;
})();

exports["default"] = Strategy;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TdHJhdGVneS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztJQU9NLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7OztlQUFSLFFBQVE7Ozs7Ozs7Ozs7O1dBVUwsZUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUU3Qjs7O1NBWkMsUUFBUTs7O3FCQWdCQyxRQUFRIiwiZmlsZSI6IlN0cmF0ZWd5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdHJhdGVneSByZXByZXNlbnRzIGFuIGFwaSB0aGF0IHRoZSBtYWluIFBpcGUgY2xhc3MgdXNlc1xuICogdG8gZG8gaXRzIHdvcmsuIEN1c3RvbSBTdHJhdGVnaWVzIGNhbiBiZSBjcmVhdGVkIHRvIGFsbG93XG4gKiBmb3IgbW9yZSBmaW5lbHkgZ3JhaW5lZCBjb250cm9sIG92ZXIgaG93IHRoZSB2YXJpb3VzIGNoYWlucyBvZlxuICogYSBQaXBlIGlzIGhhbmRsZWQuXG4gKiBAaW50ZXJmYWNlXG4gKi9cbmNsYXNzIFN0cmF0ZWd5IHtcblxuICAgIC8qKlxuICAgICAqIGFwcGx5IHRoaXMgc3RyYXRlZ3lcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0IHRvIGZpbHRlci5cbiAgICAgKiBAcGFyYW0ge0NyaXRlcmlhfSBjcml0ZXJpYSBcbiAgICAgKiBAcGFyYW0ge2NhbGxiYWNrfG51bGx9IGRvbmUgQSBjYWxsYmFjayB0aGF0IGlzIHVzZWQgYnkgdGhlIGRlZmF1bHQgKFN0ZXBTdHJhdGVneSkgc3RyYXRlZ3kgdG8gaW5kaWNhdGUgXG4gICAgICogY29tcGxldGlvbi5cbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBhcHBseShzb3VyY2UsIGNyaXRlcmlhLCBkb25lKSB7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3RyYXRlZ3lcbiJdfQ==