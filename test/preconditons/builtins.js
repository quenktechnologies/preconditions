import must from 'must';
import { number, string, array, equals, notNull, nullable, func, expand } from '../../src/preconditions';

describe('builtins', function() {

    describe('notNull', function() {

        it('should fail if a value is not specified', function() {

            must(notNull().apply('value')).be('value');
            must(notNull().apply()).be.instanceOf(Error);

        });

    });

    describe('number', function() {

        it('should fail if the value specified is not a number', function() {

            must(number().apply(12)).be(12);
            must(number().apply('12')).be.instanceOf(Error);

        });

    });

    describe('string', function() {

        it('should fail if the value specified is not a string', function() {

            must(string().apply('12')).be('12');
            must(string().apply(12)).be.instanceOf(Error);

        });

    });

    describe('array', function() {

        it('should fail if the value supplied is not an array', function() {

            must(array().apply([])).eql([]);
            must(array().apply('[]')).be.instanceOf(Error);

        });

    });

    describe('equals', function() {

        it('should fail if the value is not equal', function() {

            must(equals(23).apply(23)).be(23);
            must(equals(23).apply('23')).be.instanceOf(Error);

        });

    });

    describe('expand', function() {

        it('should expand inline templates', function() {

            must(expand('My name is {name}', { name: 'Hutumu' })).be('My name is Hutumu');

        });

    });



});
