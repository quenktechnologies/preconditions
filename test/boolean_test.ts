import { assert } from '@quenk/test/lib/assert';
import { PrimFailure } from '../src/result/failure';
import { isBoolean, toBoolean } from '../src/boolean';

describe('boolean', function() {

    describe('isBoolean', function() {

        it('should fail if the value specified is not a boolean', function() {

            assert(isBoolean(true).takeRight()).be.true();
            assert(isBoolean(false).takeRight()).be.false();
            assert(isBoolean('12').takeLeft()).be.instance.of(PrimFailure);

        });

    });

    describe('toBoolean', function() {

        it('should work', function() {

            assert(toBoolean(Date).takeRight()).be.true();
            assert(toBoolean(undefined).takeRight()).be.false();
            assert(toBoolean(null).takeRight()).be.false();
            assert(toBoolean(true).takeRight()).be.true();
          assert(toBoolean(false).takeRight()).be.false();

        });

    });

});


