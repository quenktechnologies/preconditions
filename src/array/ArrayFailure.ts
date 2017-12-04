import * as util from 'afpl/lib/util';
import { Failure, Context, Explanation } from '..';
import { Failures, Contexts } from '../object';

/**
 * ArrayFailure represents the failed results of applying
 * a precondition to one or more elements of an array.
 */
export class ArrayFailure<A> extends Failure<A[]> {

    constructor(
        public failures: Failures<A>,
        public value: A[],
        public contexts: Contexts = {}) { super('list', value, contexts); }

    explain(templates: { [key: string]: string } = {}, c: Context = {}): Explanation {

        return util.reduce(this.failures, ((o, f, $index) =>
            util.merge(o, {
                [$index]: f.explain(templates, util.merge(c, { $index }))
            })), {});

    }

}

