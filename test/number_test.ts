import {must} from '@quenk/must';
import { PrimFailure } from '../src/result/failure';
import { isNumber, toNumber, range } from '../src/number';

describe('number', function() {

    describe('isNumber', function() {

        it('should fail if the value specified is not a number', function() {

            must(isNumber(12).takeRight()).equal(12);
            must(isNumber('12').takeLeft()).be.instance.of(PrimFailure);

        });

        it('should not pass NaN', function() {

            must(isNumber(NaN).takeLeft()).be.instance.of(PrimFailure);

        });

    });

    describe('toNumber', function() {

        it('should fail if not a number', function() {

            must(toNumber(Date).takeLeft().explain()).equal('NaN');

        });

        it('should cast to number', function() {

            must(toNumber('025.990').takeRight()).equal(25.99);

        });

    });

    describe('range', function() {

        it('should correctly test string, number or arrays', function() {

            let test = range(3, 5);

            must(test(1).takeLeft().explain()).equal('range.min');
            must(test(6).takeLeft().explain()).equal('range.max');
            must(test(3).takeRight()).equal(3);
            must(test(4).takeRight()).equal(4);
            must(test(5).takeRight()).equal(5);

        })

    });

});


