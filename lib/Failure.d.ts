import { Context, Explanation } from '.';
/**
 * Failure means a precondition did not go so well.
 */
export declare class Failure<A> {
    message: string;
    value: A;
    context: Context;
    constructor(message: string, value?: A, context?: Context);
    explain(templates?: {
        [key: string]: string;
    }, c?: Context): Explanation;
}
