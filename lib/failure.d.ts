import { Record } from '@quenk/noni/lib/data/record';
/**
 * Explanation of what went wrong with a Precondition.
 *
 * This can be a string for a single precondition or a Record
 * when multiple conditions have failed.
 */
export declare type Explanation = string | Record<string>;
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
 * Failure is the class used to represent a failed precondition.
 */
export declare class Failure<A> {
    message: string;
    value?: A | undefined;
    context: Context;
    constructor(message: string, value?: A | undefined, context?: Context);
    /**
     * explain converts a Failure into an explanation.
     *
     * Explanations can be expanded by providing a hash of ErrorTemplates
     * and a Context.
     *
     * This function looks up the appropriate template to use and expand in
     * the following order:
     * 1. `${context.$key}.${this.message}`
     * 2. `${key}`
     * 3. `${this.message}`
     *
     * If all these fail the message value is used.
     */
    explain(templates?: ErrorTemplates, context?: Context): Explanation;
}
