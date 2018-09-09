import { Either } from '@quenk/noni/lib/data/either';
import { Context, Failure } from './failure';
/**
 * Result of a precondition (alias).
 */
export declare type Result<A, B> = Either<Failure<A>, B>;
/**
 * failure constructs a failed Result using the parameters supplied to
 * create a new Failure instance.
 */
export declare const failure: <A, B>(message: string, value: A, ctx?: Context) => Either<Failure<A>, B>;
/**
 * success constructs a successful Result wraping the final version
 * of the value in the right side of an Either.
 */
export declare const success: <A, B>(b: B) => Either<Failure<A>, B>;
