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
 * Result is the result of a precondition.
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

    explain(templates: { [key: string]: string } = {}, c: Context = {}): Expansion {

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

export type Expansion
    = string
    | object
    ;

export class ListFailure<A> extends Failure<A[]> {

    constructor(
        public failures: Failures<A>,
        public value: A[],
        public contexts: Contexts = {}) { super('list', value, contexts); }

    explain(templates: { [key: string]: string } = {}, c: Context = {}): Expansion {

        return afpl.util.reduce(this.failures, ((o, f, $index) =>
            afpl.util.merge(o, {
                [$index]: f.explain(templates, afpl.util.merge(c, { $index }))
            })), {});

    }

}

/**
 * MapFailure is contains info on failures that occured while applying preconditions.
 */
export class MapFailure<A> extends Failure<Values<A>> {

    constructor(
        public failures: Failures<A>,
        public value: Values<A>,
        public contexts: Contexts = {}) { super('map', value, contexts); }

    explain(templates: { [key: string]: string } = {}, c: Context = {}): Expansion {

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
    <A, B>(errors: Failures<A>, value: Values<A>, contexts: Contexts = {}) =>
        left<MapFailure<A>, B>(new MapFailure(errors, value, contexts));

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
export const map = <A, B>(conditions: Preconditions<A, A>) => (value: Values<A>) => {

    let init: Reports<A, A> = { failures: {}, values: {} };

    if (typeof value !== 'object') {

        return mapFail<A, B>({}, value);

    } else {

        let reports = afpl.util.reduce<Precondition<A, A>, Reports<A, A>>(conditions,
            (r: Reports<A, A>, p: Precondition<A, A>, k: string) =>

                p(value[k])
                    .cata(
                    whenLeft(k, r),
                    whenRight(k, r)), init);

        if (Object.keys(reports.failures).length > 0)
            return mapFail<A, B>(reports.failures, value);
        else
            return valid<Values<A>, B>(<B><any>reports.values);

    }
}

/**
 * partial is like map except it only applies to keys that exists
 * on the passed value.
 */
export const partial =
    <A, B>(conditions: Preconditions<A, A>) =>
        (value: Values<A>) => {

            let init: Reports<A, A> = { failures: {}, values: {} };

            if (typeof value !== 'object') {

                return mapFail<A, B>({}, value);

            } else {

                let reports = afpl.util.reduce(value,
                    (r: Reports<A, A>, a: A, k: string) =>
                        (conditions.hasOwnProperty(k)) ?
                            conditions[k](a)
                                .cata(whenLeft(k, r), whenRight(k, r)) :
                            r, init);

                if (Object.keys(reports.failures).length > 0)
                    return mapFail<A, B>(reports.failures, value);
                else
                    return valid<Values<A>, B>(<B><any>reports.values);

            }

        }
/**
 * or
 */
export const or: <A, B>(l: Precondition<A, B>, r: Precondition<A, B>) =>
    Precondition<A, B> =
    <A, B>(left: Precondition<A, B>, right: Precondition<A, B>) =>
        (value: A) =>
            left(value)
                .cata(() => right(value), (b: B) => valid(b));

/**
 * and
 */
export const and =
    <A, B>(l: Precondition<A, A>, r: Precondition<A, B>) => (value: A) =>
        l(value).chain(r);

/**
 * set 
 */
export const set = <A, B>(b: B) => (_a: A) => valid(b);

/**
 * whenTrue does evaluates condition and decides
 * whether to return left if false or right if true.
 *
 * The evaluation is done before apply is called.
 */
export const whenTrue =
    <A, B>(
        condition: boolean,
        left: Precondition<A, B>,
        right: Precondition<A, B>) =>
        (value: A) =>
            condition ?
                right(value) :
                left(value);

/**
 * each applies a precondition for each member of an array.
 */
export const each: <A, B>(p: Precondition<A, B>) => Precondition<A[], B[]> =
    <A, B>(p: Precondition<A, B>) =>
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
export const matches = (pattern: RegExp) => (value: string) =>
    (!pattern.test(value)) ?
        fail<string, string>('matches', value, { pattern: pattern.toString() }) :
        valid<string, string>(value)

/**
 * Measurable types for range tests.
 */
export type Measurable<A>
    = string
    | number
    | A[]
    ;

/**
 * range tests if a string, number or array falls within a range
 */
export const range: <A>(min: number, max: number) => Precondition<Measurable<A>, Measurable<A>> =
    <A>(min: number = 0, max: number = Infinity) =>
        (value: Measurable<A>) =>

            (Array.isArray(value)) ?
                ((value.length < min) ? fail<A[], A[]>('range.min', value) :
                    (value.length > max) ? fail<A[], A[]>('range.max', value) :
                        valid<A[], A[]>(value)) :

                (typeof value === 'string') ?
                    ((value.length < min) ? fail<string, string>('range.min', value) :
                        (value.length > max) ? fail<string, string>('range.max', value) :
                            valid<string, string>(value)) :

                    (value < min) ?
                        fail<number, number>('range.min', value, { min, max }) :
                        (value > max) ?
                            fail<number, number>('range.max', value, { min, max }) :
                            valid<number, number>(value)

/**
 * @private
 */
const isB = <B>(a: any, b: B): a is B => (a === b)

/**
 * equals tests if the value is equal to the value specified (strictly).
 */
export const equals = <A, B>(target: B) => (value: A) => isB(value, target) ?
    valid(target) : fail('equals', value, { target });

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
export const optional = <A, B>(p: Precondition<A, B>) => (value: A) =>
    ((value == null) || (typeof value === 'string' && value === '')) ?
        valid(value) : p(value);

/**
 * upper transforms a string into uppercase
 */
export const upper = (s: string) => valid<string, string>(s.toUpperCase());

/**
 * lower transforms a string into lowercase
 */
export const lower =
    (s: string) => valid<string, string>(s.toLowerCase());

/**
 * number tests if a value is a number
 */
export const number = <A>(n: A) =>
    (typeof n === 'number') ? valid<A, number>(n) :
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
export const object: <A>() => Precondition<A, A> =
    <A>() =>
        (value: A) =>
            (typeof value === 'object' && (!Array.isArray(value))) ?
                valid<A, A>(value) :
                fail<A, A>('object', <any>value);

/**
 * isin requires the value to be enumerated in the supplied list.
 */
export const isin: <A>(list: A[]) => Precondition<A, A> = <A>(list: A[]) =>
    (value: A) =>
        (list.indexOf(value) < 0) ?
            fail('isin', value, { enum: list }) :
            valid(value)

export const cast = <A, B>(f: (a: A) => B) => (a: A) => valid(f(a));
