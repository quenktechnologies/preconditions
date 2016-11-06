import must from 'must';
import MapError from '../../src/preconditions/MapError';

var err;
var errors = {};

class Child extends MapError {


}

class Child1 extends MapError {


}

describe('MapError', function() {

    beforeEach(function() {

        errors = {};
        err = new MapError(errors);

    });


    it('must be an instance of Error', function() {

        must(new MapError()).be.instanceof(Error);

    });

    describe('children', function() {

        it('must be an instanceof of Error', function() {

            must(new Child()).be.instanceof(Error);

        });

    });

    describe('grand-children', function() {

        it('must be an instanceof Error', function() {

            must(new Child1()).be.instanceof(Error);

        });

    });

    describe('expand', function() {

        it('should expand inline templates', function() {

            must(err.expand('My name is {name}', { name: 'Hutumu' })).be('My name is Hutumu');

        });

    });

    describe('asObject', function() {

        it('should work', function() {

            errors.name = new Error('Name must be a string! Got {value}!');
            errors.name.value = 22;
            errors.address = new MapError({ street: 'Invalid' });
            errors.email = new Error('required');
            errors.email.key = 'email';
            errors.username = new Error('unique');
            errors.username.key = 'username';

            must(err.asObject({

                'email.required': '{key} is required!',
                'unique': '{key} must be unique!'

            })).eql({

                name: 'Name must be a string! Got 22!',
                address: {
                    street: 'Invalid'
                },
                email: 'email is required!',
                username: 'username must be unique!'
            });


        });

    });

});
