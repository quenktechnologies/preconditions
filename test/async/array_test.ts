import { assert } from '@quenk/test/lib/assert';
import { toPromise, pure } from '@quenk/noni/lib/control/monad/future';
import { filter, map, tuple } from '../../src/async/array';
import { succeed, fail } from '../../src/result';

const num = <A>(n: A) => (typeof n === 'number') ?
    pure(succeed<A, number>(n)) : pure(fail<A, number>('num', n, {}));

const string = <A>(n: A) => (typeof n === 'string') ?
    pure(succeed(n)) : pure(fail('string', n, {}));

const invalidList = [0, 1, 2, 3, 'four', 5, 'six', 7, 'eight', 9];

const validList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

describe('async', function() {

    describe('filter', function() {

        it('should retain succesful members', function() {

            toPromise((filter(num)(invalidList)))
                .then(e => assert(e.takeRight())
                    .equate([0, 1, 2, 3, 5, 7, 9]))

        });

    });

    describe('map', function() {

        it('should fail if any member fails', function() {

            toPromise(map(num)(invalidList))
                .then(e => assert(e.takeLeft().explain())
                    .equate({ 4: 'num', 6: 'num', 8: 'num' }));

        });

        it('should work otherwise', function() {

            toPromise(map(num)(validList))
                .then(e => assert(e.takeRight())
                    .equate([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));

        });

    });

    describe('tuple', () => {

        const checks = [num, string, num];

        it('should pass when valid', () => {

            let value = [1, 'two', 3];

            return toPromise((tuple(checks)(value)))
                .then(result => {

                    let ret = result.takeRight()

                    assert(ret).equate([1, 'two', 3]);

                });

        });

        it('should fail when invalid', () => {

            let value = [1, 2, 3];

            return toPromise((tuple(checks)(value)))
                .then(result => {

                    let ret = result.isLeft();

                    assert(ret).true();

                });

        });

    });

});
