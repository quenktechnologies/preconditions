import { Precondition } from '../';
import { Failure } from '../failure';
import { Reports } from './failure';
/**
 * isArray tests if the value is an array
 */
export declare const isArray: Precondition<any, any[]>;
/**
 * notEmpty tests if an array has at least one member.
 */
export declare const notEmpty: <A>(value: A[]) => import("@quenk/noni/lib/data/either").Either<Failure<A[]>, A[]>;
/**
 * range tests whether an array falls within a specific min and max range.
 */
export declare const range: <A>(min: number, max: number) => (value: A[]) => import("@quenk/noni/lib/data/either").Either<Failure<A[]>, {}> | import("@quenk/noni/lib/data/either").Either<Failure<{}>, A[]>;
/**
 * filter applies a precondition to each member of an array producing
 * an array where only the successful members are kept.
 */
export declare const filter: <A, B>(p: Precondition<A, B>) => Precondition<A[], B[]>;
/**
 * map applies a precondition to each member of an array.
 *
 * If the precondition fails for any of the members,
 * the entire array is considered a failure.
 */
export declare const map: <A, B>(p: Precondition<A, B>) => Precondition<A[], B[]>;
export declare const onFailure: <A, B>(key: number, { failures, values }: Reports<A, B>) => (f: Failure<A>) => Reports<A, B>;
export declare const onSuccess: <A, B>({ failures, values }: Reports<A, B>) => (b: B) => Reports<A, B>;
