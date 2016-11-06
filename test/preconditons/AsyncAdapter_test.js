import must from 'must';
import Promise from 'bluebird';
import AsyncAdapter from '../../src/preconditions/AsyncAdapter';

var precondition;
var e = new Error();
var value = 12;

describe('AsyncAdapter', function() {

    describe('AsyncAdpater.apply()', function() {

        it('should resolve with the correct value ', function() {

            var test = function(sync, async, result) {

                precondition = new AsyncAdapter({

                    apply(value) {

                        return sync;

                    }

                }, {

                    apply(value) {

                        return Promise.delay(50, async);

                    }

                });

                return precondition.apply('text').
                then(r => must(r).be(result));
            };

            return Promise.all([
                test(value, e, e),
                test(e, value, e),
                test(e, e, e),
                test(value, value, value)
            ]);

        });

    });

});
