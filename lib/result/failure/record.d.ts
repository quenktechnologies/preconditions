import { Record } from '@quenk/noni/lib/data/record';
import { Result } from '../';
import { Failure, Failures, ErrorTemplates, Contexts, Context, Explanation } from './';
/**
 * RecordFailure contains information about a precondition that failed
 * when applied to an object.
 */
export declare class RecordFailure<A> implements Failure<Record<A>> {
    failures: Failures<A>;
    value: Record<A>;
    contexts: Contexts;
    constructor(failures: Failures<A>, value: Record<A>, contexts?: Contexts);
    message: string;
    get context(): Context;
    static create<A>(errs: Failures<A>, val: Record<A>, ctxs?: Contexts): RecordFailure<A>;
    explain(templates?: ErrorTemplates, c?: Context): Explanation;
    toError(templates?: ErrorTemplates, context?: Context): Error;
}
/**
 * fail constructs a new RecordFailure wrapped in the left part of a Result.
 */
export declare const fail: <A, B, R extends Record<B>>(failures: Failures<A>, value: Record<A>, ctx?: Contexts) => Result<Record<A>, R>;
