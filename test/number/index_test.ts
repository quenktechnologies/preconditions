import * as must from 'must/register';
import { Failure } from '../../src';
import { isNumber, toNumber, range } from '../../src/number';

describe('number', function() {

    describe('isNumber', function() {

        it('should fail if the value specified is not a number', function() {

            must(isNumber(12).takeRight()).be(12);
            must(isNumber('12').takeLeft()).be.instanceOf(Failure);

        });

        it('should not pass NaN', function() {

            must(isNumber(NaN).takeLeft()).be.instanceOf(Failure);

        });

    });

    describe('toNumber', function() {

        it('should fail if not a number', function() {

            must(toNumber( Date).takeLeft().explain()).eql('NaN');

        });

        it('should cast to number', function() {

            must(toNumber('025.990').takeRight()).eql(25.99);

        });

    });

    describe('range', function() {

        it('should correctly test string, number or arrays', function() {

            let test = range(3, 5);

            must(test(1).takeLeft().explain()).be('range.min');
            must(test(6).takeLeft().explain()).be('range.max');
            must(test(3).takeRight()).be(3);
            must(test(4).takeRight()).be(4);
            must(test(5).takeRight()).be(5);

        })

    });

});


