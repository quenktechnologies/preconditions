import must from 'must';
import { uppercase } from './helpers';
import List from '../../src/preconditions/List';

var list = null;

beforeEach(function() {

    list = new List(uppercase());

});

describe('List', function() {

    describe('apply', function() {

        it('should transform an array', function() {

            must(list.apply(['a', 'b', 'c'])).eql(['A', 'B', 'C']);

        });

    });

});
