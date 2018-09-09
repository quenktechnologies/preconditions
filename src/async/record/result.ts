import * as Promise from 'bluebird';
import {Record} from '@quenk/noni/lib/data/record';
import { Reports as SyncReports, failure } from '../../record/result';
import { success } from '../../result';
import { Result } from '../result';

/**
 * @private
 */
export type Reports<A, B> = Promise<SyncReports<A, B>>;

/**
 * @private
 */
export const review = <A extends Record<AB>, AB, B>(value: A) =>
    (r: SyncReports<AB, AB>): Result<A, B> =>
        (Object.keys(r.failures).length > 0) ?
            Promise.resolve(failure<A, AB, B>(r.failures, value, {})) :
            Promise.resolve(success<A, B>(<B><any>r.values));

/**
 * @private
 */
export const reports = <A>(): Reports<A, A> =>
    Promise.resolve({ failures: {}, values: {} });
