import * as Promise from 'bluebird';
import { Reports as SyncReports } from '../array/result';
import { Contexts, Failures } from '../record/result';
import { Failure } from '../array/result';
import { Precondition } from '../async';
/**
 * @private
 */
export declare type Reports<M, V> = Promise<SyncReports<M, V>>;
/**
 * failure
 */
export declare const failure: <A, B>(errors: Failures<A>, value: A[], contexts: Contexts) => Promise<import("@quenk/noni/lib/data/either").Left<Failure<A>, B[]>>;
/**
 * filter (async version).
 */
export declare const filter: <A, B>(p: Precondition<A, B>) => Precondition<A[], B[]>;
/**
 * map (async version).
 */
export declare const map: <A, B>(p: Precondition<A, B>) => Precondition<A[], B[]>;
