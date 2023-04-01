import { assert } from '@quenk/test/lib/assert';

import { Type } from '@quenk/noni/lib/data/type';

import { PrimFailure } from '../src/result/failure';
import { succeed, fail } from '../src/result';
import { Precondition } from '../src';
import {
    notNull,
    optional,
    identity,
    discard,
    eq,
    when,
    whenTrue,
    every,
    or,
    and,
    anyOf,
    caseOf,
    match,
    whenFalse,
    reject
} from '../src';

const unwrap =
    <A, B>(p: () => Precondition<A, B>) =>
    (value: A) =>
        p()(value);

describe('index', function () {
    describe('notNull', function () {
        it('should fail if a value is not specified', function () {
            let x;

            assert(notNull('value').takeRight()).equal('value');
            assert(notNull(x).takeLeft()).be.instance.of(PrimFailure);
        });
    });

    describe('optional', () =>
        it('should pass on to the test when not null', () => {
            const test = (_: Type) => succeed('12');

            assert(optional(test)(undefined).takeRight()).be.undefined();
            assert(optional(test)('earth').takeRight()).equal('12');
        }));

    describe('eq', function () {
        it('should fail if the value is not equal', function () {
            assert(eq(23)(23).takeRight()).equal(23);
            assert(eq(23)('23').takeLeft()).be.instance.of(PrimFailure);
        });
    });

    describe('when', () =>
        it('should decide correctly', () => {
            const test = (n: number) => n === 12;
            const ok = (n: number) => succeed<number, number | string>(n);
            const notOk = (n: number) => succeed<number, string>(`Got ${n}`);

            assert(when(test, ok, notOk)(12).takeRight()).equal(12);
            assert(when(test, ok, notOk)(10).takeRight()).equal('Got 10');
        }));

    describe('whenTrue|False', () =>
        it('should decide correctly', () => {
            const double = (n: number) => succeed(n * 2);
            const half = (n: number) => succeed(n / 2);

            assert(whenTrue(true, double, half)(12).takeRight()).equal(24);
            assert(whenFalse(false, double, half)(12).takeRight()).equal(24);
        }));

    describe('or', () => {
        it('should act like a logical or', () => {
            const left = (_: Type) => fail('left', 'left');
            const right = (_: Type) => succeed('right');

            assert(or(left, right)(12).takeRight()).equal('right');
            assert(or(right, right)(12).takeRight()).equal('right');
        });

        it('should provide details about both when both fail', () => {
            const left = (_: Type) => fail('left', 'left');
            const right = (_: Type) => fail('right', 'right');

            assert(or(left, right)(12).takeLeft().explain()).equate({
                left: 'left',

                right: 'right'
            });
        });
    });

    describe('and', () => {
        it('should work like a logical and', () => {
            const left = (_: Type) => fail('left', 'left');
            const right = (_: Type) => succeed('right');

            assert(and(right, left)(12).takeLeft().explain()).equal('left');
            assert(and(left, right)(12).takeLeft().explain()).equal('left');
            assert(or(right, right)(12).takeRight()).equal('right');
        });
    });

    describe('every', function () {
        const fails = (m: string) => (v: Type) => fail(m, v);
        const up = (n: number) => succeed(n + 1);

        it('should stop on first failure', () => {
            assert(
                every(up, up, up, fails('away'), up, up)(1).takeLeft().explain()
            ).equal('away');
        });

        it('should run everything', () => {
            assert(
                every(up, up, up, up, up, up, up, up, up)(1).takeRight()
            ).equal(10);
        });
    });

    describe('anyOf', function () {
        const no =
            (msg = 'no') =>
            (val: number) =>
                fail(msg, val);

        const yes = (val: number) => succeed(val + 1);

        it('should continue', () => {
            assert(anyOf(no(), no(), yes, no())(1).takeRight()).equal(2);
        });

        it('should return the last error', () => {
            assert(
                anyOf(no('1'), no('2'), no('3'))(1).takeLeft().explain()
            ).equal('3');
        });
    });

    describe('unwrap', function () {
        it('should apply the wrapped precondition', function () {
            let p = unwrap(
                () => (n: number) =>
                    n === 12 ? succeed('success') : fail('insuccess', 12)
            );

            assert(p(6).takeLeft().message).equal('insuccess');
            assert(p(12).takeRight()).equal('success');
        });
    });

    describe('caseOf', function () {
        it('should match primitives', function () {
            let s = caseOf('hello', () => succeed('string'));
            let scons = caseOf(String, () => succeed('String'));

            let n = caseOf(12, () => succeed('number'));
            let ncons = caseOf(Number, () => succeed('Number'));

            let b = caseOf(false, () => succeed('boolean'));
            let bcons = caseOf(Boolean, () => succeed('Boolean'));

            assert(s('hello').takeRight()).equal('string');
            assert(s('chello').takeLeft().explain()).equal('caseOf');
            assert(scons('ferimpusds').takeRight()).equal('String');
            assert(
                scons(<Type>12)
                    .takeLeft()
                    .explain()
            ).equal('caseOf');

            assert(n(12).takeRight()).equal('number');
            assert(n('12').takeLeft().explain()).equal('caseOf');
            assert(ncons(123243).takeRight()).equal('Number');
            assert(
                ncons(<Type>'adf')
                    .takeLeft()
                    .explain()
            ).equal('caseOf');

            assert(b(false).takeRight()).equal('boolean');
            assert(b('false').takeLeft().explain()).equal('caseOf');
            assert(bcons(true).takeRight()).equal('Boolean');
            assert(
                bcons(<Type>Date)
                    .takeLeft()
                    .explain()
            ).equal('caseOf');
        });

        it('should work with shapes', function () {
            let p = caseOf(
                {
                    name: String,
                    value: 12,
                    config: { flags: Array, active: Boolean }
                },
                () => succeed('shapes')
            );

            assert(p('gum').takeLeft().explain()).equal('caseOf');
            assert(p({}).takeLeft().explain()).equal('caseOf');
            assert(p([]).takeLeft().explain()).equal('caseOf');
            assert(p({ name: 'Hup', value: 12 }).takeLeft().explain()).equal(
                'caseOf'
            );
            assert(
                p({ name: 'Zum', value: 12, config: { flags: [], active: 12 } })
                    .takeLeft()
                    .explain()
            ).equal('caseOf');
            assert(
                p({
                    name: 'Zum',
                    value: 12,
                    config: { flags: [], active: false }
                }).takeRight()
            ).equal('shapes');
        });
    });

    describe('match', function () {
        it('should only run one case', function () {
            let p = match(
                caseOf(true, v => succeed(`${v} -> true`)),
                caseOf(String, v => succeed<string, string>(`${v} -> String`)),
                caseOf({ name: String }, v => succeed(`${v} -> name`)),
                caseOf('quenk', v => succeed(`${v} -> quenk`))
            );

            assert(p('quenk').takeRight()).equal('quenk -> String');
        });
    });

    describe('identity', () =>
        it('should succeed with the value given', () =>
            assert(identity(12).takeRight()).equal(12)));

    describe('discard', () =>
        it('should succeed with undefined', () =>
            assert(discard(12).takeRight()).equal(undefined)));

    describe('reject', () =>
        it('should fail all the time', () =>
            assert(reject('testing')(12).takeLeft().explain()).equal(
                'testing'
            )));
});
