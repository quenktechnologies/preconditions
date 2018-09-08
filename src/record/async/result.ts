import * as Promise from 'bluebird';
import { Result } from '../../async/result';
import { Reports as SyncReports, failure } from '../result';
import { success } from '../../result';
import { Values } from '../';

/**
 * @private
 */
export type Reports<A, B> = Promise<SyncReports<A, B>>

/**
 * @private
 */
export const review = <A extends Values<AB>, AB, B>(value: A) =>
    (r: SyncReports<AB, AB>): Result<A, B> =>
        (Object.keys(r.failures).length > 0) ?
            Promise.resolve(failure<A, AB, B>(r.failures, value, {})) :
            Promise.resolve(success<A, B>(<B><any>r.values));

/**
 * @private
 */
export const reports = <A>(): Reports<A, A> =>
    Promise.resolve({ failures: {}, values: {} });
