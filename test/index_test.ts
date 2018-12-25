import { must } from '@quenk/must';
import { PrimFailure } from '../src/result/failure';
import { succeed, fail } from '../src/result';
import { Precondition } from '../src';
import {
    notNull,
    optional,
    identity,
    eq,
    when,
    whenTrue,
    every,
    or,
    and,
    caseOf,
    match,
    whenFalse,
    reject
} from '../src';

const unwrap =
    <A, B>(p: () => Precondition<A, B>) => (value: A) => p()(value);

describe('index', function() {

    describe('notNull', function() {

        it('should fail if a value is not specified', function() {

            let x;

            must(notNull('value').takeRight()).equal('value');
            must(notNull(x).takeLeft()).be.instance.of(PrimFailure);

        });

    });

    describe('optional', () =>
        it('should pass on to the test when not null', () => {

            const test = (_: any) => succeed('12');

            must(optional(test)(undefined).takeRight()).be.undefined()
            must(optional(test)('earth').takeRight()).equal('12')

        }))

    describe('eq', function() {

        it('should fail if the value is not equal', function() {

            must(eq(23)(23).takeRight()).equal(23);
            must(eq(23)('23').takeLeft()).be.instance.of(PrimFailure);

        });

    });

    describe('when', () =>
        it('should decide correctly', () => {

            const test = (n: number) => n === 12;
            const ok = (n: number) => succeed<number, number | string>(n);
            const notOk = (n: number) => succeed<number, string>(`Got ${n}`);

            must(when(test, ok, notOk)(12).takeRight()).equal(12);
            must(when(test, ok, notOk)(10).takeRight()).equal('Got 10');

        }));

    describe('whenTrue|False', () =>
        it('should decide correctly', () => {

            const double = (n: number) => succeed(n * 2);
            const half = (n: number) => succeed(n / 2);

            must(whenTrue(true, double, half)(12).takeRight()).equal(24);
            must(whenFalse(false, double, half)(12).takeRight()).equal(24);

        }));

    describe('or', () => {

        it('should act like a logical or', () => {

            const left = (_: any) => fail('left', 'left');
            const right = (_: any) => succeed('right');

            must(or(left, right)(12).takeRight()).equal('right');
            must(or(right, right)(12).takeRight()).equal('right');

        })

        it('should provide details about both when both fail', () => {

            const left = (_: any) => fail('left', 'left');
            const right = (_: any) => fail('right', 'right');

            must(or(left, right)(12).takeLeft().explain()).equate({

                first: 'left',

                second: 'right'

            });


        });

    })

    describe('and', () => {
        it('should work like a logical and', () => {

            const left = (_: any) => fail('left', 'left');
            const right = (_: any) => succeed('right');

            must(and(right, left)(12).takeLeft().explain()).equal('left');
            must(and(left, right)(12).takeLeft().explain()).equal('left');
            must(or(right, right)(12).takeRight()).equal('right');

        })

    })

    describe('every', function() {

        const fails = (m: string) => (v: any) => fail(m, v);
        const up = (n: number) => succeed(n + 1);

        it('should stop on first failure', () => {

            must(every(up, up, up, fails('away'), up, up)(1).takeLeft().explain())
                .equal('away');

        });

        it('should run everything', () => {

            must(every(up, up, up, up, up, up, up, up, up)(1).takeRight())
                .equal(10);

        });

    });

    describe('unwrap', function() {

        it('should apply the wrapped precondition', function() {

            let p = unwrap(() => (n: number) => (n === 12) ?
                succeed('success') : fail('insuccess', 12));

            must(p(6).takeLeft().message).equal('insuccess');
            must(p(12).takeRight()).equal('success');

        });

    });

    describe('caseOf', function() {

        it('should match primitives', function() {

            let s = caseOf('hello', () => succeed('string'));
            let scons = caseOf(String, () => succeed('String'));

            let n = caseOf(12, () => succeed('number'));
            let ncons = caseOf(Number, () => succeed('Number'))

            let b = caseOf(false, () => succeed('boolean'));
            let bcons = caseOf(Boolean, () => succeed('Boolean'));

            must(s('hello').takeRight()).equal('string');
            must(s('chello').takeLeft().explain()).equal('caseOf');
            must(scons('ferimpusds').takeRight()).equal('String');
            must(scons(<any>12).takeLeft().explain()).equal('caseOf');

            must(n(12).takeRight()).equal('number');
            must(n('12').takeLeft().explain()).equal('caseOf');
            must(ncons(123243).takeRight()).equal('Number');
            must(ncons(<any>'adf').takeLeft().explain()).equal('caseOf');

            must(b(false).takeRight()).equal('boolean');
            must(b('false').takeLeft().explain()).equal('caseOf');
            must(bcons(true).takeRight()).equal('Boolean');
            must(bcons(<any>Date).takeLeft().explain()).equal('caseOf');

        });

        it('should work with shapes', function() {

            let p =
                caseOf({
                    name: String,
                    value: 12, config: { flags: Array, active: Boolean }
                }, () => succeed('shapes'));

            must(p('gum').takeLeft().explain()).equal('caseOf');
            must(p({}).takeLeft().explain()).equal('caseOf');
            must(p([]).takeLeft().explain()).equal('caseOf');
            must(p({ name: 'Hup', value: 12 }).takeLeft().explain()).equal('caseOf');
            must(p({ name: 'Zum', value: 12, config: { flags: [], active: 12 } })
                .takeLeft().explain()).equal('caseOf');
            must(p({ name: 'Zum', value: 12, config: { flags: [], active: false } })
                .takeRight()).equal('shapes');

        });

    });

    describe('match', function() {

        it('should only run one case', function() {

            let p = match(
                caseOf(true, v => succeed(`${v} -> true`)),
                caseOf(String, v => succeed<string, string>(`${v} -> String`)),
                caseOf({ name: String }, v => succeed(`${v} -> name`)),
                caseOf('quenk', v => succeed(`${v} -> quenk`)));

            must(p('quenk').takeRight()).equal('quenk -> String');

        });

    });

    describe('identity', () =>
        it('should succeed with the value given', () =>
            must(identity(12).takeRight()).equal(12)));

    describe('reject', () =>
        it('should fail all the time', () =>
            must((reject('testing')(12)).takeLeft().explain()).equal('testing')));

})
