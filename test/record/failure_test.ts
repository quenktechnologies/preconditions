import * as must from 'must/register';
import * as conditions from '../../src/failure';
import { Failure } from '../../src/record/failure';

type Prim = string | number | number[] | Date;

describe('Failure', () => {

    describe('explain', () => {

        let fail;
        let templates: { [key: string]: string };

        beforeEach(function() {

            fail = new Failure<{ [key: string]: Prim }, Prim>({
                name: new conditions.Failure('string', new Date()),
                age: new conditions.Failure('range', 200, { min: 5, max: 122 }),
                size: new conditions.Failure('enum', 'small')
            }, { name: [3], age: 10000, size: 'tiny' });

            templates = {
                'name.string': 'There was a problem with {$key}!',
                'name': 'You should never see this',
                'age.range': '{$key} must be within {min} to {max}',
                'size': '{her} says size must not be {$value}'
            };

        });

        it('should work', () => {

            let r = fail.explain(templates, { her: 'Sara' });

            must(r).eql({
                name: 'There was a problem with name!',
                age: 'age must be within 5 to 122',
                size: 'Sara says size must not be small'
            });

        });

    });

});
