"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.ArrayFailure = void 0;
const record_1 = require("@quenk/noni/lib/data/record");
const either_1 = require("@quenk/noni/lib/data/either");
/**
 * ArrayFailure represents the failed results of applying
 * a precondition to one or more elements of an array.
 */
class ArrayFailure {
    constructor(failures, value, contexts = {}) {
        this.failures = failures;
        this.value = value;
        this.contexts = contexts;
        this.message = 'array';
    }
    get context() {
        return this.contexts;
    }
    static create(errs, val, ctx) {
        return new ArrayFailure(errs, val, ctx);
    }
    explain(templates = {}, c = {}) {
        return (0, record_1.reduce)(this.failures, {}, (p, f, $index) => (0, record_1.merge)(p, {
            [$index]: f.explain(templates, (0, record_1.merge)(c, { $index }))
        }));
    }
    toError(templates = {}, context = {}) {
        let e = this.explain(templates, context);
        return new Error((typeof e === 'object') ? JSON.stringify(e) : e);
    }
}
exports.ArrayFailure = ArrayFailure;
/**
 * fail constructs a new ArrayFailure wrapped in the left part of a Result.
 */
const fail = (fails, val, ctx = {}) => (0, either_1.left)(ArrayFailure.create(fails, val, ctx));
exports.fail = fail;
//# sourceMappingURL=array.js.map