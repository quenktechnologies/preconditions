import must from 'must';
import Promise from 'bluebird';
import { number, string, array } from './helpers';
import AsyncMap from '../../src/preconditions/AsyncMap';

var map = null;

const async = function(precondition) {

    return {

        apply(value) {

            return Promise.try(function() {

                return precondition.apply(value);

            });

        }

    }

}

beforeEach(function() {

    map = new AsyncMap({

        name: async(string()),
        age: async(number()),
        roles: async(array())

    });

});


describe('AsyncMap', function() {

    describe('apply', function() {

        it('should return an Error for invalid data', function() {

            return map.apply({ name: null, age: '', roles: '' }).
            then(result => {

                must(result).be.instanceof(Error);

            });

        });

        it('should return valid data', function() {

            return map.apply({ name: 'string', age: 22, roles: [] }).
            then(result => {

                must(result).be.eql({name:'string', age:22, roles:[]});

            });

        });

        it('should run all preconditions', function() {

            return map.apply({ name: 'string', age: 22 }).
            then(result => {

                must(result).be.instanceof(Error);

            });

        });

    });

});
