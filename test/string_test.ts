import { assert } from '@quenk/test/lib/assert';
import {
    isString,
    matches,
    trim,
    maxLength,
    minLength,
    range,
    notEmpty,
    toString
} from '../src/string';
import { PrimFailure } from '../src/result/failure';

describe('string', function () {
    describe('isString', function () {
        it('should fail if the value specified is not a string', function () {
            assert(isString('12').takeRight()).equal('12');
            assert(isString(12).takeLeft()).be.instance.of(PrimFailure);
        });
    });

    describe('matches', function () {
        it('should correctly test string', function () {
            let email = /.+@.+\..+/;
            assert(matches(email)('m12@emale.com').takeRight()).equal(
                'm12@emale.com'
            );
            assert(matches(email)('12').takeLeft()).be.instance.of(PrimFailure);
        });
    });

    describe('trim', function () {
        it('should remove trailing whitespace', () => {
            assert(trim(' ole o zebra       ').takeRight()).equal(
                'ole o zebra'
            );
        });
    });

    describe('range', function () {
        it('should ensure a string length falls within a range', function () {
            let test = range(3, 5);

            assert(test('1').takeLeft().explain()).equal('range.min');
            assert(test('111111').takeLeft().explain()).equal('range.max');
            assert(test('111').takeRight()).equal('111');
            assert(test('1111').takeRight()).equal('1111');
            assert(test('11111').takeRight()).equal('11111');
        });
    });

    describe('maxLength', function () {
        it('should ensure a stirng has maxLength', function () {
            let test = maxLength(5);

            assert(test('1111111').takeLeft().explain()).equal('maxLength');
            assert(test('11111').takeRight()).equal('11111');
            assert(test('1111').takeRight()).equal('1111');
        });
    });

    describe('minLength', function () {
        it('should ensure a string has minLength', function () {
            let test = minLength(5);

            assert(test('1').takeLeft().explain()).equal('minLength');
            assert(test('11111').takeRight()).equal('11111');
            assert(test('111111').takeRight()).equal('111111');
        });
    });

    describe('notEmpty', () => {
        it('should work', () => {
            assert(notEmpty('').takeLeft().explain()).equal('notEmpty');
            assert(notEmpty('[]').takeRight()).equal('[]');
        });
    });

    describe('toString', function () {
        it('should cast to string', () => {
            assert(toString([12]).takeRight()).equal('12');
        });
    });
});
