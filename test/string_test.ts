import { must } from '@quenk/must';
import { 
  isString,
  matches, 
  trim,
  maxLength, 
  minLength, 
  range,
  notEmpty,
  toString } from '../src/string';
import { PrimFailure } from '../src/result/failure';

describe('string', function() {

    describe('isString', function() {

        it('should fail if the value specified is not a string', function() {

            must(isString('12').takeRight()).equal('12');
            must(isString(12).takeLeft()).be.instance.of(PrimFailure);

        });

    });

    describe('matches', function() {

        it('should correctly test string', function() {

            let email = /.+\@.+\..+/;
            must(matches(email)('m12@emale.com').takeRight()).equal('m12@emale.com');
            must(matches(email)('12').takeLeft()).be.instance.of(PrimFailure);

        });

    });

    describe('trim', function() {

        it('should remove trailing whitespace', () => {

            must(trim(' ole o zebra       ').takeRight()).equal('ole o zebra');

        });

    });

    describe('range', function() {

        it('should ensure a string length falls within a range', function() {

            let test = range(3, 5);

            must(test('1').takeLeft().explain()).equal('range.min');
            must(test('111111').takeLeft().explain()).equal('range.max');
            must(test('111').takeRight()).equal('111');
            must(test('1111').takeRight()).equal('1111');
            must(test('11111').takeRight()).equal('11111');

        })

    })

    describe('maxLength', function() {

        it('should ensure a stirng has maxLength', function() {

            let test = maxLength(5);

            must(test('1111111').takeLeft().explain()).equal('maxLength');
          must(test('11111').takeRight()).equal('11111');
            must(test('1111').takeRight()).equal('1111');

        })

    })

    describe('minLength', function() {

        it('should ensure a string has minLength', function() {

            let test = minLength(5);

            must(test('1').takeLeft().explain()).equal('minLength');
            must(test('11111').takeRight()).equal('11111');
            must(test('111111').takeRight()).equal('111111');

        })

    })

    describe('notEmpty', () => {

        it('should work', () => {
            must(notEmpty('').takeLeft().explain()).equal('notEmpty');
            must(notEmpty('[]').takeRight()).equal('[]');

        })

    });

    describe('toString', function() {

        it('should cast to string', () => {

            must(toString([12]).takeRight()).equal('12');

        })

    });

});
