import * as preconditions from '../failure';
import { merge, reduce } from '@quenk/noni/lib/data/record';
import {left} from '@quenk/noni/lib/data/either';
import { ErrorTemplates, Context, Explanation } from '../failure';
import {success} from '../result';
import { Values } from '.';

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

    values: Values<V>

}

/**
 * Failure contains information about a precondition that failed
 * when applied to an object.
 */
export class Failure<A extends Values<V>, V>
    extends preconditions.Failure<A> {

    constructor(
        public failures: Failures<V>,
        public value: A,
        public contexts: Contexts = {}) { super('object', value, contexts); }

    explain(templates: ErrorTemplates = {}, c: Context = {}): Explanation {

        return reduce(this.failures, {}, (o, f: preconditions.Failure<A>, $key) =>
            merge(o, {
                [$key]: f.explain(templates, merge(c, { $key }))
            }));

    }

}

/**
 * @private
 */
export const review = <A extends Values<AB>, AB, B>(reports: Reports<AB, AB>, value: A) =>
    (Object.keys(reports.failures).length > 0) ?
        failure<A, AB, B>(reports.failures, value, { value }) :
        success<A, B>(<B><any>reports.values);

/**
 * failure produces a new failure wrapped in the left side
 * of an Either from a map (object) of failures.
 */
export const failure =
    <A extends Values<V>, V, B>(errors: Failures<V>, value: A, contexts: Contexts) =>
        left<Failure<A, V>, B>(new Failure(errors, value, contexts));


