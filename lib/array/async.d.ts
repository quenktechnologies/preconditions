import * as Promise from 'bluebird';
import * as sync from './';
import { Precondition, success } from '../async';
import { Contexts, Failures } from '../object';
import { ArrayFailure } from './ArrayFailure';
import { Either } from 'afpl/lib/monad/Either';
export { Either, success };
/**
 * @private
 */
export declare type Reports<M, V> = Promise<sync.Reports<M, V>>;
/**
 * failure
 */
export declare const failure: <A, B>(errors: Failures<A>, value: A[], contexts: Contexts) => Promise<Either<ArrayFailure<A>, B[]>>;
/**
 * filter (async version).
 */
export declare const filter: <A, B>(p: Precondition<A, B>) => Precondition<A[], B[]>;
/**
 * map (async version).
 */
export declare const map: <A, B>(p: Precondition<A, B>) => Precondition<A[], B[]>;
