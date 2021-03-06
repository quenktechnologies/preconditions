import { assert } from '@quenk/test/lib/assert';
import { restrict, disjoint, union, intersect, map } from '../src/record'
import { isRecord } from '../src/record';
import { Preconditions } from '../src';
import { Precondition, every } from '../src';
import { succeed, fail } from '../src/result';

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
            succeed<A, A>(value) :
            fail<A, A>('check', value) :
        (type === 'array') ?
            Array.isArray(value) ?
                succeed<A, A>(value) :
                fail<A, A>('check', value) :
            (typeof value !== type) ?
                fail<A, A>('check', value) :
                succeed<A, A>(value);

const user: Preconditions<any, any> = {

    name: check('string'),
    age: check('number'),
    roles: check('string')

}

const shouldFailInvalidData = (condition: Precondition<object, object>) =>
    assert(condition(invalidUser).takeLeft().explain())
        .equate({ name: 'check', age: 'check' });

const shouldAllowValidData = (condition: Precondition<object, object>) =>
    assert(condition(validUser).takeRight()).equate(validUser);

const unknownProperties = (condition: Precondition<object, object>, expected: object) =>
    assert(condition(userWithAddtionalProperties).takeRight()).equate(expected);

const shouldWorkWithNestedConditions = (condition: Precondition<object, object>) => {

    assert(condition(validAccess).takeRight()).equate(validAccess);

    assert(condition(invalidAccess).takeLeft().explain())
        .equate({
            network: 'check', user: { roles: 'check' }, previous: { age: 'check' }
        });

}

const shouldApplyEveryCondtion = (condition: Precondition<object, object>) =>
    assert(condition(partialValidAccess).takeLeft()
        .explain({}))
        .equate(partialValidAccessErrors);

const shouldFailtWhenNoData = (condition: Precondition<object, object>) =>
    assert(condition({}).takeLeft()
        .explain({}))
        .equate(noDataErrors);

describe('record', function() {

    describe('isRecord', function() {

        it('should work', function() {

            assert(isRecord({}).takeRight()).equate({});

            assert(isRecord('z').takeLeft().explain({})).equal('isRecord');

            assert(isRecord([]).takeLeft().explain({})).equal('isRecord');

        });

    });

    describe('restrict', function() {

        const access: Preconditions<any, any> = {

            id: check('number'),
            network: check('number'),
            user: every(isRecord, restrict(user)),
            get previous() { return every(isRecord, restrict(user)); }

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
            user: every(isRecord, disjoint(user)),
            get previous() { return every(isRecord, disjoint(user)); }

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
            user: every(isRecord, intersect(user)),
            get previous() { return every(isRecord, intersect(user)); }

        }

        it('should fail invalid data', () => shouldFailInvalidData(intersect(user)));

        it('should allow valid data', () => shouldAllowValidData(intersect(user)));

        it('should exclude unknown properties',
            () => unknownProperties(intersect(user), validUser))

        it('should work with nested conditions',
            () => shouldWorkWithNestedConditions(intersect(access)))

        it('should apply to present properties only', () => {

            assert(intersect(access)(partialValidAccess).takeRight())
                .equate(partialValidAccess);

            assert(intersect(access)(partialInvalidAccess).takeLeft().explain())
                .equate(partialInvalidAccessErrors)

        })

    })

    describe('union', function() {

        const access: Preconditions<any, any> = {

            id: check('number'),
            network: check('number'),
            user: every(isRecord, union(user)),
            get previous() { return every(isRecord, union(user)); }

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
                shouldFailInvalidData(every(isRecord, map(check('prim')))));

        it('should allow valid data',
            () =>
                shouldAllowValidData(every(isRecord, map(check('prim')))));

    });

});

