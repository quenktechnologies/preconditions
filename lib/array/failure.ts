import { left } from '@quenk/noni/lib/data/either';
import { reduce, merge } from '@quenk/noni/lib/data/record';
import { Failure as F, Explanation, ErrorTemplates, Context } from '../failure';
import { success } from '../failure';
import { Contexts, Failures } from '../record/failure';

/**
 * @private
 */
export interface Reports<M, V> {

    failures: Failures<M>,

    values: V[]

}

/**
 * Failure represents the failed results of applying
 * a precondition to one or more elements of an array.
 */
export class Failure<A> extends F<A[]> {

    constructor(
        public failures: Failures<A>,
        public value: A[],
        public contexts: Contexts = {}) { super('list', value, contexts); }

    explain(templates: ErrorTemplates = {}, c: Context = {}): Explanation {

        return reduce(this.failures, {},
            (p: { [key: string]: string | object }, f: F<A>, $index: string) => merge(p, {
                [$index]: f.explain(templates, merge(c, { $index }))
            }));

    }

}

/**
 * @private
 */
export const review = <A, B>(value: A[], r: Reports<A, B>) =>
    (Object.keys(r.failures).length > 0) ?
        failure<A, B>(r.failures, value, { value }) :
        success<A[], B[]>(r.values);

/**
 * failure
 */
export const failure =
    <A, B>(errors: Failures<A>, value: A[], contexts: Contexts) =>
        left<Failure<A>, B[]>(new Failure(errors, value, contexts));
