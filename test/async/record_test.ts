import * as Async from '../../src/async/record';

import { assert } from '@quenk/test/lib/assert';

import {
    Future,
    toPromise,
    fromCallback
} from '@quenk/noni/lib/control/monad/future';
import { Type } from '@quenk/noni/lib/data/type';
import { Value } from '@quenk/noni/lib/data/jsonx';

import {
    restrict,
    disjoint,
    union,
    intersect,
    map,
    schemaProperties
} from '../../src/async/record';
import { isRecord } from '../../src/record';
import { every, async as wrap } from '../../src/async';
import { Precondition, Preconditions } from '../../src/async';
import { Result, succeed, fail } from '../../src/result';
import { runPrecTests } from '../tests';

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
    network: 'one',
    user: { age: 'twelve' },
    previous: { age: [1] }
};

const partialInvalidAccessErrors = {
    network: 'async',
    user: { age: 'async' },
    previous: { age: 'async' }
};

const async =
    <A>(type: string) =>
    (value: A): Future<Result<A, Type>> =>
        fromCallback(cb =>
            setTimeout(
                () =>
                    cb(
                        null,
                        type === 'prim'
                            ? typeof value !== 'object'
                                ? succeed(value)
                                : fail('async', value)
                            : type === 'array'
                            ? Array.isArray(value)
                                ? succeed(value)
                                : fail('async', value)
                            : typeof value !== type
                            ? fail('async', value)
                            : succeed(value)
                    ),
                100
            )
        );

const user: Preconditions<Type, Type> = {
    name: async('string'),
    age: async('number'),
    roles: async('string')
};

const shouldFailInvalidData = (condition: Precondition<object, object>) =>
    toPromise(condition(invalidUser)).then(e =>
        assert(e.takeLeft().explain()).equate({ name: 'async', age: 'async' })
    );

const shouldAllowValidData = (condition: Precondition<object, object>) =>
    condition(validUser).map(e => assert(e.takeRight()).equate(validUser));

const unknownProperties = (
    condition: Precondition<object, object>,
    expected: object
) =>
    condition(userWithAddtionalProperties).map(e =>
        assert(e.takeRight()).equate(expected)
    );

const shouldWorkWithNestedConditions = (
    condition: Precondition<object, object>
) =>
    condition(validAccess)
        .map(r => assert(r.takeRight()).equate(validAccess))
        .chain(() => condition(invalidAccess))
        .map(r =>
            assert(r.takeLeft().explain()).equate({
                network: 'async',
                user: { roles: 'async' },
                previous: { age: 'async' }
            })
        );

const shouldApplyEveryCondtion = (condition: Precondition<object, object>) =>
    condition(partialValidAccess).map(r =>
        assert(r.takeLeft().explain({})).equate(partialValidAccessErrors)
    );

describe('async', function () {
    describe('restrict', function () {
        const access: Preconditions<Type, Type> = {
            id: async('number'),
            network: async('number'),
            user: every(wrap(isRecord), restrict(user)),
            get previous() {
                return every(wrap(isRecord), restrict(user));
            }
        };

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
            id: async('number'),
            network: async('number'),
            user: every(wrap(isRecord), disjoint(user)),
            get previous() {
                return every(wrap(isRecord), disjoint(user));
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
            id: async('number'),
            network: async('number'),
            user: every(wrap(isRecord), intersect(user)),
            get previous() {
                return every(wrap(isRecord), intersect(user));
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

        it('should apply to present properties only', () =>
            Async.intersect(access)(partialValidAccess)
                .map(r => assert(r.takeRight()).equate(partialValidAccess))
                .chain(() => intersect(access)(partialInvalidAccess))
                .map(r =>
                    assert(r.takeLeft().explain()).equate(
                        partialInvalidAccessErrors
                    )
                ));
    });

    describe('union', function () {
        const access: Preconditions<Type, Type> = {
            id: async('number'),
            network: async('number'),
            user: every(wrap(isRecord), union(user)),
            get previous() {
                return every(wrap(isRecord), union(user));
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

    describe('map', function () {
        it('should fail invalid data', () =>
            shouldFailInvalidData(every(wrap(isRecord), map(async('prim')))));

        it('should allow valid data', () =>
            shouldAllowValidData(every(wrap(isRecord), map(async('prim')))));
    });

    const inc = wrap((val: number) => succeed<Value, Value>(++val));

    const id = wrap((val: number) => succeed<Value, Value>(val));

    const bad = wrap((val: number) => fail<Value, Value>('bad', val));

    // TODO: migrate other tests
    runPrecTests({
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
                name: 'should yield the object if no properties or additionalProperties',
                precondition: schemaProperties(restrict, {}),
                cases: [{ value: { a: 1, b: 1, c: 1 }  }]
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
});
