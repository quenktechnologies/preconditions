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
export class RecordFailure<A> implements Failure<Record<A>> {
    constructor(
        public failures: Failures<A>,
        public value: Record<A>,
        public contexts: Contexts = {}
    ) {}

    message = 'object';

    get context(): Context {
        return this.contexts;
    }

    static create<A>(
        errs: Failures<A>,
        val: Record<A>,
        ctxs: Contexts = {}
    ): RecordFailure<A> {
        return new RecordFailure<A>(errs, val, ctxs);
    }

    explain(templates: ErrorTemplates = {}, c: Context = {}): Explanation {
        return reduce(
            this.failures,
            {},
            (o: Explanations, f: Failure<A>, $key: string) =>
                merge(o, {
                    [$key]: f.explain(templates, merge(c, { $key }))
                })
        );
    }

    toError(templates: ErrorTemplates = {}, context: Context = {}): Error {
        let e = this.explain(templates, context);

        return new Error(typeof e === 'object' ? JSON.stringify(e) : e);
    }
}

/**
 * fail constructs a new RecordFailure wrapped in the left part of a Result.
 */
export const fail = <A, B, R extends Record<B>>(
    failures: Failures<A>,
    value: Record<A>,
    ctx: Contexts = {}
): Result<Record<A>, R> =>
    left<Failure<Record<A>>, R>(RecordFailure.create(failures, value, ctx));
