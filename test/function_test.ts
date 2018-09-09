import * as must from 'must/register';
import { Failure } from '../src/result';
import { isFunction } from '../src/function';

const fun = <A>(a: A) => a;

describe('function', function() {

    describe('isFunction', function() {

        it('should fail if the value specified is not a function', function() {

            must(isFunction(fun).takeRight()(12)).be(12);
            must(isFunction('12').takeLeft()).be.instanceOf(Failure);

        });

    });

});


