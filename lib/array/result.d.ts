import { Failure as F, Explanation, ErrorTemplates, Context } from '../result';
import { Contexts, Failures } from '../record/result';
/**
 * @private
 */
export interface Reports<M, V> {
    failures: Failures<M>;
    values: V[];
}
/**
 * Failure represents the failed results of applying
 * a precondition to one or more elements of an array.
 */
export declare class Failure<A> extends F<A[]> {
    failures: Failures<A>;
    value: A[];
    contexts: Contexts;
    constructor(failures: Failures<A>, value: A[], contexts?: Contexts);
    explain(templates?: ErrorTemplates, c?: Context): Explanation;
}
/**
 * @private
 */
export declare const review: <A, B>(value: A[], r: Reports<A, B>) => import("@quenk/noni/lib/data/either").Either<F<A[]>, B[]>;
/**
 * failure
 */
export declare const failure: <A, B>(errors: Failures<A>, value: A[], contexts: Contexts) => import("@quenk/noni/lib/data/either").Left<Failure<A>, B[]>;
