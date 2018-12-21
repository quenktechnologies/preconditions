import { Record } from '@quenk/noni/lib/data/record';
import { Failure, Failures, ErrorTemplates, Contexts, Context, Explanation } from './';
/**
 * RecordFailure contains information about a precondition that failed
 * when applied to an object.
 */
export declare class RecordFailure<A, AR extends Record<A>> implements Failure<AR> {
    failures: Failures<A>;
    value: AR;
    contexts: Contexts;
    constructor(failures: Failures<A>, value: AR, contexts?: Contexts);
    message: string;
    readonly context: Context;
    static create<A, AR extends Record<A>>(errs: Failures<A>, val: AR, ctxs?: Contexts): RecordFailure<A, AR>;
    explain(templates?: ErrorTemplates, c?: Context): Explanation;
    toError(templates?: ErrorTemplates, context?: Context): Error;
}
/**
 * fail constructs a new RecordFailure wrapped in the left part of a Result.
 */
export declare const fail: <A, AR extends Record<A>, B, BR extends Record<B>>(failures: Failures<A>, value: AR, ctx?: Contexts) => import("@quenk/noni/lib/data/either").Either<Failure<AR>, BR>;
