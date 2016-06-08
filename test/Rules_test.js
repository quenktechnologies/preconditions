import must from 'must';
import Rules from '../src/Rules';

var criterion;

describe('Rules', function() {

    beforeEach(function() {

        criterion = new Rules();

    });

    describe('apply', function() {

        it('should fail if a value is not specified', function() {

            criterion.required()('name', '', function(err, key, value) {

                must(err instanceof Error).be(true);
                must(err.message).be(`The field 'name' is required!`);
                must(key).equal('name');

            });

        });

    });

});
