"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * AsyncPrecondition
 *
 * The async version of the Precondition interface.
 * @interface
 */
var AsyncTransfom = function () {
  function AsyncTransfom() {
    _classCallCheck(this, AsyncTransfom);
  }

  _createClass(AsyncTransfom, [{
    key: "apply",


    /**
     * apply this Precondition asynchronously.
     * @return {Promise<*,Error>}
     */
    value: function apply() {}
  }]);

  return AsyncTransfom;
}();

exports.default = AsyncTransfom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVjb25kaXRpb25zL0FzeW5jUHJlY29uZGl0aW9uLmpzIl0sIm5hbWVzIjpbIkFzeW5jVHJhbnNmb20iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0lBTU1BLGE7Ozs7Ozs7OztBQUVGOzs7OzRCQUlRLENBRVA7Ozs7OztrQkFJVUEsYSIsImZpbGUiOiJBc3luY1ByZWNvbmRpdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQXN5bmNQcmVjb25kaXRpb25cbiAqXG4gKiBUaGUgYXN5bmMgdmVyc2lvbiBvZiB0aGUgUHJlY29uZGl0aW9uIGludGVyZmFjZS5cbiAqIEBpbnRlcmZhY2VcbiAqL1xuY2xhc3MgQXN5bmNUcmFuc2ZvbSB7XG5cbiAgICAvKipcbiAgICAgKiBhcHBseSB0aGlzIFByZWNvbmRpdGlvbiBhc3luY2hyb25vdXNseS5cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlPCosRXJyb3I+fVxuICAgICAqL1xuICAgIGFwcGx5KCkge1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEFzeW5jVHJhbnNmb21cbiJdfQ==