import { Either, left, right } from '@quenk/noni/lib/data/either';
import { Context, Failure } from './failure';

/**
 * Result of a precondition (alias).
 */
export type Result<A, B> = Either<Failure<A>, B>;

/**
 * failure constructs a failed Result using the parameters supplied to
 * create a new Failure instance.
 */
export const failure =
    <A, B>(message: string, value: A, ctx: Context = {}): Result<A, B> =>
        left<Failure<A>, B>(new Failure(message, value, ctx));

/**
 * success constructs a successful Result wraping the final version
 * of the value in the right side of an Either.
 */
export const success = <A, B>(b: B) : Result<A,B>  => right<Failure<A>, B>(b);
