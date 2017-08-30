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

    [key: string]: string | number | boolean | Date | Context

}

export type Expansion
    = string
    | object
    ;

/**
 * MapFailure is contains info on failures that occured while applying preconditions.
 */
export class MapFailure<A> extends Failure<Values<A>> {

    constructor(
        public failures: Failures<A>,
        public value: Values<A>,
        public contexts: Contexts = {}) { super('map', value, {}); }

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
export interface Values<A> {

    [key: string]: A

}

export interface Reports<A, B> {

    failures: Failures<A>
    values: Values<B>

}

/**
 * A map of key precondition pairs
 */
export interface Preconditions<A, B> {

    [key: string]: Precondition<A, B>

}

/**
 * Map of preconditions.
 *
 * A map applies a precondition for each property declared on it.
 * Do not declare any key values that do not implement Precondition.
 */
export class Map<A, B> implements Precondition<Values<A>, Values<B>> {

    apply(value: Values<A>): Result<Values<A>, Values<B>> {

        let conditions = <Preconditions<A, B>><any>this;

        let init: Reports<A, B> = { failures: {}, values: {} };

        let left = (key: string, { failures, values }: Reports<A, B>) =>
            (f: Failure<A>) => ({
                values,
                failures: afpl.util.merge<Failures<A>, Failures<A>>(failures, {
                    [key]: f
                })
            });

        let right = (key: string, { failures, values }: Reports<A, B>) =>
            (b: B) => ({
                values: afpl.util.merge<Values<B>, Values<B>>(values, {
                    [key]: b
                }), failures
            });

        if (typeof value !== 'object') {

            return mapFail<A, Values<B>>({}, value);

        } else {

            let result = afpl.util.reduce(conditions,
                (reports: Reports<A, B>, condition: Precondition<A, B>, key: string) =>
                    condition.apply(value[key])
                        .cata(left(key, reports), right(key, reports)), init);

            if (Object.keys(result.failures).length > 0)
                return mapFail<A, Values<B>>(result.failures, value);
            else
                return valid<Values<A>, Values<B>>(result.values);

        }

    }

}

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
