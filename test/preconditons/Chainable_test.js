import must from 'must';
import { And, Or, default as Chainable } from '../../src/preconditions/Chainable';
import AsyncAdapter from '../../src/preconditions/AsyncAdapter';

var chain;
var value = 12;
var leftResult;
var rightResult;
var leftCalled;
var rightCalled;

var left = {

    apply(value) {

        leftCalled = true;
        return leftResult;

    }

};

var right = {

    apply(value) {

        rightCalled = true;
        return rightResult;

    }

};

class Child extends Chainable {

}


describe('Chainable', function() {

    beforeEach(function() {

        chain = new Child();

    });


    describe('and', function() {

        it('should return Chainable.And', function() {

            must(chain.and(new Child())).be.instanceOf(And);

        });

    });

    describe('or', function() {

        it('should return Chainable.Or', function() {

            must(chain.or(new Child())).be.instanceOf(Or);

        });

    });

    describe('async', function() {

        it('should return AsyncAdapter', function() {

            must(chain.async(new Child())).be.instanceOf(AsyncAdapter);

        });

    });

});

describe('And', function() {

    beforeEach(function() {

        leftResult = value;
        rightResult = value;
        leftCalled = false;
        rightCalled = false;

        chain = new And(left, right);

    });

    describe('apply', function() {

        it('should go from left to right', function() {

            must(chain.apply('value')).not.be.instanceof(Error);
            must(leftCalled).be.true();
            must(rightCalled).be.true();

        });

        it('should stop if left fails', function() {

            leftResult = new Error();

            must(chain.apply('value')).be.instanceof(Error);
            must(leftCalled).be.true();
            must(rightCalled).be.false();

        });

        it('should return right', function() {

            rightResult = new Error();

            must(chain.apply('value')).be.instanceof(Error);
            must(leftCalled).be.true();
            must(rightCalled).be.true();

        });

    });

});

describe('Or', function() {

    beforeEach(function() {

        leftResult = value;
        rightResult = value;
        leftCalled = false;
        rightCalled = false;

        chain = new Or(left, right);

    });

    describe('apply', function() {

        it('should continue if left fails', function() {

            leftResult = new Error();

            must(chain.apply(value)).be(value);
            must(leftCalled).be.true();
            must(rightCalled).be.true();

        });

        it('should stop if left does not fail', function() {

            rightResult = new Error();

            must(chain.apply(value)).be(value);
            must(leftCalled).be.true();
            must(rightCalled).be.false();

        });

    });

});
