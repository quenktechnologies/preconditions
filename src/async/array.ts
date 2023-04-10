import { Right, left } from '@quenk/noni/lib/data/either';
import { pure, parallel, Future } from '@quenk/noni/lib/control/monad/future';
import { Precondition } from '../async';
import { ArrayFailure } from '../result/failure/array';
import { Failure, Failures } from '../result/failure';
import { Result, succeed, fail as failure } from '../result';

/**
 * filter (async).
 */
export const filter =
    <A, B>(p: Precondition<A, B>): Precondition<A[], B[]> =>
    (value: A[]) =>
        parallel(value.map(p))
            .map((r: Result<A, B>[]) => r.reduce<B[]>(filterResults, []))
            .chain((values: B[]) => pure(succeed<A[], B[]>(values)));

const filterResults = <A, B>(p: B[], c: Result<A, B>): B[] =>
    c instanceof Right ? p.concat(c.takeRight()) : p;

/**
 * map (async).
 */
export const map =
    <A, B>(p: Precondition<A, B>): Precondition<A[], B[]> =>
    (value: A[]) =>
        Future.do(async () => {
            let failed = 0;
            let failures: Failures<A> = {};
            let values = [];
            for (let i = 0; i < value.length; i++) {
                let result = await p(value[i]);
                if (result.isLeft()) {
                    failed++;
                    failures[i] = result.takeLeft();
                } else {
                    values[i] = result.takeRight();
                }
            }
            return failed === 0
                ? succeed<A[], B[]>(values)
                : left(ArrayFailure.create(failures, value, { value }));
        });

/**
 * tuple (async)
 */
export const tuple =
    <A, B>(list: Precondition<A, B>[]): Precondition<A[], B[]> =>
    (value: A[]) => {
        if (value.length !== list.length)
            return pure(failure<A[], B[]>('tuple', value));

        return parallel(value.map((v, idx) => list[idx](v))).chain(results => {
            let fails = results.filter(v => v.isLeft()).map(e => e.takeLeft());

            if (fails.length > 0) {
                let failMap = fails.reduce((p, c, k) => {
                    p[k] = c;
                    return p;
                }, <Failures<A>>{});

                return pure(
                    left<Failure<A[]>, B[]>(
                        ArrayFailure.create(failMap, value, { value })
                    )
                );
            }

            return pure(succeed<A[], B[]>(results.map(e => e.takeRight())));
        });
    };
