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
 * @param {Criteria} [next=null] If passed, will be called if this criteria
 * @abstract
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Criterion = (function () {
  function Criterion(next) {
    _classCallCheck(this, Criterion);

    this._next = next || null;
  }

  /**
   * next will apply the next Criterion if it exists.
   * @param {string} key 
   * @param {*} value 
   * @param {CriterionCallback} done 
   */

  _createClass(Criterion, [{
    key: "next",
    value: function next(key, value, done) {

      if (this._next !== null) return this._next.enforce(key, value, done);

      done(null, key, value);
    }

    /**
     * enforce the Criterion.
     * @param {string} key The property name currently being actioned.
     * @param {*} value The value of the property
     * @param {done} done A callback that will be called when the Criterion has finished its work.
     */
  }, {
    key: "enforce",
    value: function enforce(key, value, done) {}
  }]);

  return Criterion;
})();

exports["default"] = Criterion;
module.exports = exports["default"];