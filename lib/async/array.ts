import { merge } from '@quenk/noni/lib/data/record';
import { Right } from '@quenk/noni/lib/data/either';
import { pure, parallel } from '@quenk/noni/lib/control/monad/future';
import { Precondition } from '../async';
import { fail } from '../result/failure/array';
import { Failure, Failures } from '../result/failure';
import { Result, succeed } from '../result';

type Reports<A, B> = [Failures<A>, B[]];

/**
 * filter (async).
 */
export const filter = <A, B>(p: Precondition<A, B>)
    : Precondition<A[], B[]> => (value: A[]) =>
        parallel(value.map(p))
    .map((r: Result<A, B>[]) => r.reduce<B[]>(filterResults, []))
            .chain((values: B[]) => pure(succeed<A[], B[]>(values)));

const filterResults = <A, B>(p: B[], c: Result<A, B>): B[] =>
    (c instanceof Right) ? p.concat(c.takeRight()) : p;

/**
 * map (async).
 */
export const map =
    <A, B>(p: Precondition<A, B>): Precondition<A[], B[]> => (value: A[]) =>
        parallel(value.map(p))
            .map(mapReduce)
            .map(mapFinish(value));

const mapReduce = <A, B>(r: Result<A, B>[]) =>
    r.reduce<Reports<A, B>>(mapReduceFold, [{}, []]);

const mapReduceFold = <A, B>([fails, succs]: Reports<A, B>,
    curr: Result<A, B>, idx: number): Reports<A, B> =>
    curr.fold(
        (f: Failure<A>): Reports<A, B> => [merge(fails, { [idx]: f }), succs],
        (b: B): Reports<A, B> => [fails, succs.concat(b)]);

const mapFinish = <A, B>(value: A[]) => ([fails, succs]: Reports<A, B>)
    : Result<A[], B[]> =>
    Object.keys(fails).length > 0 ?
        fail(fails, value, { value }) :
        succeed<A[], B[]>(succs);
