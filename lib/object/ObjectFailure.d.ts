import { Failure, Context, Explanation } from '../';
import { Failures, Values, Contexts } from '.';
/**
 * ObjectFailure contains information about a precondition that failed
 * when applied to an object.
 */
export declare class ObjectFailure<A extends Values<V>, V> extends Failure<A> {
    failures: Failures<V>;
    value: A;
    contexts: Contexts;
    constructor(failures: Failures<V>, value: A, contexts?: Contexts);
    explain(templates?: {
        [key: string]: string;
    }, c?: Context): Explanation;
}
