import * as must from 'must/register';
import * as help from './help';
import * as conditions from '../src/Map';

class Condition<A, B> extends conditions.Map<A, B> {

    name = help.string()
    age = help.number()
    roles = help.list()

}

class Nested<A, B> extends conditions.Map<A, B> {

    id = help.number()
    condition = new Condition()

}

const map = new Condition();
const nest = new Nested();
const hashed = new conditions.Hash({ name: help.string(), age: help.string() });

describe('Map', function() {

    describe('apply', function() {

        it('should return a Failure for invalid data', function() {

            must(map.apply({ name: null, age: '', roles: '' }).takeLeft()).
                be.instanceof(conditions.Failure);

        });

        it('should return valid data', function() {

            must(map.apply({ name: 'string', age: 22, roles: [] }).takeRight()).
                eql({ name: 'string', age: 22, roles: [] });

        });

        it('should run all preconditions', function() {

            must(map.apply({ name: 'string', age: 22 }).takeLeft()).be.instanceof(conditions.Failure);

        });

    });

    it('should work nested', () => {

        must(nest.apply({ id: 12, condition: { name: 'string', age: 22, roles: [] } }).takeRight())
            .eql({ id: 12, condition: { name: 'string', age: 22, roles: [] } });

    })

    it('should detect nested errors', () => {

        must(
            nest.apply({
                id: 'six', condition: { name: new Date(), age: 22, roles: [] }
            }).takeLeft()
                .expand()).eql({ id: 'number', condition: { name: 'string' } });

    })

})

describe('Hash', function() {

    it('should return a Failure for invalid data', function() {

        must(hashed.apply({ name: null, age: 12, roles: '' }).takeLeft().expand()).
            eql({ name: 'string', age: 'string' });

    });

    it('should return valid data', function() {

        must(hashed.apply({ name: 'string', age: '22', roles: [] }).takeRight()).
            eql({ name: 'string', age: '22' });

    });

});

describe('Failure', function() {

    let fail;
    let templates: { [key: string]: string };

    beforeEach(function() {

        fail = new conditions.Failure('string', 12, { feels: 'joys' });
        templates = { string: 'Input "{$value}" is not a number! I no feel {feels}{punc}' };

    });

    describe('expand', function() {

        it('should expand templates', function() {

            must(fail.expand(templates, { punc: '!' }))
                .be('Input "12" is not a number! I no feel joys!');

        });

    });

});

describe('MapFailure', () => {

    describe('expand', () => {

        let fail;
        let templates: { [key: string]: string };

        beforeEach(function() {

            fail = new conditions.MapFailure<string | number | number[] | Date>({
                name: new conditions.Failure('string', new Date()),
                age: new conditions.Failure('range', 200, { min: 5, max: 122 }),
                size: new conditions.Failure('enum', 'small')
            }, { name: [3], age: 10000, size: 'tiny' });

            templates = {
                'name.string': 'There was a problem with {$key}!',
                'name': 'You should never see this',
                'age.range': '{$key} must be within {min} to {max}',
                'size': '{her} says size must not be {$value}'
            };

        });

        it('should work', () => {

            let r = fail.expand(templates, { her: 'Sara' });

            must(r).eql({
                name: 'There was a problem with name!',
                age: 'age must be within 5 to 122',
                size: 'Sara says size must not be small'
            });

        });

    });

});

describe('builtins', function() {

    describe('notNull', function() {

        it('should fail if a value is not specified', function() {

            let x;

            must(conditions.notNull().apply('value').takeRight()).be('value');
            must(conditions.notNull().apply(x).takeLeft()).be.instanceOf(conditions.Failure);

        });

    });

    describe('number', function() {

        it('should fail if the value specified is not a number', function() {

            must(conditions.number().apply(12).takeRight()).be(12);
            must(conditions.number().apply('12').takeLeft()).be.instanceOf(conditions.Failure);

        });

    });

    describe('string', function() {

        it('should fail if the value specified is not a string', function() {

            must(conditions.string().apply('12').takeRight()).be('12');
            must(conditions.string().apply(12).takeLeft()).be.instanceOf(conditions.Failure);

        });

    });

    describe('list', function() {

        it('should fail if the value supplied is not an array', function() {

            must(conditions.list().apply([]).takeRight()).eql([]);
            must(conditions.list().apply('[]').takeLeft()).be.instanceOf(conditions.Failure);

        });

    });

    describe('equals', function() {

        it('should fail if the value is not equal', function() {

            console.log(conditions.equals(23).apply(23));
            must(conditions.equals(23).apply(23).takeRight()).be(23);
            must(conditions.equals(23).apply('23').takeLeft()).be.instanceOf(conditions.Failure);

        });

    });

});




