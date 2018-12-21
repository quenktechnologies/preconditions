import { Either, left, right } from '@quenk/noni/lib/data/either';
import { Context, Failure, PrimFailure } from './failure';

/**
 * Result of a precondition type.
 *
 * A precondition either fails or provides a new value.
 */
export type Result<A, B> = Either<Failure<A>, B>;

/**
 * fail constructs a new failed Result using the parameters supplied to
 * create a new Failure instance.
 */
export const fail = <A, B>(msg: string, value: A, ctx: Context = {})
    : Result<A, B> =>
    left<Failure<A>, B>(PrimFailure.create(msg, value, ctx));

/**
 * succeed constructs a successful Result wraping the final version
 * of the value in the right side of an Either.
 */
export const succeed = <A, B>(b: B): Result<A, B> =>
    right<Failure<A>, B>(b);

