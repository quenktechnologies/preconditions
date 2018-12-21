import { Record, reduce, merge } from '@quenk/noni/lib/data/record';
import { left } from '@quenk/noni/lib/data/either';
import { Result } from '../';
import {
    Failure,
    Failures,
    ErrorTemplates,
    Contexts,
    Context,
    Explanations,
    Explanation
} from './';

/**
 * RecordFailure contains information about a precondition that failed
 * when applied to an object.
 */
export class RecordFailure<A, AR extends Record<A>> implements Failure<AR> {

    constructor(
        public failures: Failures<A>,
        public value: AR,
        public contexts: Contexts = {}) { }

    message = 'object';

  get context() : Context {

    return this.contexts;

  }

    static create<A, AR extends Record<A>>(
        errs: Failures<A>,
        val: AR,
        ctxs: Contexts = {}): RecordFailure<A, AR> {

        return new RecordFailure<A, AR>(errs, val, ctxs);

    }

    explain(templates: ErrorTemplates = {}, c: Context = {}): Explanation {

        return reduce(this.failures, {},
            (o: Explanations, f: Failure<A>, $key: string) =>
                merge(o, {
                    [$key]: f.explain(templates, merge(c, { $key }))
                }));

    }

}

/**
 * fail constructs a new RecordFailure wrapped in the left part of a Result.
 */
export const fail = <A, AR extends Record<A>, B, BR extends Record<B>>
    (failures: Failures<A>, value: AR, ctx: Contexts = {})
    : Result<AR, BR> =>
    left<Failure<AR>, BR>(RecordFailure.create<A, AR>(failures, value, ctx)); 
