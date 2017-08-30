import * as Promise from 'bluebird';
import * as must from 'must/register';
import * as Map from '../src/Map';
import { Async } from '../src/Map';

const async = <A, B>(type: string) => ({

    apply(value: A): Async.Result<A, B> {

        return Promise.fromCallback(cb => {

            setTimeout(() => cb(null, (type === 'array') ?
                Array.isArray(value) ?
                    Map.valid(value) :
                    Map.fail('async', value) :
                (typeof value !== type) ?
                    Map.fail('async', value) :
                    Map.valid(value)), 100)

        });

    }

})

class Conditions<A, B> extends Async.Map<A, B> {

    name = async('string')
    age = async('number')
    roles = async('string')

}

class Nested<A, B> extends Async.Map<A, B>{

    id = async('number')
    net = async('number')
    nested = new Conditions()

}

const map = new Conditions();
const nested = new Nested();
const hashed = new Async.Hash({ id: async('number'), net: async('number') });

describe('Map', function() {

    describe('apply', function() {

        it('should fail invalid data', function() {

            return map
                .apply({ name: null, age: '', roles: 'roles' })
                .then(e =>
                    must(e.takeLeft().expand())
                        .eql({ name: 'async', age: 'async' }))

        });

        it('should low valid data ', () => {

            return map
                .apply({ name: 'name', age: 12, roles: 'rolled out' })
                .then(e => must(e.takeRight()).eql({ name: 'name', age: 12, roles: 'rolled out' }));

        });

        it('should work with nested conditions', () =>
            nested
                .apply({
                    id: 24, net: 1, nested: { name: 'pat', age: 27, roles: 'any' }
                })
                .then(r => must(r.takeRight()).eql({
                    id: 24, net: 1, nested: { name: 'pat', age: 27, roles: 'any' }
                }))
                .then(() => nested.apply({
                    id: 66, nested: { id: 4, name: 'lore', age: '24', roles: 'any' }
                }))
                .then(r => must(r.takeLeft().expand()).eql({
                    net: 'async', nested: { age: 'async' }
                })))

    });

});


describe('Hash', function() {

    it('should fail invalid data', function() {

        return hashed
            .apply({ id: null, age: '' })
            .then(e =>
                must(e.takeLeft().expand())
                    .eql({ id: 'async', net: 'async' }))

    });

    it('should low valid data ', () => {

        return hashed
            .apply({ id: 12, net: 12, roles: 'rolled out' })
            .then(e => must(e.takeRight()).eql({ id: 12, net: 12 }));

    });

});

describe('Or', () => {

    let test = Async.or(async('string'), async('number'));

    it('should detect fails', () =>
        test.apply([1]).then(e => must(e.takeLeft().expand()).eql('async')));

    it('should detect valids', () =>
        test.apply(1).then(e => must(e.takeRight()).be(1)));

});

describe('And', () => {

    let test = Async.and(async('object'), async('array'));

    it('should detect fails', () =>
        test.apply({}).then(e => must(e.takeLeft().expand()).eql('async')));

    it('should detect valids', () =>
        test.apply([6]).then(e => must(e.takeRight()).eql([6])));

});

