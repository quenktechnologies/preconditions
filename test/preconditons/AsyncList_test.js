import must from 'must';
import Promise from 'bluebird';
import { uppercase } from './helpers';
import AsyncList from '../../src/preconditions/AsyncList';

var list = null;

beforeEach(function() {

    list = new AsyncList({
        apply(value) {
            return Promise.try(()=>uppercase().apply(value));
        }

    })

});

describe('AsyncList', function() {

    describe('apply', function() {

        it('should preconditions an array', function() {

            return list.apply(['a', 'b', 'c']).
            then(result => must(result).eql(['A', 'B', 'C']));

        });

    });

});
