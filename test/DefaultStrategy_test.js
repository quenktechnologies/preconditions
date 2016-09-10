import must from 'must';
import DefaultStrategy from '../src/DefaultStrategy';
import ExecutionError from '../src/ExecutionError';

var strategy;

function makeCriteria(o) {

    return {

        getCriteria: function() {
            return o;
        },
        onComplete: function(k, v, cb) {
            cb(null, v);
        }

    };

}

function makeChain(f) {

    return {
        call: function(c, k, v, cb) {
            return f(k, v, cb);
        }
    };

}

describe('Strategy', function() {

    describe('call()', function() {

        beforeEach(function() {

            strategy = new DefaultStrategy();

        });

        it('should run each criteria', function() {

            must(strategy.execute(makeCriteria({
                name: makeChain((k, v, cb) => cb(null, k, v.toLowerCase())),
                job: makeChain((k, v, cb) => cb(null, k, 'politician')),
                age: makeChain((k, v, cb) => cb(null, k, v - 15))
            }), {
                name: 'Keith Rowley',
                job: 'lawyer',
                age: 75
            }, function(err, o) {

                must(o).eql({
                    name: 'keith rowley',
                    job: 'politician',
                    age: 60
                });

            }));

        });

        it('should recognize arrays', function() {

            var a = (k, v, cb) => cb(null, k, v.toLowerCase());
            var b = makeChain((k, v, cb) => cb(null, k, v + ' and politician'));
            var c = makeChain((k, v, cb) => cb(null, k, v * 10));

            must(strategy.execute(makeCriteria({
                name: a,
                job: [b, b],
                age: [c, c, c]
            }), {
                name: 'Keith Rowley',
                job: 'lawyer',
                age: 75
            }, function(err, o) {

                must(o).eql({
                    name: 'keith rowley',
                    job: 'lawyer and politician and politician',
                    age: 75000
                });

            }));

        });

        it('should recognize when an error occured', function() {

            must(strategy.execute(makeCriteria({
                name: makeChain((k, v, cb) => cb(null, k, v.toLowerCase())),
                job: makeChain((k, v, cb) => cb(null, k, 'politician')),
                age: makeChain((k, v, cb) => cb(new Error('Must be number!'), k, v))
            }), {
                name: 'Keith Rowley',
                job: 'lawyer',
                age: 'old'
            }, function(err, o) {

                must(err instanceof ExecutionError).be(true);

                must(err.errors).eql({
                    age: 'Must be number!'
                });

                must(o).eql({
                    name: 'Keith Rowley',
                    job: 'lawyer',
                    age: 'old'
                });

            }));

        });

    });
});
