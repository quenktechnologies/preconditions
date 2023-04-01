import { assert } from '@quenk/test/lib/assert';

import { PrimFailure } from '../src/result/failure';
import { isFunction } from '../src/function';

const fun = <A>(a: A) => a;

describe('function', function () {
    describe('isFunction', function () {
        it('should fail if the value specified is not a function', function () {
            assert(isFunction(fun).takeRight()(12)).be.equal(12);
            assert(isFunction('12').takeLeft()).be.instance.of(PrimFailure);
        });
    });
});
