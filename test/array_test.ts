import { assert } from '@quenk/test/lib/assert';
import { notEmpty, isArray, filter, map, range, tuple } from '../src/array';
import { succeed, fail } from '../src/result';

const num = <A>(n: A) =>
    typeof n === 'number' ? succeed<A, number>(n) : fail<A, number>('num', n);

const string = <A>(n: A) =>
    typeof n === 'string' ? succeed(n) : fail('string', n);

const invalidList = [0, 1, 2, 3, 'four', 5, 'six', 7, 'eight', 9];

const validList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

describe('array', () => {
    describe('notEmpty', () => {
        it('should work with arrays', () => {
            assert(notEmpty([]).takeLeft().explain()).equal('notEmpty');
            assert(notEmpty([1]).takeRight()).equate([1]);
        });
    });

    describe('isArray', () => {
        it('should work', () => {
            assert(isArray('coo').takeLeft().explain({})).equal('isArray');
            assert(isArray([]).takeRight()).equate([]);
        });
    });

    describe('range', () => {
        it('should work', () => {
            assert(range(1, 3)([]).takeLeft().explain()).equal('range.min');
            assert(range(1, 3)([1, 2, 3, 4]).takeLeft().explain()).equal(
                'range.max'
            );
            assert(range(1, 3)([1, 2, 3]).takeRight()).equate([1, 2, 3]);
        });
    });

    describe('filter', () => {
        it('should retain succesful members', () => {
            assert(filter(num)(invalidList).takeRight()).equate([
                0, 1, 2, 3, 5, 7, 9
            ]);
        });
    });

    describe('map', () => {
        it('should fail if any member fails', () => {
            assert(map(num)(invalidList).takeLeft().explain()).equate({
                4: 'num',
                6: 'num',
                8: 'num'
            });
        });

        it('should work otherwise', () => {
            assert(map(num)(validList).takeRight()).equate([
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9
            ]);
        });
    });

    describe('tuple', () => {
        const checks = [num, string, num];

        it('should pass when valid', () => {
            let value = [1, 'two', 3];

            let ret = tuple(checks)(value).takeRight();

            assert(ret).equate([1, 'two', 3]);
        });

        it('should fail when invalid', () => {
            let value = [1, 2, 3];

            let ret = tuple(checks)(value).isLeft();

            assert(ret).true();
        });
    });
});
