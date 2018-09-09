"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var polate = require("@quenk/polate");
var record_1 = require("@quenk/noni/lib/data/record");
var either_1 = require("@quenk/noni/lib/data/either");
/**
 * Failure is the class used to represent a failed precondition.
 */
var Failure = /** @class */ (function () {
    function Failure(message, value, context) {
        if (context === void 0) { context = {}; }
        this.message = message;
        this.value = value;
        this.context = context;
    }
    /**
     * explain converts a Failure into an explanation.
     *
     * Explanations can be expanded by providing a hash of ErrorTemplates
     * and a Context.
     *
     * This function looks up the appropriate template to use and expand in
     * the following order:
     * 1. `${context.$key}.${this.message}`
     * 2. `${key}`
     * 3. `${this.message}`
     *
     * If all these fail the message value is used.
     */
    Failure.prototype.explain = function (templates, context) {
        if (templates === void 0) { templates = {}; }
        if (context === void 0) { context = {}; }
        var combined = (typeof context['$key'] === 'string') ?
            context.$key + "." + this.message :
            this.message;
        var key = context.$key;
        var $value = this.value;
        //@todo: fix stairway to hell
        return polate.polate(((templates[combined]) ?
            templates[combined] :
            (templates[key]) ?
                templates[key] :
                (templates[this.message.split('.')[0]]) ?
                    templates[this.message.split('.')[0]] :
                    (templates[this.message]) ?
                        templates[this.message] :
                        this.message), record_1.merge(record_1.merge(this.context, context), { $value: $value }));
    };
    return Failure;
}());
exports.Failure = Failure;
/**
 * failure constructs a failed Result using the parameters supplied to
 * create a new Failure instance.
 */
exports.failure = function (message, value, ctx) {
    if (ctx === void 0) { ctx = {}; }
    return either_1.left(new Failure(message, value, ctx));
};
/**
 * success constructs a successful Result wraping the final version
 * of the value in the right side of an Either.
 */
exports.success = function (b) { return either_1.right(b); };
//# sourceMappingURL=result.js.map