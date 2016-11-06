import must from 'must';
import Func from '../../src/preconditions/Func';

var func = null;

beforeEach(function() {

    func = new Func(value=>1);

});


describe('Func', function() {

    describe('apply', function() {

        it('should work', function() {

            must(func.apply(['1', 'c', 'd'])).eql(1);

        });

    });

});
