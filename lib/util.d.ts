import { Precondition } from './';
/**
 * combineKeys the keys of two objects into an array.
 */
export declare const combineKeys: (o1: object, o2: object) => string[];
/**
 * unwrap applies a precondition received from a function.
 */
export declare const unwrap: <A, B>(p: () => Precondition<A, B>) => (value: A) => import("@quenk/noni/lib/data/either").Either<import("../failure").Failure<A>, B>;
