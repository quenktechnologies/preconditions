import * as Promise from 'bluebird';
import * as must from 'must/register';
import * as preconditions from '../../src/result';
import * as Async from '../../src/async/record';
import { restrict, disjoint, union, intersect, map } from '../../src/async/record';
import { isObject } from '../../src/record';
import { every, async as wrap } from '../../src/async';
import { Precondition } from '../../src/async';
import { Result } from '../../src/async/failure';

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
    id: 'async',
    previous: {
        name: 'async',
        roles: 'async'
    },
    user: {
        name: 'async',
        roles: 'async'
    }
};

const partialInvalidAccess = {
    network: 'one', user: { age: 'twelve' }, previous: { age: [1] }
};

const partialInvalidAccessErrors = {
    network: 'async', user: { age: 'async' }, previous: { age: 'async' }
};

const async = <A, B>(type: string) => (value: A): Result<A, B> =>
    Promise.fromCallback(cb =>
        setTimeout(() => cb(null,
            (type === 'prim') ?
                typeof value !== 'object' ?
                    preconditions.success(value) :
                    preconditions.failure('async', value) :
                (type === 'array') ?
                    Array.isArray(value) ?
                        preconditions.success(value) :
                        preconditions.failure('async', value) :
                    (typeof value !== type) ?
                        preconditions.failure('async', value) :
                        preconditions.success(value)), 100));

const user: Async.Preconditions<any, any> = {

    name: async('string'),
    age: async('number'),
    roles: async('string')

}

const shouldFailInvalidData = (condition: Precondition<object, object>) =>
    condition(invalidUser)
        .then(e =>
            must(e.takeLeft().explain())
                .eql({ name: 'async', age: 'async' }));

const shouldAllowValidData = (condition: Precondition<object, object>) =>
    condition(validUser).then(e => must(e.takeRight()).eql(validUser));

const unknownProperties = (condition: Precondition<object, object>, expected: object) =>
    condition(userWithAddtionalProperties)
        .then(e => must(e.takeRight()).eql(expected));

const shouldWorkWithNestedConditions = (condition: Precondition<object, object>) =>
    condition(validAccess)
        .then(r => must(r.takeRight()).eql(validAccess))
        .then(() => condition(invalidAccess))
        .then(r => must(r.takeLeft().explain())
            .eql({
                network: 'async', user: { roles: 'async' }, previous: { age: 'async' }
            }))

const shouldApplyEveryCondtion = (condition: Precondition<object, object>) =>
    condition
        (partialValidAccess)
        .then(r => must(r.takeLeft().explain({})).eql(partialValidAccessErrors));

describe('async', function() {

    describe('restrict', function() {

        const access: Async.Preconditions<any, any> = {

            id: async('number'),
            network: async('number'),
            user: every(wrap(isObject), restrict(user)),
            get previous() { return every(wrap(isObject), restrict(user)); }

        }

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

        const access: Async.Preconditions<any, any> = {

            id: async('number'),
            network: async('number'),
            user: every(wrap(isObject), disjoint(user)),
            get previous() { return every(wrap(isObject), disjoint(user)); }

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

        const access: Async.Preconditions<any, any> = {

            id: async('number'),
            network: async('number'),
            user: every(wrap(isObject), intersect(user)),
            get previous() { return every(wrap(isObject), intersect(user)); }

        }

        it('should fail invalid data', () => shouldFailInvalidData(intersect(user)));

        it('should allow valid data', () => shouldAllowValidData(intersect(user)));

        it('should exclude unknown properties',
            () => unknownProperties(intersect(user), validUser))

        it('should work with nested conditions',
            () => shouldWorkWithNestedConditions(intersect(access)))

        it('should apply to present properties only', () =>
            Async
                .intersect(access)
                (partialValidAccess)
                .then(r => must(r.takeRight()).eql(partialValidAccess))
                .then(() => intersect(access)(partialInvalidAccess))
                .then(r => must(r.takeLeft().explain()).eql(partialInvalidAccessErrors)))

    })

    describe('union', function() {

        const access: Async.Preconditions<any, any> = {

            id: async('number'),
            network: async('number'),
            user: every(wrap(isObject), union(user)),
            get previous() { return every(wrap(isObject), union(user)); }

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
                shouldFailInvalidData(every(wrap(isObject), map(async('prim')))));

        it('should allow valid data',
            () =>
                shouldAllowValidData(every(wrap(isObject), map(async('prim')))));

    });

});

