import must from 'must';
import Required from '../../src/criterion/Required';

var criterion;

describe('Required', function() {

    beforeEach(function() {

        criterion = new Required(null);

    });

    describe('enforce', function() {

        it('should fail if a value is not specified', function() {

            criterion.enforce('name', '', function(err, key, value) {

                must(err instanceof Error).be(true);
                must(err.message).be(`The field 'name' is required!`);
                must(key).equal('name');

            });

        });

    });

});
