"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var result_1 = require("../../record/result");
var result_2 = require("../../result");
/**
 * @private
 */
exports.review = function (value) {
    return function (r) {
        return (Object.keys(r.failures).length > 0) ?
            Promise.resolve(result_1.failure(r.failures, value, {})) :
            Promise.resolve(result_2.success(r.values));
    };
};
/**
 * @private
 */
exports.reports = function () {
    return Promise.resolve({ failures: {}, values: {} });
};
//# sourceMappingURL=result.js.map