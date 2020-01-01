import { Either } from '@quenk/noni/lib/data/either';
import { Context, Failure } from './failure';
/**
 * Result of a precondition type.
 *
 * A precondition either fails or provides a new value.
 */
export declare type Result<A, B> = Either<Failure<A>, B>;
/**
 * fail constructs a new failed Result using the parameters supplied to
 * create a new Failure instance.
 */
export declare const fail: <A, B>(msg: string, value: A, ctx?: Context) => Result<A, B>;
/**
 * succeed constructs a successful Result wraping the final version
 * of the value in the right side of an Either.
 */
export declare const succeed: <A, B>(b: B) => Result<A, B>;
