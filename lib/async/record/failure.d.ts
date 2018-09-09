import * as Promise from 'bluebird';
import { Reports as SyncReports } from '../../record/failure';
import { Values } from '../../record';
/**
 * @private
 */
export declare type Reports<A, B> = Promise<SyncReports<A, B>>;
/**
 * @private
 */
export declare const review: <A extends Values<AB>, AB, B>(value: A) => (r: SyncReports<AB, AB>) => Promise<import("@quenk/noni/lib/data/either").Either<import("../failure").Failure<A>, B>>;
/**
 * @private
 */
export declare const reports: <A>() => Promise<SyncReports<A, A>>;
