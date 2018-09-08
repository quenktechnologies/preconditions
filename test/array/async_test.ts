import * as must from 'must/register';
import { filter, map } from '../../src/array/async';
import { success, failure } from '../../src/async/result';

const num = <A>(n: A) => (typeof n === 'number') ? success(n) : failure('num', n, {});
const invalidList = [0, 1, 2, 3, 'four', 5, 'six', 7, 'eight', 9];
const validList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

describe('async', function() {

    describe('filter', function() {

        it('should retain succesful members', function() {

            (filter(num)(invalidList))
                .then(e => must(e.takeRight()).eql([0, 1, 2, 3, 5, 7, 9]))

        });

    });

    describe('map', function() {

        it('should fail if any member fails', function() {

            (map(num)(invalidList))
                .then(e => must(e.takeLeft().explain())
                    .eql({ 4: 'num', 6: 'num', 8: 'num' }));

        });

        it('should work otherwise', function() {

            (map(num)(validList))
                .then(e => must(e.takeRight())
                    .eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));

        });

    });

});
