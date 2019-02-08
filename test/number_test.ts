import { assert } from '@quenk/test/lib/assert';
import { PrimFailure } from '../src/result/failure';
import { isNumber, toNumber, range } from '../src/number';

describe('number', function() {

    describe('isNumber', function() {

        it('should fail if the value specified is not a number', function() {

            assert(isNumber(12).takeRight()).equal(12);
            assert(isNumber('12').takeLeft()).be.instance.of(PrimFailure);

        });

        it('should not pass NaN', function() {

            assert(isNumber(NaN).takeLeft()).be.instance.of(PrimFailure);

        });

    });

    describe('toNumber', function() {

        it('should fail if not a number', function() {

            assert(toNumber(Date).takeLeft().explain()).equal('NaN');

        });

        it('should cast to number', function() {

            assert(toNumber('025.990').takeRight()).equal(25.99);

        });

    });

    describe('range', function() {

        it('should correctly test string, number or arrays', function() {

            let test = range(3, 5);

            assert(test(1).takeLeft().explain()).equal('range.min');
            assert(test(6).takeLeft().explain()).equal('range.max');
            assert(test(3).takeRight()).equal(3);
            assert(test(4).takeRight()).equal(4);
            assert(test(5).takeRight()).equal(5);

        })

    });

});


