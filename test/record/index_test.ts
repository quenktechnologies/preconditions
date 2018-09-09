import * as must from 'must/register';
import * as preconditions from '../../src/result';
import { restrict, disjoint, union, intersect, map } from '../../src/record'
import { isObject, Preconditions } from '../../src/record';
import { Precondition, every } from '../../src';

const validUser = { name: 'name', age: 12, roles: 'none' };

const invalidUser = { name: null, age: [''], roles: 'roles' };

const userWithAddtionalProperties = {
    name: 'name',
    age: 12,
    roles: 'none',
    genotype: 'N/A',
    metatronCompliant: false
};

const validAccess = {
    id: 24,
    network: 1,
    user: { name: 'pat', age: 27, roles: 'any' },
    previous: { name: 'pat', age: 26, roles: 'any' }
};

const invalidAccess = {
    id: 24,
    network: new Date('CCN'),
    user: { name: 'pat', age: 27, roles: ['any'] },
    previous: { name: 'pat', age: '26', roles: 'any' }
};

const partialValidAccess = { network: 1, user: { age: 12 }, previous: { age: 12 } };

const partialValidAccessErrors = {
    id: 'check',
    previous: {
        name: 'check',
        roles: 'check'
    },
    user: {
        name: 'check',
        roles: 'check'
    }
};

const partialInvalidAccess = {
    network: 'one', user: { age: 'twelve' }, previous: { age: [1] }
};

const partialInvalidAccessErrors = {
    network: 'check', user: { age: 'check' }, previous: { age: 'check' }
};

const noDataErrors = {

    name: 'check',
    age: 'check',
    roles: 'check'

};

const check = <A>(type: string): Precondition<A, A> => (value: A) =>
    (type === 'prim') ?
        typeof value !== 'object' ?
            preconditions.success<A, A>(value) :
            preconditions.failure<A, A>('check', value) :
        (type === 'array') ?
            Array.isArray(value) ?
                preconditions.success<A, A>(value) :
                preconditions.failure<A, A>('check', value) :
            (typeof value !== type) ?
                preconditions.failure<A, A>('check', value) :
                preconditions.success<A, A>(value);

const user: Preconditions<any, any> = {

    name: check('string'),
    age: check('number'),
    roles: check('string')

}

const shouldFailInvalidData = (condition: Precondition<object, object>) =>
    must(condition(invalidUser).takeLeft().explain())
        .eql({ name: 'check', age: 'check' });

const shouldAllowValidData = (condition: Precondition<object, object>) =>
    must(condition(validUser).takeRight()).eql(validUser);

const unknownProperties = (condition: Precondition<object, object>, expected: object) =>
    must(condition(userWithAddtionalProperties).takeRight()).eql(expected);

const shouldWorkWithNestedConditions = (condition: Precondition<object, object>) => {

    must(condition(validAccess).takeRight()).eql(validAccess);

    must(condition(invalidAccess).takeLeft().explain())
        .eql({
            network: 'check', user: { roles: 'check' }, previous: { age: 'check' }
        });

}

const shouldApplyEveryCondtion = (condition: Precondition<object, object>) =>
    must(condition(partialValidAccess).takeLeft()
        .explain({}))
        .eql(partialValidAccessErrors);

const shouldFailtWhenNoData = (condition: Precondition<object, object>) =>
    must(condition({}).takeLeft()
        .explain({}))
        .eql(noDataErrors);

describe('record', function() {

    describe('isObject', function() {

        it('should work', function() {

            must(isObject({}).takeRight()).eql({});

            must(isObject('z').takeLeft().explain({})).eql('isObject');

            must(isObject([]).takeLeft().explain({})).eql('isObject');

        });

    });

    describe('restrict', function() {

        const access: Preconditions<any, any> = {

            id: check('number'),
            network: check('number'),
            user: every(isObject, restrict(user)),
            get previous() { return every(isObject, restrict(user)); }

        }

        it('should fail when no data provided ',
            () => shouldFailtWhenNoData(restrict(user)));

        it('should fail invalid data',
            () => shouldFailInvalidData(restrict(user)))

        it('should allow valid data',
            () => shouldAllowValidData(restrict(user)));

        it('should exclude unspecified properties',
            () => unknownProperties(restrict(user), validUser))

        it('should work with nested conditions',
            () => shouldWorkWithNestedConditions(restrict(access)));

        it('should apply every precondition', () =>
            shouldApplyEveryCondtion(restrict(access)));

    });

    describe('disjoint', function() {

        const access: Preconditions<any, any> = {

            id: check('number'),
            network: check('number'),
            user: every(isObject, disjoint(user)),
            get previous() { return every(isObject, disjoint(user)); }

        }

        it('should fail invalid data',
            () => shouldFailInvalidData(disjoint(user)));

        it('should allow valid data',
            () => shouldAllowValidData(disjoint(user)));

        it('should keep unknown properties',
            () => unknownProperties(disjoint(user), userWithAddtionalProperties))

        it('should work with nested conditions',
            () => shouldWorkWithNestedConditions(disjoint(access)))

    });

    describe('intersect', function() {

        const access: Preconditions<any, any> = {

            id: check('number'),
            network: check('number'),
            user: every(isObject, intersect(user)),
            get previous() { return every(isObject, intersect(user)); }

        }

        it('should fail invalid data', () => shouldFailInvalidData(intersect(user)));

        it('should allow valid data', () => shouldAllowValidData(intersect(user)));

        it('should exclude unknown properties',
            () => unknownProperties(intersect(user), validUser))

        it('should work with nested conditions',
            () => shouldWorkWithNestedConditions(intersect(access)))

        it('should apply to present properties only', () => {

            must(intersect(access)(partialValidAccess).takeRight()).eql(partialValidAccess);
            must(intersect(access)(partialInvalidAccess).takeLeft().explain()).eql(partialInvalidAccessErrors)

        })

    })

    describe('union', function() {

        const access: Preconditions<any, any> = {

            id: check('number'),
            network: check('number'),
            user: every(isObject, union(user)),
            get previous() { return every(isObject, union(user)); }

        }

        it('should fail invalid data',
            () => shouldFailInvalidData(union(user)));

        it('should allow valid data',
            () => shouldAllowValidData(union(user)));

        it('should keep unknown properties',
            () => unknownProperties(union(user), userWithAddtionalProperties))

        it('should work with nested conditions',
            () => shouldWorkWithNestedConditions(union(access)))

        it('should apply every precondition', () =>
            shouldApplyEveryCondtion(union(access)))

    });

    describe('map', function() {

        it('should fail invalid data',
            () =>
                shouldFailInvalidData(every(isObject, map(check('prim')))));

        it('should allow valid data',
            () =>
                shouldAllowValidData(every(isObject, map(check('prim')))));

    });

});

