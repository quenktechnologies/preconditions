/**
 * Typep type.
 */
export declare type Type = any;
/**
 * Explanation of what went wrong with a Precondition.
 *
 * This can be a string for a single precondition or a Record
 * when multiple conditions have failed.
 */
export declare type Explanation = string | Explanations;
/**
 * Explanations map.
 */
export interface Explanations {
    [key: string]: Explanation;
}
/**
 * Contexts map.
 */
export interface Contexts {
    [key: string]: Context;
}
/**
 * Context of a Failure.
 *
 * This is used by Failure#explain() to provide more meaningful messages.
 */
export interface Context {
    [key: string]: Type;
}
/**
 * ErrorTemplates used in expand explanations.
 */
export interface ErrorTemplates {
    [key: string]: string;
}
/**
 * Failures map.
 */
export interface Failures<A> {
    [key: string]: Failure<A>;
}
/**
 * Failure is the class used to represent a failed precondition.
 */
export interface Failure<A> {
    /**
     * value that failed.
     */
    value?: A;
    /**
     * message associated with the Failure.
     */
    message: string;
    /**
     * context of the Failure.
     */
    context: Context;
    /**
     * explain converts a Failure into a user friendly Explanation.
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
    /**
     * toError provides an explanation of the Failure as an error.
     */
    toError(templates: ErrorTemplates, context: Context): Error;
}
/**
 * PrimFailure is the failure
 */
export declare class PrimFailure<A> {
    message: string;
    value?: A | undefined;
    context: Context;
    constructor(message: string, value?: A | undefined, context?: Context);
    static create<A>(message: string, value: A, ctx?: Context): PrimFailure<A>;
    explain(templates?: ErrorTemplates, ctx?: Context): string;
    toError(templates?: ErrorTemplates, context?: Context): Error;
}
/**
 * ModifiedFailure is used in situations where a precondition is composite
 * and we need to modify the value to be the original first one.
 */
export declare class ModifiedFailure<A, B> implements Failure<A> {
    value: A;
    previous: Failure<B>;
    constructor(value: A, previous: Failure<B>);
    readonly message: string;
    readonly context: Context;
    static create<A, B>(value: A, previous: Failure<B>): ModifiedFailure<A, B>;
    explain(templates?: ErrorTemplates, ctx?: Context): Explanation;
    toError(templates?: ErrorTemplates, context?: Context): Error;
}
export declare class DualFailure<A, B> implements Failure<A> {
    value: A;
    first: Failure<A>;
    second: Failure<B>;
    constructor(value: A, first: Failure<A>, second: Failure<B>);
    readonly message: string;
    readonly context: Context;
    explain(templates?: ErrorTemplates, ctx?: Context): Explanation;
    toError(templates?: ErrorTemplates, context?: Context): Error;
}
