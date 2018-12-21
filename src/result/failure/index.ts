import { polate } from '@quenk/polate';
import { merge } from '@quenk/noni/lib/data/record';

/**
 * Typep type.
 */
export type Type = any;

/**
 * Explanation of what went wrong with a Precondition.
 *
 * This can be a string for a single precondition or a Record
 * when multiple conditions have failed.
 */
export type Explanation
    = string
    | Explanations
    ;

/**
 * Explanations map.
 */
export interface Explanations {

    [key: string]: Explanation

}

/**
 * Contexts map.
 */
export interface Contexts {

    [key: string]: Context

}

/**
 * Context of a Failure.
 *
 * This is used by Failure#explain() to provide more meaningful messages.
 */
export interface Context {

    [key: string]: Type

}

/**
 * ErrorTemplates used in expand explanations.
 */
export interface ErrorTemplates {

    [key: string]: string

}

/**
 * Failures map. 
 */
export interface Failures<A> {

    [key: string]: Failure<A>

}

/**
 * Failure is the class used to represent a failed precondition.
 */
export interface Failure<A> {

    /**
     * value that failed.
     */
    value?: A,

    /**
     * message associated with the Failure.
     */
    message: string,

    /**
     * context of the Failure.
     */
    context: Context,

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
export class PrimFailure<A> {

    constructor(
        public message: string,
        public value?: A,
        public context: Context = {}) { }

    static create<A>(message: string, value: A, ctx: Context = {}): PrimFailure<A> {

        return new PrimFailure(message, value, ctx);

    }

    explain(templates: ErrorTemplates = {}, ctx: Context = {}): string {

        let context = merge(this.context, ctx);
        let key = context.$key;
        let $value = this.value;
        let split = templates[this.message.split('.')[0]];
        let str = this.message;

        let combined = (typeof context['$key'] === 'string') ?
            `${context.$key}.${this.message}` :
            this.message;

        if (templates[combined]) {

            str = templates[combined];

        } else if (templates[key]) {

            str = templates[key];

        } else if (templates[split]) {

            str = templates[split];

        } else if (templates[this.message]) {

            str = templates[this.message];

        }

        return polate(str, merge(context, <Context>{ $value }));

    }

    toError(templates: ErrorTemplates = {}, context: Context = {}): Error {

        return new Error(this.explain(templates, context));

    }

}

/**
 * ModifiedFailure is used in situations where a precondition is composite
 * and we need to modify the value to be the original first one.
 */
export class ModifiedFailure<A, B> implements Failure<A> {

    constructor(public value: A, public previous: Failure<B>) { }

    get message(): string {

        return this.previous.message;

    }

    get context(): Context {

        return this.previous.context;

    }

    static create<A, B>(value: A, previous: Failure<B>): ModifiedFailure<A, B> {

        return new ModifiedFailure<A, B>(value, previous);

    }

    explain(templates: ErrorTemplates = {}, ctx: Context = {}): Explanation {

        return this.previous.explain(templates, merge(ctx, { value: this.value }));

    }

      toError(templates: ErrorTemplates = {}, context: Context = {}): Error {

                let e = this.explain(templates, context);

                return new Error((typeof e === 'object') ? JSON.stringify(e) : e);

            }

}
