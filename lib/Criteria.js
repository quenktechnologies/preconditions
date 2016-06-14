'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _DefaultStrategy = require('./DefaultStrategy');

var _DefaultStrategy2 = _interopRequireDefault(_DefaultStrategy);

var _Criterion = require('./Criterion');

var _Criterion2 = _interopRequireDefault(_Criterion);

/**
 * Criteria is the main entry point for using this library.
 * It represents a set of Criterion that will be applied
 * to each property in an object passed to apply that it knows about.
 *
 * @abstract
 * @implements {CriteriaRule}
 */

var Criteria = (function () {
    function Criteria() {
        _classCallCheck(this, Criteria);
    }

    _createClass(Criteria, [{
        key: 'getCriteria',

        /**
         * getCriteria returns a map of Criteron this objects.
         * @returns {object}
         */
        value: function getCriteria() {
            var _this = this;

            var o = {};

            Object.keys(this).forEach(function (key) {

                if (_this.hasOwnProperty(key)) if (key[0] !== '_') o[key] = _this[key];
            });

            return o;
        }

        /**
         * onComplete is called if there are no errors after applying all the rules.
         * @param {object} result 
         * @param {function} done 
         */
    }, {
        key: 'onComplete',
        value: function onComplete(result, done) {

            done(null, result);
        }

        /**
         * onError is called if an error occured after applying all the rules.
         */
    }, {
        key: 'onError',
        value: function onError(err, obj, done) {

            done(err, obj);
        }
    }, {
        key: 'apply',
        value: function apply(key, value, done) {
            var _this2 = this;

            new _DefaultStrategy2['default']().execute(this, value, function (err, o) {
                return err !== null ? done(err, key, value) : _this2.onComplete(o, function (err, o) {
                    return done(err, key, o);
                });
            });
        }

        /**
         * execute the rules to the passed object.
         * If a callback is provided, it is called with the results,
         * the return value of the internal strategy in use is also returned which
         * is expected to be null or a Promise.
         * @param {object} obj The object to apply through the pipe.
         * @param {function} cb A callback that is called with the results.
         * @returns {null|Promise} 
         */
    }, {
        key: 'execute',
        value: function execute(obj, done) {
            var _this3 = this;

            new _DefaultStrategy2['default']().execute(this, obj, function (err, o) {
                return err !== null ? _this3.onError(err, obj, done) : _this3.onComplete(o, done);
            });
        }
    }]);

    return Criteria;
})();

exports['default'] = Criteria;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Dcml0ZXJpYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7K0JBQTRCLG1CQUFtQjs7Ozt5QkFDekIsYUFBYTs7Ozs7Ozs7Ozs7OztJQVU3QixRQUFRO2FBQVIsUUFBUTs4QkFBUixRQUFROzs7aUJBQVIsUUFBUTs7Ozs7OztlQU1DLHVCQUFHOzs7QUFFVixnQkFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVYLGtCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUcsRUFBSTs7QUFFN0Isb0JBQUksTUFBSyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQ3hCLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFDZCxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBSyxHQUFHLENBQUMsQ0FBQzthQUU5QixDQUFDLENBQUM7O0FBRUgsbUJBQU8sQ0FBQyxDQUFDO1NBRVo7Ozs7Ozs7OztlQU9TLG9CQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7O0FBRXJCLGdCQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBRXRCOzs7Ozs7O2VBS00saUJBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7O0FBRXRCLGdCQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBRWhCOzs7ZUFFSSxlQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFOzs7QUFFcEIsQUFBQyw4Q0FBcUIsQ0FBRSxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssRUFDdkMsVUFBQyxHQUFHLEVBQUUsQ0FBQzt1QkFBSyxBQUFDLEdBQUcsS0FBSyxJQUFJLEdBQ3pCLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUNyQixPQUFLLFVBQVUsQ0FBQyxDQUFDLEVBQUUsVUFBQyxHQUFHLEVBQUUsQ0FBQzsyQkFBSyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7aUJBQUEsQ0FBQzthQUFBLENBQUMsQ0FBQztTQUUxRDs7Ozs7Ozs7Ozs7OztlQVdNLGlCQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUU7OztBQUVmLEFBQUMsOENBQXFCLENBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQ3JDLFVBQUMsR0FBRyxFQUFFLENBQUM7dUJBQUssQUFBQyxHQUFHLEtBQUssSUFBSSxHQUFJLE9BQUssT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsT0FBSyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQzthQUFBLENBQUMsQ0FBQztTQUU3Rjs7O1dBakVDLFFBQVE7OztxQkFxRUMsUUFBUSIsImZpbGUiOiJDcml0ZXJpYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEZWZhdWx0U3RyYXRlZ3kgZnJvbSAnLi9EZWZhdWx0U3RyYXRlZ3knO1xuaW1wb3J0IENyaXRlcmlvbiBmcm9tICcuL0NyaXRlcmlvbic7XG5cbi8qKlxuICogQ3JpdGVyaWEgaXMgdGhlIG1haW4gZW50cnkgcG9pbnQgZm9yIHVzaW5nIHRoaXMgbGlicmFyeS5cbiAqIEl0IHJlcHJlc2VudHMgYSBzZXQgb2YgQ3JpdGVyaW9uIHRoYXQgd2lsbCBiZSBhcHBsaWVkXG4gKiB0byBlYWNoIHByb3BlcnR5IGluIGFuIG9iamVjdCBwYXNzZWQgdG8gYXBwbHkgdGhhdCBpdCBrbm93cyBhYm91dC5cbiAqXG4gKiBAYWJzdHJhY3RcbiAqIEBpbXBsZW1lbnRzIHtDcml0ZXJpYVJ1bGV9XG4gKi9cbmNsYXNzIENyaXRlcmlhIHtcblxuICAgIC8qKlxuICAgICAqIGdldENyaXRlcmlhIHJldHVybnMgYSBtYXAgb2YgQ3JpdGVyb24gdGhpcyBvYmplY3RzLlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9XG4gICAgICovXG4gICAgZ2V0Q3JpdGVyaWEoKSB7XG5cbiAgICAgICAgdmFyIG8gPSB7fTtcblxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzKS5mb3JFYWNoKGtleSA9PiB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkpXG4gICAgICAgICAgICAgICAgaWYgKGtleVswXSAhPT0gJ18nKVxuICAgICAgICAgICAgICAgICAgICBvW2tleV0gPSB0aGlzW2tleV07XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG87XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbkNvbXBsZXRlIGlzIGNhbGxlZCBpZiB0aGVyZSBhcmUgbm8gZXJyb3JzIGFmdGVyIGFwcGx5aW5nIGFsbCB0aGUgcnVsZXMuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlc3VsdCBcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkb25lIFxuICAgICAqL1xuICAgIG9uQ29tcGxldGUocmVzdWx0LCBkb25lKSB7XG5cbiAgICAgICAgZG9uZShudWxsLCByZXN1bHQpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb25FcnJvciBpcyBjYWxsZWQgaWYgYW4gZXJyb3Igb2NjdXJlZCBhZnRlciBhcHBseWluZyBhbGwgdGhlIHJ1bGVzLlxuICAgICAqL1xuICAgIG9uRXJyb3IoZXJyLCBvYmosIGRvbmUpIHtcblxuICAgICAgZG9uZShlcnIsIG9iaik7XG5cbiAgICB9XG5cbiAgICBhcHBseShrZXksIHZhbHVlLCBkb25lKSB7XG5cbiAgICAgICAgKG5ldyBEZWZhdWx0U3RyYXRlZ3koKSkuZXhlY3V0ZSh0aGlzLCB2YWx1ZSxcbiAgICAgICAgICAgIChlcnIsIG8pID0+IChlcnIgIT09IG51bGwpID9cbiAgICAgICAgICAgIGRvbmUoZXJyLCBrZXksIHZhbHVlKSA6XG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGUobywgKGVyciwgbykgPT4gZG9uZShlcnIsIGtleSwgbykpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGV4ZWN1dGUgdGhlIHJ1bGVzIHRvIHRoZSBwYXNzZWQgb2JqZWN0LlxuICAgICAqIElmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGl0IGlzIGNhbGxlZCB3aXRoIHRoZSByZXN1bHRzLFxuICAgICAqIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGludGVybmFsIHN0cmF0ZWd5IGluIHVzZSBpcyBhbHNvIHJldHVybmVkIHdoaWNoXG4gICAgICogaXMgZXhwZWN0ZWQgdG8gYmUgbnVsbCBvciBhIFByb21pc2UuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGFwcGx5IHRocm91Z2ggdGhlIHBpcGUuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2IgQSBjYWxsYmFjayB0aGF0IGlzIGNhbGxlZCB3aXRoIHRoZSByZXN1bHRzLlxuICAgICAqIEByZXR1cm5zIHtudWxsfFByb21pc2V9IFxuICAgICAqL1xuICAgIGV4ZWN1dGUob2JqLCBkb25lKSB7XG5cbiAgICAgICAgKG5ldyBEZWZhdWx0U3RyYXRlZ3koKSkuZXhlY3V0ZSh0aGlzLCBvYmosXG4gICAgICAgICAgICAoZXJyLCBvKSA9PiAoZXJyICE9PSBudWxsKSA/IHRoaXMub25FcnJvcihlcnIsIG9iaiwgZG9uZSkgOiB0aGlzLm9uQ29tcGxldGUobywgZG9uZSkpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENyaXRlcmlhXG4iXX0=