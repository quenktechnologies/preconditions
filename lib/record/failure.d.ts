import * as preconditions from '../failure';
import { ErrorTemplates, Context, Explanation } from '../failure';
import { Values } from '.';
/**
 * Failures is a map of Failures.
 */
export interface Failures<A> {
    [key: string]: preconditions.Failure<A>;
}
/**
 * Contexts is a map of Contexts.
 */
export interface Contexts {
    [key: string]: Context;
}
/**
 * @private
 */
export interface Reports<M, V> {
    failures: Failures<M>;
    values: Values<V>;
}
/**
 * Failure contains information about a precondition that failed
 * when applied to an object.
 */
export declare class Failure<A extends Values<V>, V> extends preconditions.Failure<A> {
    failures: Failures<V>;
    value: A;
    contexts: Contexts;
    constructor(failures: Failures<V>, value: A, contexts?: Contexts);
    explain(templates?: ErrorTemplates, c?: Context): Explanation;
}
/**
 * @private
 */
export declare const review: <A extends Values<AB>, AB, B>(reports: Reports<AB, AB>, value: A) => import("@quenk/noni/lib/data/either").Either<preconditions.Failure<A>, B>;
/**
 * failure produces a new failure wrapped in the left side
 * of an Either from a map (object) of failures.
 */
export declare const failure: <A extends Values<V>, V, B>(errors: Failures<V>, value: A, contexts: Contexts) => import("@quenk/noni/lib/data/either").Left<Failure<A, V>, B>;
