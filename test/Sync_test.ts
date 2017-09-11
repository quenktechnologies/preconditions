import * as must from 'must/register';
import * as conditions from '../src/Sync';
import { Preconditions } from '../src/Sync';

interface User {

    name: string,
    age: number,
    roles: string[]

}

const user: conditions.Preconditions<any, any> = {

    name: conditions.string,
    age: conditions.number,
    roles: conditions.array

}

const idUser: Preconditions<any, any> = {

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

describe('Sync', function() {

    describe('required', function() {

        it('should fail if a value is not specified', function() {

            let x;

            must(conditions.required('value').takeRight()).be('value');
            must(conditions.required(x).takeLeft()).be.instanceOf(conditions.Failure);

        });

    });

    describe('optional', () =>
        it('should pass on to the test when not null', () => {

            const test = (_: any) => conditions.valid('12');

            must(conditions.optional(test)(undefined).takeRight()).eql(undefined)
            must(conditions.optional(test)('earth').takeRight()).be('12')

        }))

    describe('number', function() {

        it('should fail if the value specified is not a number', function() {

            must(conditions.number(12).takeRight()).be(12);
            must(conditions.number('12').takeLeft()).be.instanceOf(conditions.Failure);

        });

    });

    describe('string', function() {

        it('should fail if the value specified is not a string', function() {

            must(conditions.string('12').takeRight()).be('12');
            must(conditions.string(12).takeLeft()).be.instanceOf(conditions.Failure);

        });

    });

    describe('matches', function() {

        it('should correctly test string', function() {

            let email = /.+\@.+\..+/;
            must(conditions.matches(email)('m12@emale.com').takeRight()).be('m12@emale.com');
            must(conditions.matches(email)('12').takeLeft()).be.instanceof(conditions.Failure);

        });

    });

    describe('trim', function() {

        it('should remove trailing whitespace', () => {

            must(conditions.trim(' ole o zebra       ').takeRight()).be('ole o zebra');

        });

    });

    describe('range', function() {

        it('should correctly test string, number or arrays', function() {

            let test = conditions.range(3, 5);

            must(test(1).takeLeft().explain()).be('range.min');
            must(test(6).takeLeft().explain()).be('range.max');
            must(test(3).takeRight()).be(3);
            must(test(4).takeRight()).be(4);
            must(test(5).takeRight()).be(5);

            must(test([1]).takeLeft().explain()).be('range.min');
            must(test([1, 1, 1, 1, 1, 1]).takeLeft().explain()).be('range.max');
            must(test([1, 1, 1]).takeRight()).eql([1, 1, 1]);
            must(test([1, 1, 1, 1]).takeRight()).eql([1, 1, 1, 1]);
            must(test([1, 1, 1, 1, 1]).takeRight()).eql([1, 1, 1, 1, 1]);

            must(test('1').takeLeft().explain()).be('range.min');
            must(test('111111').takeLeft().explain()).be('range.max');
            must(test('111').takeRight()).eql('111');
            must(test('1111').takeRight()).eql('1111');
            must(test('11111').takeRight()).eql('11111');

        })

    });

    describe('array', function() {

        it('should fail if the value supplied is not an array', function() {

            must(conditions.array([]).takeRight()).eql([]);
            must(conditions.array('[]').takeLeft()).be.instanceOf(conditions.Failure);

        });

    });

    describe('equals', function() {

        it('should fail if the value is not equal', function() {

            must(conditions.equals(23)(23).takeRight()).be(23);
            must(conditions.equals(23)('23').takeLeft()).be.instanceOf(conditions.Failure);

        });

    });

    describe('populated', () => {

        it('should work with arrays', () => {
            must(conditions.populated([]).takeLeft().explain()).be('populated');
            must(conditions.populated([1]).takeRight()).eql([1]);

        })

        it('should work with objects', () => {
            must(conditions.populated({}).takeLeft().explain()).be('populated');
            must(conditions.populated({ a: 2 }).takeRight()).eql({a:2});
        })

        it('should not crap out otherwise', () => {

            must(conditions.populated(1).takeLeft().explain()).be('populated');
            must(conditions.populated('').takeLeft().explain()).be('populated');
            must(conditions.populated(false).takeLeft().explain()).be('populated');

        });

    });

    describe('whenTrue', () =>
        it('should decide correctly', () => {

            const left = (_: any) => conditions.valid('left');

            const right = (_: any) => conditions.valid('right');

            must(conditions.whenTrue(false, left, right)(12).takeRight()).eql('left');
            must(conditions.whenTrue(true, left, right)(12).takeRight()).eql('right');

        }))

    describe('or', () => {
        it('should act like a logical or', () => {

            const left = (_: any) => conditions.fail('left', 'left');
            const right = (_: any) => conditions.valid('right');

            must(conditions.or(left, right)(12).takeRight()).eql('right');
            must(conditions.or(right, right)(12).takeRight()).eql('right');

        })

    })

    describe('and', () => {
        it('should work like a logical and', () => {

            const left = (_: any) => conditions.fail('left', 'left');
            const right = (_: any) => conditions.valid('right');

            must(conditions.and(right, left)(12).takeLeft().explain()).be('left');
            must(conditions.and(left, right)(12).takeLeft().explain()).be('left');
            must(conditions.or(right, right)(12).takeRight()).eql('right');

        })

    })

    describe('every', function() {

        const fails = (m: string) => (v: any) => conditions.fail(m, v);
        const up = (n: number) => conditions.valid(n + 1);

        it('should stop on first failure', () => {

            must(conditions.every(up, up, up, fails('away'), up, up)(1).takeLeft().explain()).be('away');

        });

        it('should run everything', () => {

            must(conditions.every(up, up, up, up, up, up, up, up, up)(1).takeRight()).be(10);

        });

    });

    describe('map', function() {

        it('should return a Failure for invalid data', function() {

            must(conditions.map(user)({ name: null, age: '', roles: '' }).takeLeft()).
                be.instanceof(conditions.Failure);

        });

        it('should return valid data', function() {

            must(conditions.map(user)({ name: 'string', age: 22, roles: [] }).takeRight()).
                eql({ name: 'string', age: 22, roles: [] });

        });

        it('should run all preconditions', function() {

            must(conditions.map(user)({ name: 'string', age: 22 }).takeLeft()).be.instanceof(conditions.Failure);

        });

        it('should work nested', () => {

            must(conditions.map(idUser)({ id: 12, user: { name: 'string', age: 22, roles: [] } }).takeRight())
                .eql({ id: 12, user: { name: 'string', age: 22, roles: [] } });

        })

        it('should detect nested errors', () => {

            must(
                conditions.map(idUser)({
                    id: 'six', user: { name: new Date(), age: 22, roles: [] }
                }).takeLeft()
                    .explain()).eql({ id: 'number', user: { name: 'string' } });

        })

        it('should allow for type recognition', () => {

            let u: User =
                conditions.map<any, User>(user)({ name: 'Me', age: 21, roles: [] })
                    .takeRight();

            let iu: IdUser = conditions.map<any, IdUser>(idUser)({
                id: 4,
                user: { name: 'Me', age: 21, roles: [] }
            }).takeRight();

            must(u).eql({
                name: 'Me', age: 21, roles: []
            });

            must(iu).eql({
                id: 4, user: {
                    name: 'Me', age: 21, roles: []
                }
            });

        })

    })
})

describe('Failure', function() {

    let fail;
    let templates: { [key: string]: string };

    beforeEach(function() {

        fail = new conditions.Failure('string', 12, { feels: 'joys' });
        templates = { string: 'Input "{$value}" is not a number! I no feel {feels}{punc}' };

    });

    describe('explain', function() {

        it('should explain templates', function() {

            must(fail.explain(templates, { punc: '!' }))
                .be('Input "12" is not a number! I no feel joys!');

        });

    });

});

describe('MapFailure', () => {

    describe('explain', () => {

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

            let r = fail.explain(templates, { her: 'Sara' });

            must(r).eql({
                name: 'There was a problem with name!',
                age: 'age must be within 5 to 122',
                size: 'Sara says size must not be small'
            });

        });

    });

});
