import * as must from 'must/register';
import * as help from './help';
import * as conditions from '../src';
import { Preconditions } from '../src';

interface User {

    name: string,
    age: number,
    roles: string[]

}

const user: Preconditions<any, User> = {

    name: conditions.string,
    age: conditions.number,
    roles: conditions.array

}

const idUser = {

    id: conditions.number,
    user: conditions.map(user)

}

interface User {
    name: string
    age: number
}

interface IdUser {

    id: number,
    user: User

}
/*
describe('map', function() {

    it('should return a Failure for invalid data', function() {

        must(conditions.map(new Condition())({ name: null, age: '', roles: '' }).takeLeft()).
            be.instanceof(conditions.Failure);

    });

    it('should return valid data', function() {

        must(conditions.map(new Map())({ name: 'string', age: 22, roles: [] }).takeRight()).
            eql({ name: 'string', age: 22, roles: [] });

    });

    it('should run all preconditions', function() {

        must(conditions.map(new Map())({ name: 'string', age: 22 }).takeLeft()).be.instanceof(conditions.Failure);

    });

    it('should work nested', () => {

        must(conditions.map(new Nested())({ id: 12, condition: { name: 'string', age: 22, roles: [] } }).takeRight())
            .eql({ id: 12, condition: { name: 'string', age: 22, roles: [] } });

    })

    it('should detect nested errors', () => {

        must(
            conditions.map(new Nested())({
                id: 'six', condition: { name: new Date(), age: 22, roles: [] }
            }).takeLeft()
                .expand()).eql({ id: 'number', condition: { name: 'string' } });

    })

    it('should allow for type recognition', () => {

        let map = new Condition();

        let user: User = conditions.map(map)({ name: 'Me', age: 21, roles: [] }).takeRight();

        must(user).eql({ name: 'Me', age: 21, roles: [] });

    })

})


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

    describe('required', function() {

        it('should fail if a value is not specified', function() {

            let x;

            must(conditions.required().apply(null, 'value').takeRight()).be('value');
            must(conditions.required().apply(null, x).takeLeft()).be.instanceOf(conditions.Failure);

        });

    });

    describe('optional', () =>
        it('should pass on to the test when not null', () => {

            const test = { apply(_: any, __: any) { return conditions.valid('12') } };

            must(conditions.optional(test).apply(null, undefined).takeRight()).eql(null)
            must(conditions.optional(test).apply(null, 'earth').takeRight()).be('12')

        }))

    describe('number', function() {

        it('should fail if the value specified is not a number', function() {

            must(conditions.number().apply(null, 12).takeRight()).be(12);
            must(conditions.number().apply(null, '12').takeLeft()).be.instanceOf(conditions.Failure);

        });

    });

    describe('string', function() {

        it('should fail if the value specified is not a string', function() {

            must(conditions.string().apply(null, '12').takeRight()).be('12');
            must(conditions.string().apply(null, 12).takeLeft()).be.instanceOf(conditions.Failure);

        });

    });

    describe('list', function() {

        it('should fail if the value supplied is not an array', function() {

            must(conditions.list().apply(null, []).takeRight()).eql([]);
            must(conditions.list().apply(null, '[]').takeLeft()).be.instanceOf(conditions.Failure);

        });

    });

    describe('equals', function() {

        it('should fail if the value is not equal', function() {

            must(conditions.equals(23).apply(null, 23).takeRight()).be(23);
            must(conditions.equals(23).apply(null, '23').takeLeft()).be.instanceOf(conditions.Failure);

        });

    });

    describe('whenTrue', () =>
        it('should decide correctly', () => {

            const left = {
                apply(_: any, __: any) { return conditions.valid('left'); }
            }

            const right = {
                apply(_: any, __: any) { return conditions.valid('right'); }
            }

            must(conditions.whenTrue(false, left, right).apply(null, 12).takeRight()).eql('left');
            must(conditions.whenTrue(true, left, right).apply(null, 12).takeRight()).eql('right');

        }))

})



*/
