import * as Promise from 'bluebird';
import * as must from 'must/register';
import {
    success,
    optional,
    caseOf,
    match
} from '../src/async';

describe('async', function() {

    describe('optional', () =>
        it('should not run the test if the value is null', () =>

            Promise
                .resolve((_: any) => success('12'))
                .then(t =>
                    optional(t)(undefined)
                        .then(r => must(r.takeRight()).eql(undefined))
                        .then(() => optional(t)('earth'))
                        .then(r => must(r.takeRight()).be('12')))))

    describe('caseOf', function() {

        it('should match primitives', () =>

            Promise
                .resolve([
                    caseOf('hello', () => success('string')),
                    caseOf(String, () => success('String')),
                    caseOf(12, () => success('number')),
                    caseOf(Number, () => success('Number')),
                    caseOf(false, () => success('boolean')),
                    caseOf(Boolean, () => success('Boolean')),
                ])
                .then(([s, scons, n, ncons, b, bcons]) =>
                    s('hello')
                        .then(r => must(r.takeRight()).eql('string'))
                        .then(() => s('chello'))
                        .then(r => must(r.takeLeft().explain()).eql('caseOf'))
                        .then(() => scons('ferimpusds'))
                        .then(r => console.error(r) || must(r.takeRight()).eql('String'))
                        .then(() => scons(<any>12))
                        .then(r => must(r.takeLeft().explain()).eql('caseOf'))
                        .then(() => n(12))
                        .then(r => must(r.takeRight()).eql('number'))
                        .then(() => n('12'))
                        .then(r => must(r.takeLeft().explain()).eql('caseOf'))
                        .then(() => ncons(123243))
                        .then(r => must(r.takeRight()).eql('Number'))
                        .then(() => ncons(<any>'adf'))
                        .then(r => must(r.takeLeft().explain()).eql('caseOf'))
                        .then(() => b(false))
                        .then(r => must(r.takeRight()).eql('boolean'))
                        .then(() => b('false'))
                        .then(r => must(r.takeLeft().explain()).eql('caseOf'))
                        .then(() => bcons(true))
                        .then(r => must(r.takeRight()).eql('Boolean'))
                        .then(() => bcons(<any>Date))
                        .then(r => must(r.takeLeft().explain()).eql('caseOf'))))


    });

    describe('match', function() {

        it('should only run one case', function() {

            let p = match(
                caseOf(true, v => success(`${v} -> true`)),
                caseOf(String, v => success<string, string>(`${v} -> String`)),
                caseOf({ name: String }, v => success(`${v} -> name`)),
                caseOf('quenk', v => success(`${v} -> quenk`)));

            return p('quenk')
                .then(r => must(r.takeRight()).eql('quenk -> String'));

        });

    });



})
