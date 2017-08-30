import * as afpl from 'afpl';
import * as Sync from './Map';
import * as Promise from 'bluebird';

/**
 * A map of key precondition pairs
 */
export interface Preconditions<A, B> {

    [key: string]: Precondition<A, B>

}

/**
 * Precondition
 *
 * The async version of the Precondition interface.
 */
export interface Precondition<A, B> {

    /**
     * apply this Precondition asynchronously.
     */
    apply(value: A): Result<A, B>

}

export type Result<A, B> = Promise<Sync.Result<A, B>>

/**
 * And
 */
export class And<A, B> implements Precondition<A, B> {

    constructor(public left: Precondition<A, A>, public right: Precondition<A, B>) { }

    apply(value: A): Result<A, B> {

        return this
            .left
            .apply(value).
            then(e => e.cata(Promise.resolve, v => this.right.apply(v)))

    }

}

export class Func<A, B> implements Precondition<A, B> {

    constructor(public f: (value: A) => Result<A, B>) { }

    apply(value: A): Result<A, B> {

        return this.f(value);

    }

}

export type Reports<A, B> = Promise<Sync.Reports<A, B>>

/**
 * Map for async preconditions
 */
export class Map<A, B> implements Precondition<Sync.Values<A>, Sync.Values<B>> {

  getConditions() : Preconditions<A,B> {

    return <any>this;

  }

    apply(value: Sync.Values<A>): Result<Sync.Values<A>, Sync.Values<B>> {

        let conditions = this.getConditions();

        let init: Reports<A, B> =
            Promise.resolve({ failures: {}, values: {} });

        let left = (key: string, { failures, values }: Sync.Reports<A, B>) =>
            (f: Sync.Failure<A>): Reports<A, B> => Promise.resolve({
                values,
                failures: afpl.util.merge<Sync.Failures<A>, Sync.Failures<A>>(failures, {
                    [key]: f
                })
            });

        let right = (key: string, { failures, values }: Sync.Reports<A, B>) =>
            (b: B): Reports<A, B> => Promise.resolve({
                values: afpl.util.merge<Sync.Values<B>, Sync.Values<B>>(values, {
                    [key]: b
                }), failures
            });

        if (typeof value !== 'object') {

            return Promise.resolve(Sync.mapFail<A, Sync.Values<B>>({}, value));

        } else {

            return afpl.util.reduce(conditions, (
                p: Reports<A, B>,
                condition: Precondition<A, B>,
                key: string) =>
                p.then((r: Sync.Reports<A, B>) =>
                    condition
                        .apply(value[key])
                        .then((e: Sync.Result<A, B>) =>
                            e.cata(left(key, r), right(key, r)))), init)
                .then((r: Sync.Reports<A, B>) => {

                    if (Object.keys(r.failures).length > 0)
                        return Promise.resolve(Sync.mapFail<A, Sync.Values<B>>(r.failures, value));
                    else
                        return Promise.resolve(Sync.valid<Sync.Values<A>, Sync.Values<B>>(r.values));

                });

        }
    }

}

/**
 * Hash is like Map except you specify the preconditions by passing
 * a plain old javascript object.
 */
export class Hash<A,B> extends Map<A,B> {

  constructor(private conditions: Preconditions<A,B>){ super() }

  getConditions():Preconditions<A,B> {

    return this.conditions;

  }
  
}

export const fail: <A, B>(m: string, v: A, ctx?: Sync.Context) =>
    Promise<afpl.Either<Sync.Failure<A>, B>> =
    <A, B>(message: string, value: A, ctx: Sync.Context = {}) =>
        Promise.resolve(Sync.fail<A, B>(message, value, ctx));

export const mapFail: <A, B>(e: Sync.Failures<A>, v: Sync.Values<A>, c?: Sync.Contexts) =>
    Promise<afpl.Either<Sync.MapFailure<A>, B>> =
    <A, B>(errors: Sync.Failures<A>, value: Sync.Values<A>, contexts: Sync.Contexts = {}) =>
        Promise.resolve(Sync.mapFail<A, B>(errors, value, contexts));

export const valid: <A, B>(b: B) => Promise<afpl.Either<Sync.Failure<A>, B>> =
    <A, B>(b: B) => Promise.resolve(Sync.valid<A, B>(b))

/**
 * func 
 */
export const func: <A, B>(f: (value: A) => Result<A, B>) => Precondition<A, B> =
    <A, B>(f: (value: A) => Result<A, B>) => new Func(f);

/**
 * or
 */
export const or: <A, B>(l: Precondition<A, B>, r: Precondition<A, B>) => Precondition<A, B> =
    <A, B>(left: Precondition<A, B>, right: Precondition<A, B>) =>
        func((value: A) => left.apply(value).then(e =>
            e.cata(() => right.apply(value), v => valid(v))))

/**
 * and
 */
export const and: <A, B>(l: Precondition<A, A>, r: Precondition<A, B>) => Precondition<A, B> =
    <A, B>(left: Precondition<A, A>, right: Precondition<A, B>) =>
        func((value: A) => left.apply(value).then(e =>
            e.cata<Result<A, B>>(
                (f: Sync.Failure<A>) => Promise.resolve(afpl.Either.left(f)),
                (v: A) => right.apply(v))));

/**
 * set 
 */
export const set: <A, B>(v: B) => Precondition<A, B> =
    <B>(v: B) => func((_a: any) => valid(v));


export const wrap = <A, B>(s: Sync.Precondition<A, B>) =>
    func((value: A) => s.apply(value).cata(Promise.resolve, Promise.resolve));
