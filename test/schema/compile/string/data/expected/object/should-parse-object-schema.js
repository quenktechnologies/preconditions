"use strict";
exports.__esModule = true;
exports.test = void 0;
var base = require("../../../../../../../lib");
var object = require("../../../../../../../lib/record");
exports.test = base.and(base.and(base.and(base["default"]({ "n": 2 }), base["const"]({ "n": 1 })), base.type("object")), object.schemaProperties({ n: base.and(base.and(base.and(base.and(base.and(base.and(base["default"](2), number.cast(true)), base["const"](1)), base.type("number")), base["enum"]([1, 2, 3])), number.min(1)), number.max(3)) }, object.restrict, base.and(base.and(base.and(base.and(base["default"](true), boolean.cast(true)), base["const"](false)), base.type("boolean")), base["enum"]([false]))));
