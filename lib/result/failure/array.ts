import { reduce, merge } from '@quenk/noni/lib/data/record';
import { left } from '@quenk/noni/lib/data/either';
import { Result } from '../';
import {
    Failure,
    Failures,
    Context,
    Contexts,
    Explanations,
    Explanation,
    ErrorTemplates
} from './';

/**
 * ArrayFailure represents the failed results of applying
 * a precondition to one or more elements of an array.
 */
export class ArrayFailure<A> implements Failure<A[]> {

    constructor(
        public failures: Failures<A>,
        public value: A[],
        public contexts: Contexts = {}) { }

    message = 'array';

    get context(): Context {

        return this.contexts;

    }

    static create<A>(errs: Failures<A>, val: A[], ctx: Contexts): ArrayFailure<A> {

        return new ArrayFailure(errs, val, ctx);

    }

    explain(templates: ErrorTemplates = {}, c: Context = {}): Explanation {

        return reduce(this.failures, {},
            (p: Explanations, f: Failure<A>, $index: string) => merge(p, {
                [$index]: f.explain(templates, merge(c, { $index }))
            }));

    }

    toError(templates: ErrorTemplates = {}, context: Context = {}): Error {

        let e = this.explain(templates, context);

        return new Error((typeof e === 'object') ? JSON.stringify(e) : e);

    }

}

/**
 * fail constructs a new ArrayFailure wrapped in the left part of a Result.
 */
export const fail = <A, B>(fails: Failures<A>, val: A[], ctx: Context = {})
    : Result<A[], B[]> =>
    left<Failure<A[]>, B[]>(ArrayFailure.create(fails, val, ctx));
