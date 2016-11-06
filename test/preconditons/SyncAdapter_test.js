import must from 'must';
import Promise from 'bluebird';
import { SyncAdapter } from '../../src/preconditions/AsyncChainable';

var preconditon;
var value = 12;
var e = new Error();

describe('SyncAdapater', function() {

    describe('AsyncAdpater.apply()', function() {

        it('should resolve with the correct value ', function() {

            var test = function(async, sync, result) {

                preconditon = new SyncAdapter({

                    apply(value) {

                        return Promise.delay(50, async);

                    }

                }, {

                    apply(value) {

                        return sync;

                    }

                });

                return preconditon.apply('text').
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
