import must from 'must';
import Required from '../../src/checks/Required';

var criterion;

describe('Required', function() {

    beforeEach(function() {

        criterion = new Required(null);

    });

    describe('apply', function() {

        it('should fail if a value is not specified', function() {

            criterion.apply('name', '', function(err, key, value) {

                must(err instanceof Error).be(true);
                must(err.message).be(`The field 'name' is required!`);
                must(key).equal('name');

            });

        });

    });

});
