import { must } from '@quenk/must';
import { toPromise, pure } from '@quenk/noni/lib/control/monad/future';
import { succeed, fail } from '../../src/result';
import {
    optional,
    caseOf,
    match,
    identity,
    or,
    reject
} from '../../src/async';

describe('async', function() {

    describe('optional', () =>
        it('should not run the test if the value is null', () =>
            toPromise(optional(<any>12)(undefined))
                .then(r => must(r.takeRight()).equal(undefined))
                .then(() => toPromise(optional(() => pure(succeed(12)))('earth')))
                .then(r => must(r.takeRight()).equal(12))))

    describe('caseOf', function() {

        it('should match primitives', () =>

            toPromise(pure([
                caseOf('hello', () => pure(succeed('string'))),
                caseOf(String, () => pure(succeed('String'))),
                caseOf(12, () => pure(succeed('number'))),
                caseOf(Number, () => pure(succeed('Number'))),
                caseOf(false, () => pure(succeed('boolean'))),
                caseOf(Boolean, () => pure(succeed('Boolean'))),
            ]))
                .then(([s, scons, n, ncons, b, bcons]) =>
                    toPromise(s('hello'))
                        .then(r => must(r.takeRight()).equal('string'))
                        .then(() => toPromise(s('chello')))
                        .then(r => must(r.takeLeft().explain()).equal('caseOf'))
                        .then(() => toPromise(scons('ferimpusds')))
                        .then(r => must(r.takeRight()).equal('String'))
                        .then(() => toPromise(scons(<any>12)))
                        .then(r => must(r.takeLeft().explain()).equal('caseOf'))
                        .then(() => toPromise(n(12)))
                        .then(r => must(r.takeRight()).equal('number'))
                        .then(() => toPromise(n('12')))
                        .then(r => must(r.takeLeft().explain()).equal('caseOf'))
                        .then(() => toPromise(ncons(123243)))
                        .then(r => must(r.takeRight()).equal('Number'))
                        .then(() => toPromise(ncons(<any>'adf')))
                        .then(r => must(r.takeLeft().explain()).equal('caseOf'))
                        .then(() => toPromise(b(false)))
                        .then(r => must(r.takeRight()).equal('boolean'))
                        .then(() => toPromise(b('false')))
                        .then(r => must(r.takeLeft().explain()).equal('caseOf'))
                        .then(() => toPromise(bcons(true)))
                        .then(r => must(r.takeRight()).equal('Boolean'))
                        .then(() => toPromise(bcons(<any>Date)))
                        .then(r => must(r.takeLeft().explain()).equal('caseOf'))))


    });

    describe('match', function() {

        it('should only run one case', function() {

            let p = match(
                caseOf(true, v => pure(succeed(`${v} -> true`))),
                caseOf(String, v => pure(succeed<string, string>(`${v} -> String`))),
                caseOf({ name: String }, v => pure(succeed(`${v} -> name`))),
                caseOf('quenk', v => pure(succeed(`${v} -> quenk`))));

            return toPromise(p('quenk'))
                .then(r => must(r.takeRight()).equal('quenk -> String'));

        });

    });

    describe('identity', function() {

        it('should return the value passed', function() {

            return toPromise(identity(12))
                .then(v => must(v.takeRight()).equal(12));

        });

    });

    describe('reject', () =>
        it('should fail all the time', () =>
            toPromise(reject('testing')(12))
                .then(r => must(r.takeLeft().explain()).equal('testing'))));

    describe('or', () => {

        it('should use the first success', () =>
            toPromise(or(
                () => pure(succeed(24)),
                () => pure(succeed(30)))(12))
                .then(r => must(r.takeRight()).equal(24)));

        it('should use the second if failing first', () =>
            toPromise(or(
                () => pure(fail('left', 12)),
                () => pure(succeed(30)))(12))
                .then(r => must(r.takeRight()).equal(30)));

        it('should provide info about both failures', () =>
            toPromise(or(
                () => pure(fail('left', 12)),
                () => pure(fail('right', 12)))(12))
                .then(r => must(r.takeLeft().explain())
                    .equate({ first: 'left', second: 'right' })))

    })

})
