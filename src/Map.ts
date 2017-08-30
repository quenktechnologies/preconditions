import * as afpl from 'afpl';
import * as polate from '@quenk/polate';
import * as Async from './Async';

export { Async }

/**
 * Precondition represents some condition that must be satisfied
 * in order for data to be considered valid.
 *
 * Implement it to validate, filter or transform input.
 */
export interface Precondition<A, B> {

    /**
     * apply this Precondition
     * Returning an instance of Error indicates the Precondition failed.
     */
    apply(value: A): Result<A, B>;

}

/**
 * Result is the result of a precondition.
 */
export type Result<A, B> = afpl.Either<Failure<A>, B>;

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

    expand(templates: { [key: string]: string } = {}, c: Context = {}): Expansion {

        let combined = (typeof c['$key'] === 'string') ?
            `${c.$key}.${this.message}` :
            this.message;
        let key = c.$key;
        let $value = this.value;

        return polate.polate(
            ((templates[combined]) ?
                templates[combined] :
                (templates[<string>key]) ?
                    templates[<string>key] :
                    (templates[this.message]) ?
                        templates[this.message] :
                        this.message), afpl.util.merge(this.context, c, <any>{ $value }));

    }

}

/**
 * Contexts is a map of Contexts.
 */
export interface Contexts {

    [key: string]: Context

}

/**
 * Context of a failure, used to expand error messages.
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

    expand(templates: { [key: string]: string } = {}, c: Context = {}): Expansion {

        return afpl.util.reduce(this.failures, ((o, f, $index) =>
            afpl.util.merge(o, {
                [$index]: f.expand(templates, afpl.util.merge(c, { $index }))
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

    expand(templates: { [key: string]: string } = {}, c: Context = {}): Expansion {

        return afpl.util.reduce(this.failures, (o, f, $key) =>
            afpl.util.merge(o, {
                [$key]: f.expand(templates, afpl.util.merge(c, { $key }))
            }), {});

    }

}

/**
 * Values is the map of values to apply the preconditions to.
 */
export interface Values<V> {

    [key: string]: V

}

export interface Reports<M, V> {

    failures: Failures<M>
    values: Values<V>

}

/**
 * A map of key precondition pairs
 */
export interface Preconditions<A, B> {

    [key: string]: Precondition<A, B>

}

export class Func<A, B> implements Precondition<A, B> {

    constructor(public f: (value: A) => Result<A, B>) { }

    apply(value: A): Result<A, B> {

        return this.f(value);

    }

}

/**
 * Map of preconditions.
 *
 * A map applies a precondition for each property declared on it.
 * Do not declare any key values that do not implement Precondition.
 */
export class Map<A, C> implements Precondition<Values<A>, C>{

    getConditions(): Preconditions<any, any> {

        return <any>this;

    }

    apply(value: Values<A>): Result<Values<A>, C> {

        let conditions = this.getConditions();
        let init: Reports<A, any> = { failures: {}, values: {} };

        if (typeof value !== 'object') {

            return mapFail<A, C>({}, value);

        } else {

            let reports = afpl.util.reduce(conditions,
                (r: Reports<A, any>, p: Precondition<any, any>, k: string) =>
                    p.apply(value[k]).cata<Reports<A, any>>(whenLeft(k, r), whenRight(k, r)), init);

            if (Object.keys(reports.failures).length > 0)
                return mapFail<A, C>(reports.failures, value);
            else
                return valid<Values<A>, C>(<C><any>reports.values);

        }
    }

}

/**
 * Hash is like Map except you specify the preconditions by passing
 * a plain old javascript object.
 */
export class Hash<A, C> extends Map<A, C> {

    constructor(public conditions: Preconditions<any, any>) { super(); }

    getConditions(): Preconditions<any, any> {

        return this.conditions;

    }

}

export const whenLeft =
    <M, V>(key: string, { failures, values }: Reports<M, V>) =>
        (f: Failure<M>): Reports<M, V> => ({
            values,
            failures: afpl.util.merge<Failures<M>, Failures<M>>(failures, {
                [key]: f
            })
        });

export const whenRight = <M, V>(key: string, { failures, values }: Reports<M, V>) =>
    (v: V): Reports<M, V> => (v == null) ?
        { failures, values } :
        ({
            failures,
            values: afpl.util.merge<Values<V>, Values<V>>(values, {
                [key]: v
            })
        });

export const left: <A, B>(a: A) => afpl.Either<A, B> = afpl.Either.left;

export const right: <A, B>(b: B) => afpl.Either<A, B> = afpl.Either.right;

export const fail: <A, B>(m: string, v: A, ctx?: Context) =>
    afpl.Either<Failure<A>, B> =
    <A, B>(message: string, value: A, ctx: Context = {}) =>
        afpl.Either.left<Failure<A>, B>(new Failure(message, value, ctx));

export const mapFail: <A, B>(e: Failures<A>, v: Values<A>, c?: Contexts) =>
    afpl.Either<MapFailure<A>, B> =
    <A, B>(errors: Failures<A>, value: Values<A>, contexts: Contexts = {}) =>
        afpl.Either.left<MapFailure<A>, B>(new MapFailure(errors, value, contexts));

export const valid: <A, B>(b: B) => afpl.Either<Failure<A>, B> =
    <A, B>(b: B) => afpl.Either.right<Failure<A>, B>(b);

/**
 * func 
 */
export const func: <A, B>(f: (value: A) => Result<A, B>) => Precondition<A, B> =
    <A, B>(f: (value: A) => Result<A, B>) => new Func(f);

/**
 * or
 */
export const or: <A, B>(l: Precondition<A, B>, r: Precondition<A, B>) =>
    Precondition<A, B> = <A, B>(left: Precondition<A, B>, right: Precondition<A, B>) =>
        func((value: A) => left.apply(value).cata(
            () => right.apply(value),
            v => valid(v)))

/**
 * and
 */
export const and: <A, B>(l: Precondition<A, A>, r: Precondition<A, B>) => Precondition<A, B> =
    <A, B>(left: Precondition<A, A>, right: Precondition<A, B>) =>
        func((value: A) => left.apply(value).cata<Result<A, B>>(
            afpl.Either.left,
            (v: A) => right.apply(v)));

/**
 * set 
 */
export const set: <A, B>(v: B) => Precondition<A, B> =
    <B>(v: B) => func((_a: any) => valid(v));

/**
 * whenTrue does evaluates condition and decides
 * whether to return left if false or right if true.
 *
 * The evaluation is done before apply is called.
 */
export const whenTrue = <A, B>(condition: boolean, left: Precondition<A, B>, right: Precondition<A, B>) =>
    func((value: A) => condition ? right.apply(value) : left.apply(value));

/**
 * number tests if the value supplied is a number.
 */
export const number = <A>(): Precondition<A, number> =>
    func((n: A) => (typeof n === 'number') ? valid<A, number>(n) : fail<A, number>('number', n))

/**
 * string tests if the value is a string.
 */
export const string = (): Precondition<any, string> =>
  func((s: any) => (typeof s === 'string') ? 
    valid<any, string>(s) :
    fail<any, string>('string', s))

/**
 * list tests if the value is an array.
 */
export const list = <A, B>(): Precondition<A, B[]> =>
    func((a: A) => (Array.isArray(a)) ?
        valid<A, B[]>(a) :
        fail<A, B[]>('list', a))

/**
 * each applies a precondition for each member of an array.
 */
export const each = <A, B>(p: Precondition<A, B>) =>

    func((value: A) => {

        if (Array.isArray(value)) {

            let r = value.reduce(({ failures, values }, a, k) =>
                p.apply(a).cata(
                    f => ({
                        values,
                        failures: afpl.util.merge(failures, { [k]: f })
                    }),
                    v => ({
                        failures,
                        values: values.concat(v)
                    })), { failures: {}, values: [] });

            if (Object.keys(r.failures).length > 0)
                return afpl.Either.left(new ListFailure(r.failures, value));
            else
                return valid(r.values);

        } else {

            return fail('invalid', value);

        }

    })

/**
 * object tests if the value is a js object.
 */
export const object = <B>(): Precondition<any, B> =>
    func((value: any) => (typeof value !== 'object') ?
        fail<any, B>('object', value) :
        (!Array.isArray(value)) ?
            valid<any, B>(value) :
            fail<any, B>('object', value));


/**
 * matches tests if the value satisfies a regular expression.
 */
export const matches = (pattern: RegExp) =>
    func((value: string) => (!pattern.test(value)) ?
        fail('matches', value, { pattern: pattern.toString() }) :
        valid(value))

/**
 * range tests if a string, number or array falls within a range
 */
export const range = <A>(min: number, max: number) =>
    func((value: string | number | A[]) => {

        let test = (typeof value === 'number') ?
            value :
            (Array.isArray(value)) ?
                value.length :
                (typeof value === 'string') ?
                    value.length : null;

        if (test === null)
            return fail('invalid', value, { min, max });

        if (test < min)
            return fail('range.min', value, { min, max });

        if (test > max)
            return fail('range.max', value, { min, max });

        return valid(value);


    })


const isB = <B>(a: any, b: B): a is B => (a === b)

/**
 * equals tests if the value is equal to the value specified (strictly).
 */
export const equals = <A, B>(target: B) =>
    func((value: A) => isB(value, target) ?
        valid(target) :
        fail('equals', value, { target }));

/**
 * required requires a value to be specified
 */
export const required = <A>() =>
    func((value: A) =>
        ((value == null) || ((typeof value === 'string') && (value === ''))) ?
            fail('notNull', value) :
            valid(value))

/**
 * isin requires the value to be enumerated in the supplied list.
 */
export const isin = <A>(list: A[]) =>
    func((value: A) =>
        (list.indexOf(value) < 0) ?
            fail('isin', value, { list }) :
            valid(value))

/**
 * optional applies the tests given only if the value is != null
 */
export const optional = <A, B>(t: Precondition<A, B>) =>
    func((value: A) => (value == null) ? valid(null) : t.apply(value));

/**
 * length tests if the value is of a certain length.
 */
export const length = <A>(len: number) =>
    func((value: A[] | string) => (value.length !== len) ?
        fail('length', value, { length: len }) :
        valid(value))
