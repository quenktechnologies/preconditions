import * as polate from '@quenk/polate';
import { merge } from '@quenk/noni/lib/data/record';

/**
 * Explanation of what went wrong with a Precondition.
 */
export type Explanation
    = string
    | object
    ;

/**
 * Context of a failure.
 *
 * This is used when explaining Failures.
 */
export interface Context {

    [key: string]: any

}

/**
 * ErrorTemplates used in explanations.
 */
export interface ErrorTemplates {

    [key: string]: string

}


/**
 * Failure indicates a failure to satisfy a precondition.
 */
export class Failure<A> {

    constructor(
        public message: string,
        public value?: A,
        public context: Context = {}) { }

    explain(templates: ErrorTemplates = {}, c: Context = {}): Explanation {

        let combined = (typeof c['$key'] === 'string') ?
            `${c.$key}.${this.message}` :
            this.message;
        let key = c.$key;
        let $value = this.value;

        //@todo: fix stairway to hell
        return polate.polate(
            ((templates[combined]) ?
                templates[combined] :
                (templates[<string>key]) ?
                    templates[<string>key] :
                    (templates[this.message.split('.')[0]]) ?
                        templates[this.message.split('.')[0]] :
                        (templates[this.message]) ?
                            templates[this.message] :
                            this.message), merge(merge(this.context, c), { $value }));

    }

}
