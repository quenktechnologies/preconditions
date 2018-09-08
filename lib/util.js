"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * combineKeys the keys of two objects into an array.
 */
exports.combineKeys = function (o1, o2) {
    return Object
        .keys(o1)
        .concat(Object.keys(o2))
        .filter(function (k, i, l) { return l.indexOf(k) == i; });
};
/**
 * unwrap applies a precondition received from a function.
 */
exports.unwrap = function (p) { return function (value) { return p()(value); }; };
//# sourceMappingURL=util.js.map