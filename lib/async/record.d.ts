import { Record } from '@quenk/noni/lib/data/record';
import { Precondition, Preconditions } from './';
/**
 * restrict (async version).
 */
export declare const restrict: <A, AR extends Record<A>, B, BR extends Record<B>>(conditions: Preconditions<A, B>) => Precondition<AR, BR>;
/**
 * disjoint (async version).
 */
export declare const disjoint: <A, AR extends Record<A>, B, BR extends Record<B>>(conditions: Preconditions<A, B>) => Precondition<AR, BR>;
/**
 * intersect (async version).
 */
export declare const intersect: <A, AR extends Record<A>, B, BR extends Record<B>>(conditions: Preconditions<A, B>) => Precondition<AR, BR>;
/**
 * union (async version).
 */
export declare const union: <A, AR extends Record<A>, B, BR extends Record<B>>(conditions: Preconditions<A, B>) => Precondition<AR, BR>;
/**
 * map (async version).
 */
export declare const map: <A, AR extends Record<A>, B, BR extends Record<B>>(condition: Precondition<A, B>) => Precondition<AR, BR>;
