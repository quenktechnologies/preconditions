import * as must from 'must/register';
import { notEmpty, isArray, filter, map, range } from '../../src/array';
import { success, failure } from '../../src/result';

const num = <A>(n: A) => (typeof n === 'number') ? success(n) : failure('num', n);
const invalidList = [0, 1, 2, 3, 'four', 5, 'six', 7, 'eight', 9];
const validList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

describe('array', function() {

    describe('notEmpty', () => {

        it('should work with arrays', () => {

            must(notEmpty([]).takeLeft().explain()).be('notEmpty');
            must(notEmpty([1]).takeRight()).eql([1]);

        })

    });

    describe('isArray', function() {

        it('should work', function() {

            must(isArray('coo').takeLeft().explain({})).be('isArray');
            must(isArray([]).takeRight()).eql([]);

        });

    });

    describe('range', function() {

        it('should work', function() {

            must(range(1, 3)([]).takeLeft().explain()).eql('range.min');
            must(range(1, 3)([1, 2, 3, 4]).takeLeft().explain()).eql('range.max');
            must(range(1, 3)([1, 2, 3]).takeRight()).eql([1, 2, 3]);

        });

    });

    describe('filter', function() {

        it('should retain succesful members', function() {

            must(filter(num)(invalidList).takeRight()).eql([0, 1, 2, 3, 5, 7, 9]);

        });

    });

    describe('map', function() {

        it('should fail if any member fails', function() {

            must(map(num)(invalidList).takeLeft().explain())
                .eql({ 4: 'num', 6: 'num', 8: 'num' });

        });

        it('should work otherwise', function() {

            must(map(num)(validList).takeRight())
                .eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

        });

    });

});
