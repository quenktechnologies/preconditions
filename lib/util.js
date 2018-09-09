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
//# sourceMappingURL=util.js.map