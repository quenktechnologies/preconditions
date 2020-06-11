import { Record } from '@quenk/noni/lib/data/record';
import { Precondition, Preconditions } from './';
/**
 * restrict (async version).
 */
export declare const restrict: <A, B, R extends Record<B>>(tests: Preconditions<A, B>) => Precondition<Record<A>, R>;
/**
 * disjoint (async version).
 */
export declare const disjoint: <A, B, R extends Record<B>>(tests: Preconditions<A, B>) => Precondition<Record<A>, R>;
/**
 * intersect (async version).
 */
export declare const intersect: <A, B, R extends Record<B>>(tests: Preconditions<A, B>) => Precondition<Record<A>, R>;
/**
 * union (async version).
 */
export declare const union: <A, B, R extends Record<B>>(tests: Preconditions<A, B>) => Precondition<Record<A>, R>;
/**
 * map (async version).
 */
export declare const map: <A, B, R extends Record<B>>(test: Precondition<A, B>) => Precondition<Record<A>, R>;
