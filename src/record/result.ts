import {left} from '@quenk/noni/lib/data/either';
import { success } from '../result';
import {Failures,Failure,Contexts} from './failure';
import { Values } from './';

/**
 * @private
 */
export interface Reports<M, V> {

    failures: Failures<M>

    values: Values<V>

}

/**
 * @private
 */
export const review = <A extends Values<AB>, AB, B>(reports: Reports<AB, AB>, value: A) =>
    (Object.keys(reports.failures).length > 0) ?
        failure<A, AB, B>(reports.failures, value, { value }) :
        success<A, B>(<B><any>reports.values);

/**
 * failure produces a new failure wrapped in the left side
 * of an Either from a map (object) of failures.
 */
export const failure =
    <A extends Values<V>, V, B>(errors: Failures<V>, value: A, contexts: Contexts) =>
        left<Failure<A, V>, B>(new Failure(errors, value, contexts));
