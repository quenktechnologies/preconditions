/**
 * Explanation of what went wrong with a Precondition.
 */
export declare type Explanation = string | object;
/**
 * Context of a failure.
 *
 * This is used when explaining Failures.
 */
export interface Context {
    [key: string]: any;
}
/**
 * ErrorTemplates used in explanations.
 */
export interface ErrorTemplates {
    [key: string]: string;
}
/**
 * Failure indicates a failure to satisfy a precondition.
 */
export declare class Failure<A> {
    message: string;
    value?: A;
    context: Context;
    constructor(message: string, value?: A, context?: Context);
    explain(templates?: ErrorTemplates, c?: Context): Explanation;
}
