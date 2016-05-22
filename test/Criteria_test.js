import must from 'must';
import Criteria from '../src/Criteria';
import Criterion from '../src/Criterion';
import DefaultStrategy from '../src/DefaultStrategy';

var criteria;

class UpperCase extends Criterion {

    enforce(key, value, done) {

        done(null, key, value.toUpperCase());

    }

}

class Increment extends Criterion {

    enforce(key, value, done) {

        done(null, key, value + 1);

    }

}


class NestedCriteria extends Criteria {

    constructor() {

        super();
        this.name = new UpperCase();
        this.count = new Increment();

    }

}

class NormalCriteria extends Criteria {

    constructor() {

        super();
        this.name = new UpperCase();
        this.count = new Increment();
        this.nested = new NestedCriteria();

    }

}

describe('Criteria', function() {

    describe('Criteria.apply', function() {

        it('should apply', function(done) {

            var criteria = new NormalCriteria();

            criteria.execute({
                name: 'hera',
                count: 6,
                invalid: true,
                nested: {
                    name: 'bluebird',
                    count: 0,
                    invalid: true,
                }
            }, function(err, filtered) {
                must(err).be.null();
                must(filtered).eql({
                    name: 'HERA',
                    count: 7,
                  nested: {count:1, name:'BLUEBIRD'}
                });
                done();
            });

        });

    });
})
