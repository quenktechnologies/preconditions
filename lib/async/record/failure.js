"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var failure_1 = require("../../record/failure");
var failure_2 = require("../../failure");
/**
 * @private
 */
exports.review = function (value) {
    return function (r) {
        return (Object.keys(r.failures).length > 0) ?
            Promise.resolve(failure_1.failure(r.failures, value, {})) :
            Promise.resolve(failure_2.success(r.values));
    };
};
/**
 * @private
 */
exports.reports = function () {
    return Promise.resolve({ failures: {}, values: {} });
};
//# sourceMappingURL=failure.js.map