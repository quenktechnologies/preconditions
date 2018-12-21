import { Failure, Failures, Context, Contexts, Explanation, ErrorTemplates } from './';
/**
 * ArrayFailure represents the failed results of applying
 * a precondition to one or more elements of an array.
 */
export declare class ArrayFailure<A> implements Failure<A[]> {
    failures: Failures<A>;
    value: A[];
    contexts: Contexts;
    constructor(failures: Failures<A>, value: A[], contexts?: Contexts);
    message: string;
    readonly context: Context;
    static create<A>(errs: Failures<A>, val: A[], ctx: Contexts): ArrayFailure<A>;
    explain(templates?: ErrorTemplates, c?: Context): Explanation;
}
/**
 * fail constructs a new ArrayFailure wrapped in the left part of a Result.
 */
export declare const fail: <A, B>(fails: Failures<A>, val: A[], ctx?: Context) => import("@quenk/noni/lib/data/either").Either<Failure<A[]>, B[]>;
