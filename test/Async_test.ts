import * as Promise from 'bluebird';
import * as must from 'must/register';
import * as Preconditions from '../src/Sync';
import { Async } from '../src/Sync';

const async = <A, B>(type: string) => (value: A): Async.Result<A, B> =>
    Promise.fromCallback(cb =>
        setTimeout(() => cb(null, (type === 'array') ?
            Array.isArray(value) ?
                Preconditions.valid(value) :
                Preconditions.fail('async', value) :
            (typeof value !== type) ?
                Preconditions.fail('async', value) :
                Preconditions.valid(value)), 100));


const conditions: Async.Preconditions<any, any> = {

    name: async('string'),
    age: async('number'),
    roles: async('string')

}

const nested: Async.Preconditions<any, any> = {

    id: async('number'),
    net: async('number'),
    nested: Async.map(conditions)

}

describe('Async', function() {

    describe('map', function() {

        it('should fail invalid data', function() {

            return Async.map(conditions)({ name: null, age: '', roles: 'roles' })
                .then(e =>
                    must(e.takeLeft().explain())
                        .eql({ name: 'async', age: 'async' }))

        });

        it('should low valid data ', () => {

            return Async
                .map(conditions)
                ({ name: 'name', age: 12, roles: 'rolled out' })
                .then(e => must(e.takeRight()).eql({ name: 'name', age: 12, roles: 'rolled out' }));

        });

        it('should work with nested conditions', () =>

            Async.
                map(nested)({
                    id: 24, net: 1, nested: { name: 'pat', age: 27, roles: 'any' }
                })
                .then(r => must(r.takeRight()).eql({
                    id: 24, net: 1, nested: { name: 'pat', age: 27, roles: 'any' }
                }))
                .then(() => Async.map(nested)({
                    id: 66, nested: { id: 4, name: 'lore', age: '24', roles: 'any' }
                }))
                .then(r => must(r.takeLeft().explain()).eql({
                    net: 'async', nested: { age: 'async' }
                })))

    });

});

describe('or', () => {

    let test = Async.or(async('string'), async('number'));

    it('should detect fails', () =>
        test([1]).then(e => must(e.takeLeft().explain()).eql('async')));

    it('should detect valids', () =>
        test(1).then(e => must(e.takeRight()).be(1)));

});

describe('and', () => {

    let test = Async.and(async('object'), async('array'));

    it('should detect fails', () =>
        test({}).then(e => must(e.takeLeft().explain()).eql('async')));

    it('should detect valids', () =>
        test([6]).then(e => must(e.takeRight()).eql([6])));

});

