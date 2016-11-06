import must from 'must';
import AsyncFunc from '../../src/preconditions/AsyncFunc';

var func = null;

beforeEach(function() {

    func = new AsyncFunc(value => 1);

});

describe('AsyncFunc', function() {

    describe('apply', function() {

        it('should work', function() {

            return func.apply(['1', 'c', 'd']).
            then(result => must(result).eql(1));

        });

    });

});
