"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DualFailure = exports.ModifiedFailure = exports.PrimFailure = void 0;
const polate_1 = require("@quenk/polate");
const record_1 = require("@quenk/noni/lib/data/record");
/**
 * PrimFailure is the failure
 */
class PrimFailure {
    constructor(message, value, context = {}) {
        this.message = message;
        this.value = value;
        this.context = context;
    }
    static create(message, value, ctx = {}) {
        return new PrimFailure(message, value, ctx);
    }
    explain(templates = {}, ctx = {}) {
        let context = (0, record_1.merge)(this.context, ctx);
        let key = context.$key;
        let $value = this.value;
        let split = templates[this.message.split('.')[0]];
        let str = this.message;
        let combined = (typeof context['$key'] === 'string') ?
            `${context.$key}.${this.message}` :
            this.message;
        if (templates[combined]) {
            str = templates[combined];
        }
        else if (templates[key]) {
            str = templates[key];
        }
        else if (templates[split]) {
            str = templates[split];
        }
        else if (templates[this.message]) {
            str = templates[this.message];
        }
        return (0, polate_1.polate)(str, (0, record_1.merge)(context, { $value }));
    }
    toError(templates = {}, context = {}) {
        return new Error(this.explain(templates, context));
    }
}
exports.PrimFailure = PrimFailure;
/**
 * ModifiedFailure is used in situations where a precondition is composite
 * and we need to modify the value to be the original left one.
 */
class ModifiedFailure {
    constructor(value, previous) {
        this.value = value;
        this.previous = previous;
    }
    get message() {
        return this.previous.message;
    }
    get context() {
        return this.previous.context;
    }
    static create(value, previous) {
        return new ModifiedFailure(value, previous);
    }
    explain(templates = {}, ctx = {}) {
        return this.previous.explain(templates, (0, record_1.merge)(ctx, { value: this.value }));
    }
    toError(templates = {}, context = {}) {
        let e = this.explain(templates, context);
        return new Error((typeof e === 'object') ? JSON.stringify(e) : e);
    }
}
exports.ModifiedFailure = ModifiedFailure;
class DualFailure {
    constructor(value, left, right) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
    get message() {
        return `${this.left.message} | ${this.right.message}`;
    }
    get context() {
        return { left: this.left.context, right: this.right.context };
    }
    explain(templates = {}, ctx = {}) {
        let _ctx = (0, record_1.merge)(ctx, { value: this.value });
        return {
            left: this.left.explain(templates, _ctx),
            right: this.right.explain(templates, _ctx)
        };
    }
    toError(templates = {}, context = {}) {
        let e = this.explain(templates, context);
        return new Error((typeof e === 'object') ? JSON.stringify(e) : e);
    }
}
exports.DualFailure = DualFailure;
//# sourceMappingURL=index.js.map