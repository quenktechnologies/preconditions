import must from 'must';
import {
    Criterion,
    Failure
} from 'criteria-pattern-core';
import Criteria from '../src/Criteria';

var criteria;

class UpperCase extends Criterion {

    satisfy(value) {

        return value.toUpperCase();

    }

}

class Increment extends Criterion {

    satisfy(value) {

        return value + 1;

    }

}


class NestedCriteria extends Criteria {

    constructor() {

        super({
            name: new UpperCase(),
            count: new Increment()
        });
    }

}

class NormalCriteria extends Criteria {

    constructor() {

        super({
            name: new UpperCase(),
            count: new Increment(),
            nested: new NestedCriteria()
        });

    }

}

describe('Criteria', function() {

    describe('Criteria.satisfy', function() {

        it('should work', function() {

            criteria = new NormalCriteria();

            return criteria.satisfy({
                name: 'hera',
                count: 6,
                invalid: true,
                nested: {
                    name: 'bluebird',
                    count: 0,
                    invalid: true,
                }
            }).
            then(function(report) {

                must(report).eql({
                    name: 'HERA',
                    count: 7,
                    nested: {
                        count: 1,
                        name: 'BLUEBIRD'
                    }
                });

            });

        });

    });
})
