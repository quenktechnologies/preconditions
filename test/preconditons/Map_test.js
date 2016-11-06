import must from 'must';
import { number, string, array } from './helpers';
import Map from '../../src/preconditions/Map';

var map = null;

beforeEach(function() {

    map = new Map({

        name: string(),
        age: number(),
        roles: array()

    });

});

describe('Map', function() {

    describe('apply', function() {

        it('should return an error for invalid data', function() {

            must(map.apply({ name: null, age: '', roles: '' })).
            be.instanceof(Error);

        });

        it('should return null for valid data', function() {

            must(map.apply({ name: 'string', age: 22, roles: [] })).
            eql({ name: 'string', age: 22, roles: [] });

        });

        it('should run all preconditions', function() {

            must(map.apply({ name: 'string', age: 22 })).be.instanceof(Error);

        });

    });

});
