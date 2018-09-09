import * as preconditions from '../result';
import { Record, merge, reduce } from '@quenk/noni/lib/data/record';
import { left } from '@quenk/noni/lib/data/either';
import { Failure as F, ErrorTemplates, Context, Explanation } from '../result';
import { success } from '../result';

/**
 * Failures is a map of Failures.
 */
export interface Failures<A> {

    [key: string]: preconditions.Failure<A>

}

/**
 * Contexts is a map of Contexts.
 */
export interface Contexts {

    [key: string]: Context

}

/**
 * @private
 */
export interface Reports<M, V> {

    failures: Failures<M>

    values: Record<V>

}

/**
 * Failure contains information about a precondition that failed
 * when applied to an object.
 */
export class Failure<A extends Record<V>, V>
    extends preconditions.Failure<A> {

    constructor(
        public failures: Failures<V>,
        public value: A,
        public contexts: Contexts = {}) { super('object', value, contexts); }

    explain(templates: ErrorTemplates = {}, c: Context = {}): Explanation {

        return reduce(this.failures, {},
            (o: { [key: string]: string | object }, f: F<V>, $key: string) =>
                merge(o, {
                    [$key]: f.explain(templates, merge(c, { $key }))
                }));

    }

}

/**
 * @private
 */
export const review = <A extends Record<AB>, AB, B>(reports: Reports<AB, AB>, value: A) =>
    (Object.keys(reports.failures).length > 0) ?
        failure<A, AB, B>(reports.failures, value, { value }) :
        success<A, B>(<B><any>reports.values);

/**
 * failure produces a new failure wrapped in the left side
 * of an Either from a map (object) of failures.
 */
export const failure =
    <A extends Record<V>, V, B>(errors: Failures<V>, value: A, contexts: Contexts) =>
        left<Failure<A, V>, B>(new Failure(errors, value, contexts));


