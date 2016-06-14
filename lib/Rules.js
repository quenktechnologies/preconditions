'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var INVALID_MSG = 'Invalid value supplied for \'{key}\'!';
var REQUIRED_MSG = 'The field \'{key}\' is required!';
var MAX_MSG = 'The field \'{key}\' takes a maximum of {max} characters!';
var MIN_MSG = 'The field \'{key}\' takes a minimum of {min} characters!';
var ONE_OF_MSG = 'The field \'{key}\' must be one of \'{enum}\!';

/**
 * Rules provides convenience methods for
 * creating some of the builting Criterion.
 */

var Rules = (function () {
    function Rules() {
        _classCallCheck(this, Rules);
    }

    _createClass(Rules, [{
        key: 'getMessage',

        /**
         * getMessage provides a template message string based on values
         * passed
         * @param {string} template 
         * @param {object} context 
         * @returns {string}
         */
        value: function getMessage(template, context) {
            return template.replace(/\{([\w\$\.\-]*)}/g, function (s, k) {
                return context[k];
            });
        }

        /**
         * cast supplies a Cast rule.
         * @param {function} type 
         * @returns {callback}
         */
    }, {
        key: 'cast',
        value: function cast(type) {

            return function (key, value, next) {
                return next(null, key, type(value));
            };
        }

        /**
         * Ensures the value satisfies the type
         * @param {string} type 
         * @param {string} emsg 
         */
    }, {
        key: 'typeOf',
        value: function typeOf(type, emsg) {
            var _this = this;

            return function (key, value, next) {
                return typeof v === type ? n(null, key, value) : next(new Error(_this.getMessage((emsg || TYPE_OF_MSG, {
                    key: key,
                    value: value
                }))), key, value);
            };
        }

        /**
         * match supplies a Match rule.
         * @param {RegExp} reg 
         * @param {string} emsg 
         */
    }, {
        key: 'match',
        value: function match(reg, emsg) {
            var _this2 = this;

            return function (key, value, next) {
                return reg.test(value) ? next(null, key, value) : next(new Error(_this2.getMessage(emsg || INVALID_MSG, {
                    key: key,
                    value: value
                })), key, value);
            };
        }

        /**
         * trim the value
         * @returns {callback}
         */
    }, {
        key: 'trim',
        value: function trim() {

            return function (key, value, next) {
                return next(null, key, typeof value === 'string' ? value.trim() : value);
            };
        }

        /**
         * range supplies a Range rule
         * @param {number} min
         * @param {number} max 
         * @param {string} minMsg
         * @param {string} maxMsg 
         * @returns {callback}
         */
    }, {
        key: 'range',
        value: function range(min, max, minMsg, maxMsg) {
            var _this3 = this;

            return function (key, value, next) {

                var test = typeof value === 'number' ? value : value.length ? value.length : null;

                if (test === null) return next(new Error(_this3.getMessage(INVALID_MSG, {
                    key: key,
                    value: value,
                    max: max,
                    min: min
                })), key, value);

                if (test < min) return next(new Error(_this3.getMessage(minMsg || MIN_MSG, {
                    key: key,
                    value: value,
                    max: max,
                    min: min
                })), key, value);

                if (test > max) return next(new Error(_this3.getMessage(maxMsg || MAX_MSG, {
                    key: key,
                    value: value,
                    max: max,
                    min: min
                })), key, value);

                next(null, key, value);
            };
        }

        /**
         * required checks that something was suppled for the value
         * @param {string} emsg 
         * @returns {callback}
         */
    }, {
        key: 'required',
        value: function required(emsg) {
            var _this4 = this;

            return function (key, value, next) {
                return [undefined, null, ''].indexOf(value) > -1 ? next(new Error(_this4.getMessage(emsg || REQUIRED_MSG, {
                    key: key,
                    value: value
                })), key, value) : next(null, key, value);
            };
        }

        /**
         * enum supplies a OneOf rule
         * @param {array} list 
         * @param {string} emsg 
         */
    }, {
        key: 'oneOf',
        value: function oneOf(list, emsg) {
            var _this5 = this;

            return function (key, value, next) {
                return list.indexOf(value) < -1 ? next(new Error(_this5.getMessage(emsg || ONE_OF_MSG, {
                    key: key,
                    value: value,
                    'enum': list.join(',')
                })), key, value) : next(null, key, value);
            };
        }

        /**
         * optional will not continue the chain if the value is not set
         */
    }, {
        key: 'optional',
        value: function optional(key, value, next) {

            if (!value) return next(null, null, null);

            next(null, key, value);
        }
    }]);

    return Rules;
})();

exports['default'] = Rules;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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RUFBRSxLQUFLLENBQUMsR0FDaEIsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDO2FBQUEsQ0FBQztTQUM5Qjs7Ozs7Ozs7O2VBT0ksZUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFOzs7QUFFZCxtQkFBTyxVQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSTt1QkFBSyxBQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQ2xELElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFLLFVBQVUsQ0FBQyxJQUFJLElBQUksVUFBVSxFQUFFO0FBQy9DLHVCQUFHLEVBQUgsR0FBRztBQUNILHlCQUFLLEVBQUwsS0FBSztBQUNMLDRCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUN2QixDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQ2hCLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQzthQUFBLENBQUM7U0FFOUI7Ozs7Ozs7ZUFLTyxrQkFBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTs7QUFFdkIsZ0JBQUksQ0FBQyxLQUFLLEVBQ04sT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFbEMsZ0JBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBRzFCOzs7V0E5SkMsS0FBSzs7O3FCQW1LSSxLQUFLIiwiZmlsZSI6IlJ1bGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgSU5WQUxJRF9NU0cgPSAnSW52YWxpZCB2YWx1ZSBzdXBwbGllZCBmb3IgXFwne2tleX1cXCchJztcbmNvbnN0IFJFUVVJUkVEX01TRyA9ICdUaGUgZmllbGQgXFwne2tleX1cXCcgaXMgcmVxdWlyZWQhJztcbmNvbnN0IE1BWF9NU0cgPSAnVGhlIGZpZWxkIFxcJ3trZXl9XFwnIHRha2VzIGEgbWF4aW11bSBvZiB7bWF4fSBjaGFyYWN0ZXJzISc7XG5jb25zdCBNSU5fTVNHID0gJ1RoZSBmaWVsZCBcXCd7a2V5fVxcJyB0YWtlcyBhIG1pbmltdW0gb2Yge21pbn0gY2hhcmFjdGVycyEnO1xuY29uc3QgT05FX09GX01TRyA9ICdUaGUgZmllbGQgXFwne2tleX1cXCcgbXVzdCBiZSBvbmUgb2YgXFwne2VudW19XFwhJztcblxuLyoqXG4gKiBSdWxlcyBwcm92aWRlcyBjb252ZW5pZW5jZSBtZXRob2RzIGZvclxuICogY3JlYXRpbmcgc29tZSBvZiB0aGUgYnVpbHRpbmcgQ3JpdGVyaW9uLlxuICovXG5jbGFzcyBSdWxlcyB7XG5cbiAgICAvKipcbiAgICAgKiBnZXRNZXNzYWdlIHByb3ZpZGVzIGEgdGVtcGxhdGUgbWVzc2FnZSBzdHJpbmcgYmFzZWQgb24gdmFsdWVzXG4gICAgICogcGFzc2VkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRlbXBsYXRlIFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjb250ZXh0IFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0TWVzc2FnZSh0ZW1wbGF0ZSwgY29udGV4dCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGUucmVwbGFjZSgvXFx7KFtcXHdcXCRcXC5cXC1dKil9L2csIChzLCBrKSA9PiBjb250ZXh0W2tdKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjYXN0IHN1cHBsaWVzIGEgQ2FzdCBydWxlLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHR5cGUgXG4gICAgICogQHJldHVybnMge2NhbGxiYWNrfVxuICAgICAqL1xuICAgIGNhc3QodHlwZSkge1xuXG4gICAgICAgIHJldHVybiAoa2V5LCB2YWx1ZSwgbmV4dCkgPT4gbmV4dChudWxsLCBrZXksIHR5cGUodmFsdWUpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVuc3VyZXMgdGhlIHZhbHVlIHNhdGlzZmllcyB0aGUgdHlwZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbXNnIFxuICAgICAqL1xuICAgIHR5cGVPZih0eXBlLCBlbXNnKSB7XG5cbiAgICAgICAgcmV0dXJuIChrZXksIHZhbHVlLCBuZXh0KSA9PiAodHlwZW9mIHYgPT09IHR5cGUpID8gbihudWxsLCBrZXksIHZhbHVlKSA6XG4gICAgICAgICAgICBuZXh0KG5ldyBFcnJvcih0aGlzLmdldE1lc3NhZ2UoKGVtc2cgfHwgVFlQRV9PRl9NU0csIHtcbiAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICAgIH0pKSksIGtleSwgdmFsdWUpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogbWF0Y2ggc3VwcGxpZXMgYSBNYXRjaCBydWxlLlxuICAgICAqIEBwYXJhbSB7UmVnRXhwfSByZWcgXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVtc2cgXG4gICAgICovXG4gICAgbWF0Y2gocmVnLCBlbXNnKSB7XG5cbiAgICAgICAgcmV0dXJuIChrZXksIHZhbHVlLCBuZXh0KSA9PiAocmVnLnRlc3QodmFsdWUpKSA/IG5leHQobnVsbCwga2V5LCB2YWx1ZSkgOlxuICAgICAgICAgICAgbmV4dChuZXcgRXJyb3IodGhpcy5nZXRNZXNzYWdlKGVtc2cgfHwgSU5WQUxJRF9NU0csIHtcbiAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICAgIH0pKSwga2V5LCB2YWx1ZSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0cmltIHRoZSB2YWx1ZVxuICAgICAqIEByZXR1cm5zIHtjYWxsYmFja31cbiAgICAgKi9cbiAgICB0cmltKCkge1xuXG4gICAgICAgIHJldHVybiAoa2V5LCB2YWx1ZSwgbmV4dCkgPT4gbmV4dChudWxsLCBrZXksXG4gICAgICAgICAgICAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykgP1xuICAgICAgICAgICAgdmFsdWUudHJpbSgpIDogdmFsdWUpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogcmFuZ2Ugc3VwcGxpZXMgYSBSYW5nZSBydWxlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXggXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1pbk1zZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtYXhNc2cgXG4gICAgICogQHJldHVybnMge2NhbGxiYWNrfVxuICAgICAqL1xuICAgIHJhbmdlKG1pbiwgbWF4LCBtaW5Nc2csIG1heE1zZykge1xuXG4gICAgICAgIHJldHVybiAoa2V5LCB2YWx1ZSwgbmV4dCkgPT4ge1xuXG4gICAgICAgICAgICB2YXIgdGVzdCA9ICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSA/XG4gICAgICAgICAgICAgICAgdmFsdWUgOlxuICAgICAgICAgICAgICAgICh2YWx1ZS5sZW5ndGgpID9cbiAgICAgICAgICAgICAgICB2YWx1ZS5sZW5ndGggOiBudWxsO1xuXG4gICAgICAgICAgICBpZiAodGVzdCA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3IodGhpcy5nZXRNZXNzYWdlKElOVkFMSURfTVNHLCB7XG4gICAgICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIG1heCxcbiAgICAgICAgICAgICAgICAgICAgbWluXG4gICAgICAgICAgICAgICAgfSkpLCBrZXksIHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHRlc3QgPCBtaW4pXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldE1lc3NhZ2UobWluTXNnIHx8IE1JTl9NU0csIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluXG4gICAgICAgICAgICAgICAgICAgIH0pKSwga2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICh0ZXN0ID4gbWF4KVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvcih0aGlzLmdldE1lc3NhZ2UobWF4TXNnIHx8IE1BWF9NU0csIHtcbiAgICAgICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgbWF4LFxuICAgICAgICAgICAgICAgICAgICBtaW5cbiAgICAgICAgICAgICAgICB9KSksIGtleSwgdmFsdWUpO1xuXG4gICAgICAgICAgICBuZXh0KG51bGwsIGtleSwgdmFsdWUpO1xuXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXF1aXJlZCBjaGVja3MgdGhhdCBzb21ldGhpbmcgd2FzIHN1cHBsZWQgZm9yIHRoZSB2YWx1ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbXNnIFxuICAgICAqIEByZXR1cm5zIHtjYWxsYmFja31cbiAgICAgKi9cbiAgICByZXF1aXJlZChlbXNnKSB7XG5cbiAgICAgICAgcmV0dXJuIChrZXksIHZhbHVlLCBuZXh0KSA9PlxuICAgICAgICAgICAgKFt1bmRlZmluZWQsIG51bGwsICcnXS5pbmRleE9mKHZhbHVlKSA+IC0xKSA/XG4gICAgICAgICAgICBuZXh0KG5ldyBFcnJvcih0aGlzLmdldE1lc3NhZ2UoZW1zZyB8fCBSRVFVSVJFRF9NU0csIHtcbiAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICAgIH0pKSwga2V5LCB2YWx1ZSkgOlxuICAgICAgICAgICAgbmV4dChudWxsLCBrZXksIHZhbHVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBlbnVtIHN1cHBsaWVzIGEgT25lT2YgcnVsZVxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGxpc3QgXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVtc2cgXG4gICAgICovXG4gICAgb25lT2YobGlzdCwgZW1zZykge1xuXG4gICAgICAgIHJldHVybiAoa2V5LCB2YWx1ZSwgbmV4dCkgPT4gKGxpc3QuaW5kZXhPZih2YWx1ZSkgPCAtMSkgP1xuICAgICAgICAgICAgbmV4dChuZXcgRXJyb3IodGhpcy5nZXRNZXNzYWdlKGVtc2cgfHwgT05FX09GX01TRywge1xuICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICBlbnVtOiBsaXN0LmpvaW4oJywnKVxuICAgICAgICAgICAgfSkpLCBrZXksIHZhbHVlKSA6XG4gICAgICAgICAgICBuZXh0KG51bGwsIGtleSwgdmFsdWUpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb3B0aW9uYWwgd2lsbCBub3QgY29udGludWUgdGhlIGNoYWluIGlmIHRoZSB2YWx1ZSBpcyBub3Qgc2V0XG4gICAgICovXG4gICAgb3B0aW9uYWwoa2V5LCB2YWx1ZSwgbmV4dCkge1xuXG4gICAgICAgIGlmICghdmFsdWUpXG4gICAgICAgICAgICByZXR1cm4gbmV4dChudWxsLCBudWxsLCBudWxsKTtcblxuICAgICAgICBuZXh0KG51bGwsIGtleSwgdmFsdWUpO1xuXG5cbiAgICB9XG5cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSdWxlc1xuIl19