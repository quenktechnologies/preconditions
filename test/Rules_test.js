import must from 'must';
import Rules from '../src/Rules';

var criterion;

describe('Rules', function() {

    beforeEach(function() {

        criterion = new Rules();

    });

    describe('required', function() {

        it('should fail if a value is not specified', function() {

            criterion.required()('name', '', function(err, key, value) {

                must(err instanceof Error).be(true);
                must(err.message).be(`The field 'name' is required!`);
                must(key).equal('name');

            });

        });

    });

    describe('cast', function() {

        it('should properly cast a value', function() {

            criterion.cast(String)('age', 12, function(err, key, value) {

                must(key).equal('age');
                must(value).equal('12');

            });

criterion.cast(Number)('age', '24', function(err, key, value) {

                must(key).equal('age');
                must(value).equal(24);

            });

        });

    });

});
