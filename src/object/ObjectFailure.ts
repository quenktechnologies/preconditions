import * as util from 'afpl/lib/util';
import { Failure, Context, Explanation } from '../';
import { Failures, Values, Contexts } from '.';

/**
 * ObjectFailure contains information about a precondition that failed
 * when applied to an object.
 */
export class ObjectFailure<A extends Values<V>, V> extends Failure<A> {

    constructor(
        public failures: Failures<V>,
        public value: A,
        public contexts: Contexts = {}) { super('object', value, contexts); }

    explain(templates: { [key: string]: string } = {}, c: Context = {}): Explanation {

        return util.reduce(this.failures, (o, f, $key) =>
            util.merge(o, {
                [$key]: f.explain(templates, util.merge(c, { $key }))
            }), {});

    }

}
