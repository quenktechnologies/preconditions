import { Failure, Context, Explanation } from '..';
import { Failures, Contexts } from '../object';
/**
 * ArrayFailure represents the failed results of applying
 * a precondition to one or more elements of an array.
 */
export declare class ArrayFailure<A> extends Failure<A[]> {
    failures: Failures<A>;
    value: A[];
    contexts: Contexts;
    constructor(failures: Failures<A>, value: A[], contexts?: Contexts);
    explain(templates?: {
        [key: string]: string;
    }, c?: Context): Explanation;
}
