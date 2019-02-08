import {assert} from '@quenk/test/lib/assert';
import { notEmpty, isArray, filter, map, range } from '../src/array';
import { succeed, fail } from '../src/result';

const num = <A>(n: A) => (typeof n === 'number') ? succeed(n) : fail('num', n);
const invalidList = [0, 1, 2, 3, 'four', 5, 'six', 7, 'eight', 9];
const validList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

describe('array', function() {

    describe('notEmpty', () => {

        it('should work with arrays', () => {

            assert(notEmpty([]).takeLeft().explain()).equal('notEmpty');
            assert(notEmpty([1]).takeRight()).equate([1]);

        })

    });

    describe('isArray', function() {

        it('should work', function() {

            assert(isArray('coo').takeLeft().explain({})).equal('isArray');
            assert(isArray([]).takeRight()).equate([]);

        });

    });

    describe('range', function() {

        it('should work', function() {

            assert(range(1, 3)([]).takeLeft().explain()).equal('range.min');
            assert(range(1, 3)([1, 2, 3, 4]).takeLeft().explain()).equal('range.max');
            assert(range(1, 3)([1, 2, 3]).takeRight()).equate([1, 2, 3]);

        });

    });

    describe('filter', function() {

        it('should retain succesful members', function() {

            assert(filter(num)(invalidList).takeRight()).equate([0, 1, 2, 3, 5, 7, 9]);

        });

    });

    describe('map', function() {

        it('should fail if any member fails', function() {

            assert(map(num)(invalidList).takeLeft().explain())
                .equate({ 4: 'num', 6: 'num', 8: 'num' });

        });

        it('should work otherwise', function() {

            assert(map(num)(validList).takeRight())
                .equate([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

        });

    });

});
