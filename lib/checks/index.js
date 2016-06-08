'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Cast = require('./Cast');

var _Cast2 = _interopRequireDefault(_Cast);

var _Match = require('./Match');

var _Match2 = _interopRequireDefault(_Match);

var _Range = require('./Range');

var _Range2 = _interopRequireDefault(_Range);

var _Required = require('./Required');

var _Required2 = _interopRequireDefault(_Required);

var _TypeOf = require('./TypeOf');

var _TypeOf2 = _interopRequireDefault(_TypeOf);

var _Timestamp = require('./Timestamp');

var _Timestamp2 = _interopRequireDefault(_Timestamp);

/**
 * Rules provides convenience methods for
 * creating some of the builting Criterion.
 */

var Rules = (function () {
  function Rules() {
    _classCallCheck(this, Rules);
  }

  _createClass(Rules, [{
    key: 'cast',

    /**
     * cast supplies a Cast rule.
     * @param {string} type 
     */
    value: function cast(type) {

      return new _Cast2['default'](type);
    }

    /**
     * match supplies a Match rule.
     * @param {RegExp} reg 
     * @param {string} emsg 
     */
  }, {
    key: 'match',
    value: function match(reg, emsg) {

      return new _Match2['default'](reg, emsg);
    }

    /**
     * range supplies a Range rule
     * @param {number} floor
     * @param {number} ceil 
     * @param {string} emsgFloor 
     * @param {string} emsgCeil 
     */
  }, {
    key: 'range',
    value: function range(floor, ceil, emsgFloor, emsgCeil) {

      return new _Range2['default'](floor, ceil, emsgFloor, emsgCeil);
    }
  }]);

  return Rules;
})();

exports['default'] = new Rules();
module.exports = exports['default'];