"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.RecordFailure = void 0;
const record_1 = require("@quenk/noni/lib/data/record");
const either_1 = require("@quenk/noni/lib/data/either");
/**
 * RecordFailure contains information about a precondition that failed
 * when applied to an object.
 */
class RecordFailure {
    constructor(failures, value, contexts = {}) {
        this.failures = failures;
        this.value = value;
        this.contexts = contexts;
        this.message = 'object';
    }
    get context() {
        return this.contexts;
    }
    static create(errs, val, ctxs = {}) {
        return new RecordFailure(errs, val, ctxs);
    }
    explain(templates = {}, c = {}) {
        return (0, record_1.reduce)(this.failures, {}, (o, f, $key) => (0, record_1.merge)(o, {
            [$key]: f.explain(templates, (0, record_1.merge)(c, { $key }))
        }));
    }
    toError(templates = {}, context = {}) {
        let e = this.explain(templates, context);
        return new Error((typeof e === 'object') ? JSON.stringify(e) : e);
    }
}
exports.RecordFailure = RecordFailure;
/**
 * fail constructs a new RecordFailure wrapped in the left part of a Result.
 */
const fail = (failures, value, ctx = {}) => (0, either_1.left)(RecordFailure.create(failures, value, ctx));
exports.fail = fail;
//# sourceMappingURL=record.js.map