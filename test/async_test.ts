import * as Promise from 'bluebird';
import * as must from 'must/register';
import {
    success,
    optional
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

})
