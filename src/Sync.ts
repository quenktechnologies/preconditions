import * as afpl from 'afpl';
import * as polate from '@quenk/polate';
import * as Async from './Async';
import { Either } from 'afpl';

export { Async }

/**
 * Precondition represents some condition that must be satisfied
 * in order for data to be considered a valid type.
 *
 * The left type class represents the original type and the
 * right the final one.
 */
export interface Precondition<A, B> {

    (value: A): Result<A, B>;

}

/**
 * Result of a precondition.
 */
export type Result<A, B> = Either<Failure<A>, B>;

/**
 * Failures is a map of Failures.
 */
export interface Failures<A> {

    [key: string]: Failure<A>

}

/**
 * Failure means a precondition did not go so well.
 */
export class Failure<A> {

    constructor(public message: string, public value?: A, public context: Context = {}) { }

    explain(templates: { [key: string]: string } = {}, c: Context = {}): Explanation {

        let combined = (typeof c['$key'] === 'string') ?
            `${c.$key}.${this.message}` :
            this.message;
        let key = c.$key;
        let $value = this.value;

        //@todo: fix stairway to hell

        return polate.polate(
            ((templates[combined]) ?
                templates[combined] :
                (templates[<string>key]) ?
                    templates[<string>key] :
                    (templates[this.message.split('.')[0]]) ?
                        templates[this.message.split('.')[0]] :
                        (templates[this.message]) ?
                            templates[this.message] :
                            this.message), afpl.util.merge(this.context, c, { $value }));

    }

}

/**
 * Contexts is a map of Contexts.
 */
export interface Contexts {

    [key: string]: Context

}

/**
 * Context of a failure, used to explain error messages.
 */
export interface Context {

    [key: string]: any

}

/**
 * Explanation of what wen wrong with a Precondition.
 */
export type Explanation
    = string
    | object
    ;

export class ListFailure<A> extends Failure<A[]> {

    constructor(
        public failures: Failures<A>,
        public value: A[],
        public contexts: Contexts = {}) { super('list', value, contexts); }

    explain(templates: { [key: string]: string } = {}, c: Context = {}): Explanation {

        return afpl.util.reduce(this.failures, ((o, f, $index) =>
            afpl.util.merge(o, {
                [$index]: f.explain(templates, afpl.util.merge(c, { $index }))
            })), {});

    }

}

/**
 * MapFailure is contains info on failures that occured while applying preconditions.
 */
export class MapFailure<A extends Values<V>, V> extends Failure<A> {

    constructor(
        public failures: Failures<V>,
        public value: A,
        public contexts: Contexts = {}) { super('map', value, contexts); }

    explain(templates: { [key: string]: string } = {}, c: Context = {}): Explanation {

        return afpl.util.reduce(this.failures, (o, f, $key) =>
            afpl.util.merge(o, {
                [$key]: f.explain(templates, afpl.util.merge(c, { $key }))
            }), {});

    }

}

/**
 * Values is a map of values to apply a map {@link Precondition} to.
 */
export interface Values<V> {

    [key: string]: V

}

/**
 * @private
 */
export interface Reports<M, V> {

    failures: Failures<M>
    values: Values<V>

}

/**
 * A map of key precondition pairs.
 *
 * The right type class should be the union
 * of all possible values (or any) and the 
 * right th union of all possible outcomes.
 */
export interface Preconditions<A, B> {

    [key: string]: Precondition<A, B>

}

/**
 * @private
 */
export const whenLeft =
    <M, V>(key: string, { failures, values }: Reports<M, V>) =>
        (f: Failure<M>) => ({
            values,
            failures: afpl.util.merge<Failures<M>, Failures<M>>(failures, {
                [key]: f
            })
        });

/**
 * @private
 */
export const whenRight =
    <M, V>(
        key: string,
        { failures, values }: Reports<M, V>) =>
        (v: V) => (v == null) ?
            { failures, values } :
            ({
                failures,
                values: afpl.util.merge<Values<V>, Values<V>>(values, {
                    [key]: v
                })
            });

/**
 * left wraps a value in the left side of an Either
 */
export const left: <A, B>(a: A) => Either<A, B> = Either.left;

/**
 * right wraps a value in the right side of an Either
 */
export const right: <A, B>(b: B) => Either<A, B> = Either.right;

/**
 * fail produces a new one to one Failure instance wrapped
 * in the left side of an Either.
 */
export const fail = <A, B>(message: string, value: A, ctx: Context = {}) =>
    left<Failure<A>, B>(new Failure(message, value, ctx));

/**
 * mapFail produces a new MapFailure wrapped in the left side
 * of an Either from a map (object) of failures.
 */
export const mapFail =
    <A extends Values<V>, V, B>(errors: Failures<V>, value: A, contexts: Contexts = {}) =>
        left<MapFailure<A, V>, B>(new MapFailure(errors, value, contexts));

/**
 * listFail produces a new ListFailure wrapped in the left side
 * of an Either
 */
export const listFail =
    <A, B>(errors: Failures<A>, value: A[], contexts: Contexts = {}) =>
        left<ListFailure<A>, B[]>(new ListFailure(errors, value, contexts));

/**
 * valid signals a precondition has passed and wraps the latest
 * version of the value in the left side of an Either.
 */
export const valid = <A, B>(b: B) => right<Failure<A>, B>(b);

/* Preconditions */

/**
 * map accepts a javascript object whose properties are all preconditions
 * and returns a function that will apply each to the corresponding key.
 *
 * The A type class is the type of values the passed object is expected to
 * have and the B the resulting object/interface we get when all preconditions
 * pass.
 */
export const map = <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>)
    : Precondition<A, B> => (value: A) => {

        let init: Reports<AB, AB> = { failures: {}, values: {} };

        if (typeof value !== 'object') {

            return mapFail<A, AB, B>({}, value);

        } else {

            let reports = afpl.util.reduce<Precondition<AB, AB>, Reports<AB, AB>>(conditions,
                (r: Reports<AB, AB>, p: Precondition<AB, AB>, k: string) =>

                    p(value[k])
                        .cata(
                        whenLeft(k, r),
                        whenRight(k, r)), init);

            if (Object.keys(reports.failures).length > 0)
                return mapFail<A, AB, B>(reports.failures, value);
            else
                return valid<A, B>(<B><any>reports.values);

        }
    }

/**
 * partial is like map except it only applies to keys that exists
 * on the passed value.
 */
export const partial =
    <A extends Values<AB>, AB, B>(conditions: Preconditions<AB, AB>) =>
        (value: A) => {

            let init: Reports<AB, AB> = { failures: {}, values: {} };

            if (typeof value !== 'object') {

                return mapFail<A, AB, B>({}, value);

            } else {

                let reports = afpl.util.reduce(value,
                    (r: Reports<AB, AB>, x: AB, k: string) =>
                        (conditions.hasOwnProperty(k)) ?
                            conditions[k](x)
                                .cata(whenLeft(k, r), whenRight(k, r)) :
                            r, init);

                if (Object.keys(reports.failures).length > 0)
                    return mapFail<A, AB, B>(reports.failures, value);
                else
                    return valid<A, B>(<B><any>reports.values);

            }

        }
/**
 * or
 */
export const or =
    <A, B>(left: Precondition<A, B>, right: Precondition<A, B>)
        : Precondition<A, B> =>
        (value: A) => left(value).orElse(() => right(value));

/**
 * and
 */
export const and =
    <A, B>(l: Precondition<A, A>, r: Precondition<A, B>)
        : Precondition<A, B> =>
        (value: A) => l(value).chain(r);

/**
 * every takes a set of preconditions and attempts to apply all
 * one after the other to the input
 */
export const every = <A, B>(p: Precondition<A, B>, ...list: Precondition<B, B>[])
    : Precondition<A, B> => (value: A) =>
        p(value)
            .chain((b: B) =>
                list
                    .reduce((e, f) => e.chain(f), right<Failure<B>, B>(b))
                    .cata(f => fail<A, B>(f.message, value), b => valid<A, B>(b)));
/**
 * set the value to the value specified, no matter what 
 */
export const set = <A, B>(b: B): Precondition<A, B> => (_a: A) => valid<A, B>(b);

/**
 * populated tests if an array or object is populated.
 */
export const populated = <A>(value: A) =>
    Object.keys(value).length === 0 ?
        fail<A, A>('populated', value) :
        valid<A, A>(value);

/**
 * when conditionally applies one of two preconditions depending
 * on the outcome of a test function.
 */
export const when = <A, B>(
    test: (a: A) => boolean,
    applied: Precondition<A, B>,
    otherwise: Precondition<A, B>): Precondition<A, B> =>
    (value: A) => (test(value) === true) ? applied(value) : otherwise(value);

/**
 * whenTrue conditionally applies applied or otherwise depending
 * on whether condition is true or not.
 */
export const whenTrue =
    <A, B>(
        condition: boolean,
        applied: Precondition<A, B>,
        otherwise: Precondition<A, B>): Precondition<A, B> =>
        (value: A) => (condition === true) ? applied(value) : otherwise(value);

/**
 * whenFalse (opposite of whenTrue).
 */
export const whenFalse = <A, B>(
    condition: boolean,
    applied: Precondition<A, B>,
    otherwise: Precondition<A, B>): Precondition<A, B> =>
    (value: A) => (condition === false) ? applied(value) : otherwise(value);

/**
 * each applies a precondition for each member of an array.
 */
export const each =
    <A, B>(p: Precondition<A, B>): Precondition<A[], B[]> =>
        (value: A[]) => {

            let r = value.reduce(({ failures, values }, a, k) =>
                p(a).cata(
                    (f: Failure<A>) => ({
                        values,
                        failures: afpl.util.merge(failures, { [k]: f })
                    }),
                    (b: B) => ({
                        failures,
                        values: values.concat(b)
                    })), { failures: {}, values: [] });

            if (Object.keys(r.failures).length > 0)
                return listFail<A, B>(r.failures, value)
            else
                return valid<A[], B[]>(r.values);

        }

/**
 * matches tests if the value satisfies a regular expression.
 */
export const matches = (pattern: RegExp): Precondition<string, string> => (value: string) =>
    (!pattern.test(value)) ?
        fail<string, string>('matches', value, { pattern: pattern.toString() }) :
        valid<string, string>(value)

export type Measureable
    = string
    | number
    | any[]
    ;

/**
 * range tests whether the length of an array, string or number falls within a range.
 */
export const range: <A extends Measureable>(min: number, max: number) => Precondition<A, A> =
    <A extends Measureable>(min: number = 0, max: number = Infinity) => (value: A) =>
        (Array.isArray(value)) ?
            ((value.length < min) ? fail<A, A>('range.min', <A>value, { min, max }) :
                (value.length > max) ? fail<A, A>('range.max', <A>value, { min, max }) :
                    valid<A, A>(<A>value)) :

            (typeof value === 'number') ?
                (value < min) ?
                    fail<A, A>('range.min', <A>value, { min, max }) :
                    (value > max) ?
                        fail<A, A>('range.max', value, { min, max }) :
                        valid<A, A>(value) :

                (typeof value === 'string') ?
                    (((<string>value).length < min) ? fail<A, A>('range.min', <A>value) :
                        ((<string>value).length > max) ? fail<A, A>('range.max', <A>value) :
                            valid<A, A>(<A>value)) :
                    fail<A, A>('invalid', value)

/**
 * @private
 */
const isB = <B>(a: any, b: B): a is B => (a === b)

/**
 * equals tests if the value is equal to the value specified (strictly).
 */
export const equals = <A, B>(target: B): Precondition<A, B> =>
    (value: A) => isB(value, target) ?
        valid<A, B>(target) :
        fail<A, B>('equals', value, { target });

/**
 * required requires a value to be specified
 */
export const required = <A>(value: A) =>
    ((value == null) || ((typeof value === 'string') && (value === ''))) ?
        fail('notNull', value) :
        valid(value)

/**
 * optional applies the tests given only if the value is != null
 */
export const optional = <A, B>(p: Precondition<A, A | B>)
    : Precondition<A, A | B> =>
    (value: A) =>
        ((value == null) || (typeof value === 'string' && value === '')) ?
            valid<A, A>(value) : p(value);

/**
 * upper transforms a string into uppercase
 */
export const upper = (s: string) => valid<string, string>(s.toUpperCase());

/**
 * lower transforms a string into lowercase
 */
export const lower =
    (s: string) => valid<string, string>(s.toLowerCase());


export const trim =
    (s: string): Result<string, string> => valid<string, string>(s.trim());

/**
 * number tests if a value is a number
 */
export const number = <A>(n: A) =>
    ((typeof n === 'number') && (!isNaN(n))) ? valid<A, number>(n) :
        fail<A, number>('number', n);

/**
 * string tests if a value is a string
 */
export const string = <A>(a: A) => (typeof a === 'string') ?
    valid<A, string>(a) : fail<A, string>('string', a);

/**
 * array tests if the value is an array
 */
export const array =
    <A, B>(a: A) =>
        (Array.isArray(a)) ?
            valid<A, B[]>(a) :
            fail<A, B[]>('array', a);

/**
 * object tests if the value is an js object.
 */
export const object = <A>(value: A) =>
    (typeof value === 'object' && (!Array.isArray(value))) ?
        valid<A, A>(value) :
        fail<A, A>('object', <any>value);

/**
 * isin requires the value to be enumerated in the supplied list.
 */
export const isin = <A>(list: A[]): Precondition<A, A> => (value: A) =>
    (list.indexOf(value) < 0) ?
        fail<A, A>('isin', value, { enum: list }) :
        valid<A, A>(value)

/**
 * cast a value from one type to another using a cast function.
 */
export const cast = <A, B>(f: (a: A) => B)
    : Precondition<A, B> =>
    (a: A) => valid<A, B>(f(a));

/**
 * unwrap applies a precondition received from a function.
 */
export const unwrap =
    <A, B>(p: () => Precondition<A, B>) => (value: A) => p()(value);

