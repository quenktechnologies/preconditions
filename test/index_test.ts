import * as must from 'must/register';
import {
    Failure,
    success,
    failure,
    notNull,
    optional,
    equals,
    when,
    whenTrue,
    every,
    or,
    and,
    unwrap,
    whenFalse
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
})

describe('Failure', function() {

    let fail;
    let templates: { [key: string]: string };

    beforeEach(function() {

        fail = new Failure('string', 12, { feels: 'joys' });
        templates = { string: 'Input "{$value}" is not a number! I no feel {feels}{punc}' };

    });

    describe('explain', function() {

        it('should explain templates', function() {

            must(fail.explain(templates, { punc: '!' }))
                .be('Input "12" is not a number! I no feel joys!');

        });

    });

});
