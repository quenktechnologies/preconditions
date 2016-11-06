import must from 'must';
import Promise from 'bluebird';
import {
    AsyncAnd,
    AsyncOr,
    AsyncNot,
    SyncAdapter,
    default as AsyncChainable
} from '../../src/preconditions/AsyncChainable';

var chain;
var leftResult;
var rightResult;
var leftCalled;
var rightCalled;
var value = 12;

var left = {

    apply(value) {

        return Promise.try(() => {
            leftCalled = true;
            return leftResult;
        });

    }

};

var right = {

    apply(value, key, errors) {

        return Promise.try(() => {
            rightCalled = true;
            return rightResult;
        });

    }

};


class Child extends AsyncChainable {

}

describe('Chainable', function() {

    beforeEach(function() {

        chain = new Child();

    });

    describe('and', function() {

        it('should return Chainable.And', function() {

            must(chain.and(new Child())).be.instanceOf(AsyncAnd);

        });

    });

    describe('or', function() {

        it('should return Chainable.Or', function() {

            must(chain.or(new Child())).be.instanceOf(AsyncOr);

        });

    });

    describe('sync', function() {

        it('should return SyncAdapter', function() {

            must(chain.sync(new Child())).be.instanceOf(SyncAdapter);

        });

    });

});

describe('AsyncAnd', function() {

    beforeEach(function() {

        leftResult = value;
        rightResult = value;
        leftCalled = false;
        rightCalled = false;
        chain = new AsyncAnd(left, right);

    });

    describe('apply', function() {

        it('should go from left to right', function() {

            return chain.apply('value').
            then(result => {

                must(result).be(value);
                must(leftCalled).be.true();
                must(rightCalled).be.true();

            });

        });

        it('should stop if left fails', function() {

            leftResult = new Error();

            return chain.apply('value').
            then(result => {

                must(result).be.instanceof(Error);
                must(leftCalled).be.true();
                must(rightCalled).be.false();

            });

        });

        it('should return right', function() {

            rightResult = new Error();

            return chain.apply('value').
            then(result => {

                must(result).be.instanceof(Error);
                must(leftCalled).be.true();
                must(rightCalled).be.true();

            });

        });

    });

});

describe('AsyncOr', function() {

    beforeEach(function() {

        leftResult = value;
        rightResult = value;
        leftCalled = false;
        rightCalled = false;

        chain = new AsyncOr(left, right);

    });

    describe('apply', function() {

        it('should continue if left fails', function() {

            leftResult = new Error();

            return chain.apply(value).
            then(result => {

                must(result).be(value);
                must(leftCalled).be.true();
                must(rightCalled).be.true();

            });

        });

        it('should stop if left does not fail', function() {

            rightResult = new Error();

            return chain.apply(value).
            then(result => {

                must(result).be(value);
                must(leftCalled).be.true();
                must(rightCalled).be.false();

            });

        });

    });

});
