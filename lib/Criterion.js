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