'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _DefaultStrategy = require('./DefaultStrategy');

var _DefaultStrategy2 = _interopRequireDefault(_DefaultStrategy);

/**
 * Criteria is the main entry point for using this library.
 * Each key decleared in a Criteria sub class represents
 * a check or set of checks that will be performed on corresponding
 * keys of each object passed to the execute() method.
 *
 * Any key prefixed with '_' (underscore) is treated as private and is
 * not considered a check.
 *
 * @abstract
 * @implements {Criterion}
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
        key: 'satisfy',
        value: function satisfy(key, value, done) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Dcml0ZXJpYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7K0JBQTRCLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFjekMsUUFBUTthQUFSLFFBQVE7OEJBQVIsUUFBUTs7O2lCQUFSLFFBQVE7Ozs7Ozs7ZUFNQyx1QkFBRzs7O0FBRVYsZ0JBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFWCxrQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLEVBQUk7O0FBRTdCLG9CQUFJLE1BQUssY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUN4QixJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQ2QsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQUssR0FBRyxDQUFDLENBQUM7YUFFOUIsQ0FBQyxDQUFDOztBQUVILG1CQUFPLENBQUMsQ0FBQztTQUVaOzs7Ozs7Ozs7ZUFPUyxvQkFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFOztBQUVyQixnQkFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztTQUV0Qjs7Ozs7OztlQUtNLGlCQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFOztBQUVwQixnQkFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUVsQjs7O2VBRU0saUJBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7OztBQUV0QixBQUFDLDhDQUFxQixDQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUN2QyxVQUFDLEdBQUcsRUFBRSxDQUFDO3VCQUFLLEFBQUMsR0FBRyxLQUFLLElBQUksR0FDekIsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQ3JCLE9BQUssVUFBVSxDQUFDLENBQUMsRUFBRSxVQUFDLEdBQUcsRUFBRSxDQUFDOzJCQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztpQkFBQSxDQUFDO2FBQUEsQ0FBQyxDQUFDO1NBRTFEOzs7Ozs7Ozs7Ozs7O2VBV00saUJBQUMsR0FBRyxFQUFFLElBQUksRUFBRTs7O0FBRWYsQUFBQyw4Q0FBcUIsQ0FBRSxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFDckMsVUFBQyxHQUFHLEVBQUUsQ0FBQzt1QkFBSyxBQUFDLEdBQUcsS0FBSyxJQUFJLEdBQUksT0FBSyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxPQUFLLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDO2FBQUEsQ0FBQyxDQUFDO1NBRTdGOzs7V0FqRUMsUUFBUTs7O3FCQXFFQyxRQUFRIiwiZmlsZSI6IkNyaXRlcmlhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERlZmF1bHRTdHJhdGVneSBmcm9tICcuL0RlZmF1bHRTdHJhdGVneSc7XG5cbi8qKlxuICogQ3JpdGVyaWEgaXMgdGhlIG1haW4gZW50cnkgcG9pbnQgZm9yIHVzaW5nIHRoaXMgbGlicmFyeS5cbiAqIEVhY2gga2V5IGRlY2xlYXJlZCBpbiBhIENyaXRlcmlhIHN1YiBjbGFzcyByZXByZXNlbnRzXG4gKiBhIGNoZWNrIG9yIHNldCBvZiBjaGVja3MgdGhhdCB3aWxsIGJlIHBlcmZvcm1lZCBvbiBjb3JyZXNwb25kaW5nXG4gKiBrZXlzIG9mIGVhY2ggb2JqZWN0IHBhc3NlZCB0byB0aGUgZXhlY3V0ZSgpIG1ldGhvZC5cbiAqXG4gKiBBbnkga2V5IHByZWZpeGVkIHdpdGggJ18nICh1bmRlcnNjb3JlKSBpcyB0cmVhdGVkIGFzIHByaXZhdGUgYW5kIGlzXG4gKiBub3QgY29uc2lkZXJlZCBhIGNoZWNrLlxuICpcbiAqIEBhYnN0cmFjdFxuICogQGltcGxlbWVudHMge0NyaXRlcmlvbn1cbiAqL1xuY2xhc3MgQ3JpdGVyaWEge1xuXG4gICAgLyoqXG4gICAgICogZ2V0Q3JpdGVyaWEgcmV0dXJucyBhIG1hcCBvZiBDcml0ZXJvbiB0aGlzIG9iamVjdHMuXG4gICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgKi9cbiAgICBnZXRDcml0ZXJpYSgpIHtcblxuICAgICAgICB2YXIgbyA9IHt9O1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMpLmZvckVhY2goa2V5ID0+IHtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSlcbiAgICAgICAgICAgICAgICBpZiAoa2V5WzBdICE9PSAnXycpXG4gICAgICAgICAgICAgICAgICAgIG9ba2V5XSA9IHRoaXNba2V5XTtcblxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uQ29tcGxldGUgaXMgY2FsbGVkIGlmIHRoZXJlIGFyZSBubyBlcnJvcnMgYWZ0ZXIgYXBwbHlpbmcgYWxsIHRoZSBydWxlcy5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVzdWx0IFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGRvbmUgXG4gICAgICovXG4gICAgb25Db21wbGV0ZShyZXN1bHQsIGRvbmUpIHtcblxuICAgICAgICBkb25lKG51bGwsIHJlc3VsdCk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbkVycm9yIGlzIGNhbGxlZCBpZiBhbiBlcnJvciBvY2N1cmVkIGFmdGVyIGFwcGx5aW5nIGFsbCB0aGUgcnVsZXMuXG4gICAgICovXG4gICAgb25FcnJvcihlcnIsIG9iaiwgZG9uZSkge1xuXG4gICAgICAgIGRvbmUoZXJyLCBvYmopO1xuXG4gICAgfVxuXG4gICAgc2F0aXNmeShrZXksIHZhbHVlLCBkb25lKSB7XG5cbiAgICAgICAgKG5ldyBEZWZhdWx0U3RyYXRlZ3koKSkuZXhlY3V0ZSh0aGlzLCB2YWx1ZSxcbiAgICAgICAgICAgIChlcnIsIG8pID0+IChlcnIgIT09IG51bGwpID9cbiAgICAgICAgICAgIGRvbmUoZXJyLCBrZXksIHZhbHVlKSA6XG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGUobywgKGVyciwgbykgPT4gZG9uZShlcnIsIGtleSwgbykpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGV4ZWN1dGUgdGhlIHJ1bGVzIHRvIHRoZSBwYXNzZWQgb2JqZWN0LlxuICAgICAqIElmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGl0IGlzIGNhbGxlZCB3aXRoIHRoZSByZXN1bHRzLFxuICAgICAqIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGludGVybmFsIHN0cmF0ZWd5IGluIHVzZSBpcyBhbHNvIHJldHVybmVkIHdoaWNoXG4gICAgICogaXMgZXhwZWN0ZWQgdG8gYmUgbnVsbCBvciBhIFByb21pc2UuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGFwcGx5IHRocm91Z2ggdGhlIHBpcGUuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2IgQSBjYWxsYmFjayB0aGF0IGlzIGNhbGxlZCB3aXRoIHRoZSByZXN1bHRzLlxuICAgICAqIEByZXR1cm5zIHtudWxsfFByb21pc2V9IFxuICAgICAqL1xuICAgIGV4ZWN1dGUob2JqLCBkb25lKSB7XG5cbiAgICAgICAgKG5ldyBEZWZhdWx0U3RyYXRlZ3koKSkuZXhlY3V0ZSh0aGlzLCBvYmosXG4gICAgICAgICAgICAoZXJyLCBvKSA9PiAoZXJyICE9PSBudWxsKSA/IHRoaXMub25FcnJvcihlcnIsIG9iaiwgZG9uZSkgOiB0aGlzLm9uQ29tcGxldGUobywgZG9uZSkpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENyaXRlcmlhXG4iXX0=