import * as must from 'must/register';
import { Failure } from '../src/result';
import { isBoolean, toBoolean } from '../src/boolean';

describe('boolean', function() {

    describe('isBoolean', function() {

        it('should fail if the value specified is not a boolean', function() {

            must(isBoolean(true).takeRight()).be(true);
            must(isBoolean(false).takeRight()).be(false);
            must(isBoolean('12').takeLeft()).be.instanceOf(Failure);

        });

    });

    describe('toBoolean', function() {

        it('should work', function() {

            must(toBoolean(Date).takeRight()).be(true);
            must(toBoolean(undefined).takeRight()).be(false);
            must(toBoolean(null).takeRight()).be(false);
            must(toBoolean(true).takeRight()).be(true);
            must(toBoolean(false).takeRight()).be(false);

        });

    });

});


