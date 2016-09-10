import must from 'must';
import Rules from '../src/Rules';

describe('Rules', function() {

    describe('required', function() {

        it('should fail if a value is not specified', function() {

            Rules.required()('name', '', function(err, key, value) {

                must(err instanceof Error).be(true);
                must(err.message).be(`This field is required!`);
                must(key).equal('name');

            });

        });

    });

    describe('cast', function() {

        it('should properly cast a value', function() {

            Rules.cast(String)('age', 12, function(err, key, value) {

                must(key).equal('age');
                must(value).equal('12');

            });

            Rules.cast(Number)('age', '24', function(err, key, value) {

                must(key).equal('age');
                must(value).equal(24);

            });

        });

    });

});
