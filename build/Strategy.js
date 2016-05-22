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