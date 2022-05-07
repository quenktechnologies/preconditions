"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.caseOf = exports.match = exports.isin = exports.exists = exports.anyOf = exports.every = exports.and = exports.or = exports.reject = exports.discard = exports.identity = exports.optional = exports.notNull = exports.neq = exports.eq = exports.whenFalse = exports.whenTrue = exports.when = exports.constant = void 0;
/**
 * The precondition library provides an API for validating
 * whether some value meets a pre-condition before it is used
 * in a program.
 *
 * Users of this library are expected to design their own preconditions,
 * however some primitivies are provided to make things easier.
 */
const either_1 = require("@quenk/noni/lib/data/either");
const type_1 = require("@quenk/noni/lib/data/type");
const result_1 = require("./result");
const failure_1 = require("./result/failure");
/**
 * constant forces the value to be the supplied value.
 */
const constant = (b) => (_) => (0, result_1.succeed)(b);
exports.constant = constant;
/**
 * when conditionally applies one of two preconditions depending
 * on the outcome of a test function.
 */
const when = (test, applied, otherwise) => (value) => (test(value) === true) ? applied(value) : otherwise(value);
exports.when = when;
/**
 * whenTrue conditionally applies "applied" or "otherwise" depending
 * on whether "condition" is true or not.
 */
const whenTrue = (condition, applied, otherwise) => (value) => (condition === true) ? applied(value) : otherwise(value);
exports.whenTrue = whenTrue;
/**
 * whenFalse (opposite of whenTrue).
 */
const whenFalse = (condition, applied, otherwise) => (value) => (condition === false) ? applied(value) : otherwise(value);
exports.whenFalse = whenFalse;
/**
 * eq tests if the value is equal (strictly) to the target.
 */
const eq = (target) => (value) => (target === value) ?
    (0, result_1.succeed)(target) :
    (0, result_1.fail)('eq', value, { target });
exports.eq = eq;
/**
 * neq tests if the value is not equal (strictly) to the target.
 */
const neq = (target) => (value) => (target === value) ?
    (0, result_1.fail)('neq', value, { target }) :
    (0, result_1.succeed)(target);
exports.neq = neq;
/**
 * notNull will fail if the value is null or undefined.
 */
const notNull = (value) => ((value == null) || ((typeof value === 'string') && (value === ''))) ?
    (0, result_1.fail)('notNull', value) :
    (0, result_1.succeed)(value);
exports.notNull = notNull;
/**
 * optional applies the precondition given only if the value is not null
 * or undefined.
 */
const optional = (p) => (value) => ((value == null) || (typeof value === 'string' && value === '')) ?
    (0, result_1.succeed)(value) : p(value);
exports.optional = optional;
/**
 * identity always succeeds with the value it is applied to.
 */
const identity = (value) => (0, result_1.succeed)(value);
exports.identity = identity;
/**
 * discard throws away a value by assigning it ot undefined.
 */
const discard = (_) => (0, result_1.succeed)(undefined);
exports.discard = discard;
/**
 * reject always fails with reason no matter the value supplied.
 */
const reject = (reason) => (value) => (0, result_1.fail)(reason, value);
exports.reject = reject;
/**
 * or performs the equivalent of a logical 'or' between two preconditions.
 */
const or = (left, right) => (value) => left(value)
    .orElse(f => right(value)
    .lmap(f2 => new failure_1.DualFailure(value, f, f2)));
exports.or = or;
/**
 * and performs the equivalent of a logical 'and' between two preconditions.
 */
const and = (l, r) => (value) => {
    let result = l(value);
    if (result instanceof either_1.Left) {
        return (0, either_1.left)(result.takeLeft());
    }
    else {
        let result2 = r(result.takeRight());
        if (result2 instanceof either_1.Left)
            return (0, either_1.left)(failure_1.ModifiedFailure.create(value, result2.takeLeft()));
        else
            return (0, either_1.right)(result2.takeRight());
    }
};
exports.and = and;
/**
 * every takes a set of preconditions and attempts to apply each
 * one after the other to the input.
 */
const every = (p, ...list) => (value) => {
    let r = p(value);
    if (r instanceof either_1.Left)
        return r;
    let r2 = list.reduce((p, c) => p.chain(c), (0, either_1.right)(r.takeRight()));
    if (r2 instanceof either_1.Left)
        return (0, either_1.left)(failure_1.ModifiedFailure.create(value, r2.takeLeft()));
    return (0, either_1.right)(r2.takeRight());
};
exports.every = every;
/**
 * anyOf applies all of the preconditions provided until one succeeds.
 */
const anyOf = (...list) => (value) => {
    let result = (0, result_1.fail)('anyOf', value);
    for (let i = 0; i < list.length; i++) {
        result = list[i](value);
        if (result.isRight())
            break;
    }
    return result;
};
exports.anyOf = anyOf;
/**
 * exists requires the value to be enumerated in the supplied list.
 */
const exists = (list) => (value) => (list.indexOf(value) < 0) ?
    (0, result_1.fail)('exists', value, { value, list }) :
    (0, result_1.succeed)(value);
exports.exists = exists;
/**
 * isin requires the value passed to be a member of a provided list.
 */
const isin = (list) => (value) => list.indexOf(value) > -1 ?
    (0, result_1.succeed)(value) :
    (0, result_1.fail)('isin', value);
exports.isin = isin;
/**
 * match preforms a type/structure matching on the input
 * value in order to decide which precondition to apply.
 *
 * Preconditions must be wrapped in a 'caseOf' precondition.
 */
const match = (p, ...list) => (value) => list.reduce((e, f) => (e instanceof either_1.Right) ?
    e :
    e.orElse(r => (r.message === 'caseOf') ?
        f(value) : e), p(value));
exports.match = match;
/**
 * caseOf allows for the selective application of a precondition
 * based on the type or structure of the value.
 *
 * Pattern matching works as follows:
 * string -> Matches on the value of the string.
 * number -> Matches on the value of the number.
 * boolean -> Matches on the value of the boolean.
 * object -> Each key of the object is matched on the value, all must match.
 * function -> Treated as a constructor and results in an instanceof check.
 *             For String,Number and Boolean, this uses the typeof check.
 */
const caseOf = (t, p) => (value) => (0, type_1.test)(value, t) ? p(value) : (0, result_1.fail)('caseOf', value, { type: t });
exports.caseOf = caseOf;
/**
 * log the value to the console.
 */
const log = (value) => (console.log(value), (0, result_1.succeed)(value));
exports.log = log;
//# sourceMappingURL=index.js.map