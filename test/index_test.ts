import * as must from 'must/register';
import { Failure } from '../src/failure';
import { success, failure } from '../src/result';
import { unwrap } from '../src/util';
import {
    notNull,
    optional,
    identity,
    equals,
    when,
    whenTrue,
    every,
    or,
    and,
    caseOf,
    match,
    whenFalse,
    fail
} from '../src';

describe('index', function() {

    describe('notNull', function() {

        it('should fail if a value is not specified', function() {

            let x;

            must(notNull('value').takeRight()).be('value');
            must(notNull(x).takeLeft()).be.instanceOf(Failure);

        });

    });

    describe('optional', () =>
        it('should pass on to the test when not null', () => {

            const test = (_: any) => success('12');

            must(optional(test)(undefined).takeRight()).eql(undefined)
            must(optional(test)('earth').takeRight()).be('12')

        }))

    describe('equals', function() {

        it('should fail if the value is not equal', function() {

            must(equals(23)(23).takeRight()).be(23);
            must(equals(23)('23').takeLeft()).be.instanceOf(Failure);

        });

    });

    describe('when', () =>
        it('should decide correctly', () => {

            const test = (n: number) => n === 12;
            const ok = (n: number) => success<number, number | string>(n);
            const notOk = (n: number) => success<number, string>(`Got ${n}`);

            must(when(test, ok, notOk)(12).takeRight()).eql(12);
            must(when(test, ok, notOk)(10).takeRight()).eql('Got 10');

        }));

    describe('whenTrue|False', () =>
        it('should decide correctly', () => {

            const double = (n: number) => success(n * 2);
            const half = (n: number) => success(n / 2);

            must(whenTrue(true, double, half)(12).takeRight()).eql(24);
            must(whenFalse(false, double, half)(12).takeRight()).eql(24);

        }));

    describe('or', () => {
        it('should act like a logical or', () => {

            const left = (_: any) => failure('left', 'left');
            const right = (_: any) => success('right');

            must(or(left, right)(12).takeRight()).eql('right');
            must(or(right, right)(12).takeRight()).eql('right');

        })

    })

    describe('and', () => {
        it('should work like a logical and', () => {

            const left = (_: any) => failure('left', 'left');
            const right = (_: any) => success('right');

            must(and(right, left)(12).takeLeft().explain()).be('left');
            must(and(left, right)(12).takeLeft().explain()).be('left');
            must(or(right, right)(12).takeRight()).eql('right');

        })

    })

    describe('every', function() {

        const fails = (m: string) => (v: any) => failure(m, v);
        const up = (n: number) => success(n + 1);

        it('should stop on first failure', () => {

            must(every(up, up, up, fails('away'), up, up)(1).takeLeft().explain()).be('away');

        });

        it('should run everything', () => {

            must(every(up, up, up, up, up, up, up, up, up)(1).takeRight()).be(10);

        });

    });

    describe('unwrap', function() {

        it('should apply the wrapped precondition', function() {

            let p = unwrap(() => (n: number) => (n === 12) ?
                success('success') : failure('insuccess', 12));

            must(p(6).takeLeft().message).be('insuccess');
            must(p(12).takeRight()).be('success');

        });

    });

    describe('caseOf', function() {

        it('should match primitives', function() {

            let s = caseOf('hello', () => success('string'));
            let scons = caseOf(String, () => success('String'));

            let n = caseOf(12, () => success('number'));
            let ncons = caseOf(Number, () => success('Number'))

            let b = caseOf(false, () => success('boolean'));
            let bcons = caseOf(Boolean, () => success('Boolean'));

            must(s('hello').takeRight()).eql('string');
            must(s('chello').takeLeft().explain()).eql('caseOf');
            must(scons('ferimpusds').takeRight()).eql('String');
            must(scons(<any>12).takeLeft().explain()).eql('caseOf');

            must(n(12).takeRight()).eql('number');
            must(n('12').takeLeft().explain()).eql('caseOf');
            must(ncons(123243).takeRight()).eql('Number');
            must(ncons(<any>'adf').takeLeft().explain()).eql('caseOf');

            must(b(false).takeRight()).eql('boolean');
            must(b('false').takeLeft().explain()).eql('caseOf');
            must(bcons(true).takeRight()).eql('Boolean');
            must(bcons(<any>Date).takeLeft().explain()).eql('caseOf');

        });

        it('should work with shapes', function() {

            let p =
                caseOf({
                    name: String,
                    value: 12, config: { flags: Array, active: Boolean }
                }, () => success('shapes'));

            must(p('gum').takeLeft().explain()).eql('caseOf');
            must(p({}).takeLeft().explain()).eql('caseOf');
            must(p([]).takeLeft().explain()).eql('caseOf');
            must(p({ name: 'Hup', value: 12 }).takeLeft().explain()).eql('caseOf');
            must(p({ name: 'Zum', value: 12, config: { flags: [], active: 12 } }).takeLeft().explain()).eql('caseOf');
            must(p({ name: 'Zum', value: 12, config: { flags: [], active: false } }).takeRight()).eql('shapes');

        });

    });

    describe('match', function() {

        it('should only run one case', function() {

            let p = match(
                caseOf(true, v => success(`${v} -> true`)),
                caseOf(String, v => success<string, string>(`${v} -> String`)),
                caseOf({ name: String }, v => success(`${v} -> name`)),
                caseOf('quenk', v => success(`${v} -> quenk`)));

            must(p('quenk').takeRight()).eql('quenk -> String');

        });

    });

    describe('identity', () =>
        it('should succeed with the value given', () =>
            must(identity(12).takeRight()).eql(12)));

    describe('fail', () =>
        it('should fail all the time', () =>
            must((fail('testing')(12)).takeLeft().explain()).be('testing')));

})
