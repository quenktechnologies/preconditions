import { Precondition, Failure, success } from '../';
import { Contexts, Failures } from '../object';
import { ArrayFailure } from './ArrayFailure';
import { Either } from 'afpl/lib/monad/Either';
export { ArrayFailure, success };
export { Either };
/**
 * @private
 */
export interface Reports<M, V> {
    failures: Failures<M>;
    values: V[];
}
/**
 * failure
 */
export declare const failure: <A, B>(errors: Failures<A>, value: A[], contexts: Contexts) => Either<ArrayFailure<A>, B[]>;
export declare const onFailure: <A, B>(key: number, {failures, values}: Reports<A, B>) => (f: Failure<A>) => {
    values: B[];
    failures: {};
};
export declare const onSuccess: <A, B>({failures, values}: Reports<A, B>) => (b: B) => {
    failures: Failures<A>;
    values: B[];
};
/**
 * @private
 */
export declare const review: <A, B>(value: A[], r: Reports<A, B>) => Either<Failure<A[]>, B[]>;
/**
 * isArray tests if the value is an array
 */
export declare const isArray: Precondition<any, any[]>;
/**
 * notEmpty tests if an array has at least one member.
 */
export declare const notEmpty: <A>(value: A[]) => Either<Failure<A[]>, A[]>;
/**
 * range tests whether an array falls within a specific min and max range.
 */
export declare const range: <A>(min: number, max: number) => (value: A[]) => Either<Failure<A[]>, {}> | Either<Failure<{}>, A[]>;
/**
 * filter applies a precondition to each member of an array producing
 * an array where only the successful members are retained.
 *
 * @param <A> The type of the input object.
 * @param <B> The type of the final object.
 * @param p The precondition to apply to each member.
 */
export declare const filter: <A, B>(p: Precondition<A, B>) => Precondition<A[], B[]>;
/**
 * map applies a precondition to each member of an array.
 *
 * If the precondition fails for any of the members,
 * the entire array is considered a failure.
 * @param <A> The type of the input object.
 * @param <B> The type of the final object.
 * @param p The precondition to apply to each member.
 */
export declare const map: <A, B>(p: Precondition<A, B>) => Precondition<A[], B[]>;
