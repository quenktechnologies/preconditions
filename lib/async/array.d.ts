import { Precondition } from '../async';
/**
 * filter (async).
 */
export declare const filter: <A, B>(p: Precondition<A, B>) => Precondition<A[], B[]>;
/**
 * map (async).
 */
export declare const map: <A, B>(p: Precondition<A, B>) => Precondition<A[], B[]>;
