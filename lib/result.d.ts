import { Record } from '@quenk/noni/lib/data/record';
import { Either } from '@quenk/noni/lib/data/either';
/**
 * Result of a precondition (alias).
 */
export declare type Result<A, B> = Either<Failure<A>, B>;
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
/**
 * failure constructs a failed Result using the parameters supplied to
 * create a new Failure instance.
 */
export declare const failure: <A, B>(message: string, value: A, ctx?: Context) => Either<Failure<A>, B>;
/**
 * success constructs a successful Result wraping the final version
 * of the value in the right side of an Either.
 */
export declare const success: <A, B>(b: B) => Either<Failure<A>, B>;
