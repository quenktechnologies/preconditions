import * as util from 'afpl/lib/util';
import * as polate from '@quenk/polate';
import {Context, Explanation} from '.';

/**
 * Failure means a precondition did not go so well.
 */
export class Failure<A> {

    constructor(public message: string, public value?: A, public context: Context = {}) { }

    explain(templates: { [key: string]: string } = {}, c: Context = {}): Explanation {

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
                            this.message), util.merge(this.context, c, { $value }));

    }

}
