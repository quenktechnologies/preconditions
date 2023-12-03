import { assert } from '@quenk/test/lib/assert';

import { Type } from '@quenk/noni/lib/data/type';
import { Value } from '@quenk/noni/lib/data/jsonx';

import {
    restrict,
    disjoint,
    union,
    intersect,
    map,
    merge,
    mergeRight,
    exclude,
    schemaProperties
} from '../lib/record';
import { isRecord } from '../lib/record';
import { Preconditions } from '../lib';
import { Precondition, every } from '../lib';
import { succeed, fail } from '../lib/result';
import { typeOf } from '../lib';
import { runPrecTests } from './tests';

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

const partialValidAccess = {
    network: 1,
    user: { age: 12 },
    previous: { age: 12 }
};

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
    network: 'one',
    user: { age: 'twelve' },
    previous: { age: [1] }
};

const partialInvalidAccessErrors = {
    network: 'check',
    user: { age: 'check' },
    previous: { age: 'check' }
};

const noDataErrors = {
    name: 'check',
    age: 'check',
    roles: 'check'
};

const check =
    <A>(type: string): Precondition<A, A> =>
    (value: A) =>
        type === 'prim'
            ? typeof value !== 'object'
                ? succeed<A, A>(value)
                : fail<A, A>('check', value)
            : type === 'array'
            ? Array.isArray(value)
                ? succeed<A, A>(value)
                : fail<A, A>('check', value)
            : typeof value !== type
            ? fail<A, A>('check', value)
            : succeed<A, A>(value);

const user: Preconditions<Type, Type> = {
    name: check('string'),
    age: check('number'),
    roles: check('string')
};

const shouldFailInvalidData = (condition: Precondition<object, object>) =>
    assert(condition(invalidUser).takeLeft().explain()).equate({
        name: 'check',
        age: 'check'
    });

const shouldAllowValidData = (condition: Precondition<object, object>) =>
    assert(condition(validUser).takeRight()).equate(validUser);

const unknownProperties = (
    condition: Precondition<object, object>,
    expected: object
) =>
    assert(condition(userWithAddtionalProperties).takeRight()).equate(expected);

const shouldWorkWithNestedConditions = (
    condition: Precondition<object, object>
) => {
    assert(condition(validAccess).takeRight()).equate(validAccess);

    assert(condition(invalidAccess).takeLeft().explain()).equate({
        network: 'check',
        user: { roles: 'check' },
        previous: { age: 'check' }
    });
};

const shouldApplyEveryCondtion = (condition: Precondition<object, object>) =>
    assert(condition(partialValidAccess).takeLeft().explain({})).equate(
        partialValidAccessErrors
    );

const shouldFailtWhenNoData = (condition: Precondition<object, object>) =>
    assert(condition({}).takeLeft().explain({})).equate(noDataErrors);

describe('record', function () {
    describe('isRecord', function () {
        it('should work', function () {
            assert(isRecord({}).takeRight()).equate({});

            assert(isRecord('z').takeLeft().explain({})).equal('isRecord');

            assert(isRecord([]).takeLeft().explain({})).equal('isRecord');
        });
    });

    describe('restrict', function () {
        const access: Preconditions<Type, Type> = {
            id: check('number'),
            network: check('number'),
            user: every(isRecord, restrict(user)),
            get previous() {
                return every(isRecord, restrict(user));
            }
        };

        it('should fail when no data provided ', () =>
            shouldFailtWhenNoData(restrict(user)));

        it('should fail invalid data', () =>
            shouldFailInvalidData(restrict(user)));

        it('should allow valid data', () =>
            shouldAllowValidData(restrict(user)));

        it('should exclude unspecified properties', () =>
            unknownProperties(restrict(user), validUser));

        it('should work with nested conditions', () =>
            shouldWorkWithNestedConditions(restrict(access)));

        it('should apply every precondition', () =>
            shouldApplyEveryCondtion(restrict(access)));
    });

    describe('disjoint', function () {
        const access: Preconditions<Type, Type> = {
            id: check('number'),
            network: check('number'),
            user: every(isRecord, disjoint(user)),
            get previous() {
                return every(isRecord, disjoint(user));
            }
        };

        it('should fail invalid data', () =>
            shouldFailInvalidData(disjoint(user)));

        it('should allow valid data', () =>
            shouldAllowValidData(disjoint(user)));

        it('should keep unknown properties', () =>
            unknownProperties(disjoint(user), userWithAddtionalProperties));

        it('should work with nested conditions', () =>
            shouldWorkWithNestedConditions(disjoint(access)));
    });

    describe('intersect', function () {
        const access: Preconditions<Type, Type> = {
            id: check('number'),
            network: check('number'),
            user: every(isRecord, intersect(user)),
            get previous() {
                return every(isRecord, intersect(user));
            }
        };

        it('should fail invalid data', () =>
            shouldFailInvalidData(intersect(user)));

        it('should allow valid data', () =>
            shouldAllowValidData(intersect(user)));

        it('should exclude unknown properties', () =>
            unknownProperties(intersect(user), validUser));

        it('should work with nested conditions', () =>
            shouldWorkWithNestedConditions(intersect(access)));

        it('should apply to present properties only', () => {
            assert(intersect(access)(partialValidAccess).takeRight()).equate(
                partialValidAccess
            );

            assert(
                intersect(access)(partialInvalidAccess).takeLeft().explain()
            ).equate(partialInvalidAccessErrors);
        });
    });

    describe('union', function () {
        const access: Preconditions<Type, Type> = {
            id: check('number'),
            network: check('number'),
            user: every(isRecord, union(user)),
            get previous() {
                return every(isRecord, union(user));
            }
        };

        it('should fail invalid data', () =>
            shouldFailInvalidData(union(user)));

        it('should allow valid data', () => shouldAllowValidData(union(user)));

        it('should keep unknown properties', () =>
            unknownProperties(union(user), userWithAddtionalProperties));

        it('should work with nested conditions', () =>
            shouldWorkWithNestedConditions(union(access)));

        it('should apply every precondition', () =>
            shouldApplyEveryCondtion(union(access)));
    });

    const inc = (val: number) => succeed<Value, Value>(++val);

    const id = (val: number) => succeed<Value, Value>(val);

    const bad = (val: number) => fail<Value, Value>('bad', val);

    // TODO: Migrate remaining tests.
    runPrecTests({
        map: [
            {
                name: 'flat',
                precondition: map(typeOf('string')),
                cases: [
                    { value: { name: 'me' } },
                    { value: 'me', notOk: 'object' },
                    { value: [], notOk: 'object' },
                    { value: { name: 1 }, notOk: { name: 'string' } }
                ]
            },

            {
                name: 'nested (2)',
                precondition: map(map(typeOf('string'))),
                cases: [
                    {
                        value: {
                            user: { name: 'pat' },
                            previous: { roles: 'any' }
                        }
                    },
                    {
                        value: {
                            user: { age: 27 },
                            previous: { age: 26 }
                        },
                        notOk: {
                            user: { age: 'string' },
                            previous: { age: 'string' }
                        }
                    },
                    {
                        value: {
                            user: { name: 'pat' },
                            previous: { age: 26 }
                        },
                        notOk: { previous: { age: 'string' } }
                    },
                    {
                        value: {
                            id: 12,
                            user: { name: 'pat' },
                            previous: { roles: 'any' }
                        },
                        notOk: { id: 'object' }
                    },
                    { value: 'me', notOk: 'object' },
                    { value: [], notOk: 'object' }
                ]
            },

            {
                name: 'nested (3)',
                precondition: map(map(map(typeOf('string')))),
                cases: [
                    {
                        value: {
                            users: { user: { name: 'pat' } },
                            states: { previous: { roles: 'any' } }
                        }
                    },
                    {
                        value: {
                            users: { user: { age: 27 } },
                            states: { previous: { age: 26 } }
                        },
                        notOk: {
                            users: { user: { age: 'string' } },
                            states: { previous: { age: 'string' } }
                        }
                    },
                    {
                        value: {
                            users: { user: { name: 'pat' } },
                            states: { previous: { age: 26 } }
                        },
                        notOk: { states: { previous: { age: 'string' } } }
                    },
                    {
                        value: {
                            ids: 12,
                            users: { user: { name: 'pat' } },
                            states: { previous: { roles: 'any' } }
                        },
                        notOk: { ids: 'object' }
                    },
                    {
                        value: {
                            ids: { id: 12 },
                            users: { user: { name: 'pat' } },
                            states: { previous: { roles: 'any' } }
                        },
                        notOk: { ids: { id: 'object' } }
                    },
                    { value: 'me', notOk: 'object' },
                    { value: [], notOk: 'object' }
                ]
            }
        ],
        schemaProperties: [
            {
                name: 'should work when additionalProperties unspecified',
                precondition: schemaProperties(restrict, {
                    a: inc,
                    b: id,
                    c: inc
                }),
                cases: [
                    {
                        value: { a: 1, b: 1, c: 1 },
                        ok: {
                            a: 2,
                            b: 1,
                            c: 2
                        }
                    }
                ]
            },
            {
                name: 'should work when properties empty',
                precondition: schemaProperties(restrict, {}, inc),
                cases: [
                    {
                        value: { a: 1, b: 1, c: 1 },
                        ok: {
                            a: 2,
                            b: 2,
                            c: 2
                        }
                    }
                ]
            },
            {
                name: 'should work with both',
                precondition: schemaProperties(
                    restrict,
                    { a: inc, b: id, c: inc },
                    inc
                ),
                cases: [
                    {
                        value: { a: 1, b: 1, c: 1, d: 1 },
                        ok: { a: 2, b: 1, c: 2, d: 2 }
                    }
                ]
            },
            {
                name: 'should pass through object if no properties or additionalProperties',
                precondition: schemaProperties(restrict, {}),
                cases: [{ value: { a: 1, b: 1, c: 1 } }]
            },
            {
                name: 'should yield properties failures',
                precondition: schemaProperties(restrict, {
                    a: inc,
                    b: id,
                    c: bad
                }),
                cases: [
                    {
                        value: { a: 1, b: 1, c: 1 },
                        notOk: {
                            c: 'bad'
                        }
                    }
                ]
            },
            {
                name: 'should yield additionalProperties Failures',
                precondition: schemaProperties(restrict, {}, bad),
                cases: [
                    {
                        value: { a: 1 },
                        notOk: {
                            a: 'bad'
                        }
                    }
                ]
            }
        ]
    });

    describe('merge', () => {
        it('should merge objects', () => {
            assert(merge({ x: 1 })({ y: 2 }).takeRight()).equate({
                x: 1,
                y: 2
            });
        });

        it('should merge left', () => {
            assert(merge({ x: 1 })({ x: 2 }).takeRight()).equate({ x: 2 });
        });
    });

    describe('mergeRight', () => {
        it('should merge objects', () => {
            assert(mergeRight({ x: 1 })({ y: 2 }).takeRight()).equate({
                x: 1,
                y: 2
            });
        });

        it('should merge right', () => {
            assert(mergeRight({ x: 1 })({ x: 2 }).takeRight()).equate({ x: 1 });
        });
    });

    describe('exclude', () => {
        it('should exclude the specified keys', () => {
            assert(
                exclude(['a', 'c', 'd'])({ a: 1, b: 1, c: 1, d: 1 }).takeRight()
            ).equate({ b: 1 });
        });
    });
});
