import { assert } from '@quenk/test/lib/assert';
import { RecordFailure } from '../../../src/result/failure/record';
import { PrimFailure } from '../../../src/result/failure';

type Prim = string | number | number[] | Date;

describe('RecordFailure', () => {
    describe('explain', () => {
        let fail;
        let templates: { [key: string]: string };

        beforeEach(function () {
            fail = new RecordFailure<Prim>(
                {
                    name: new PrimFailure('string', new Date()),
                    age: new PrimFailure('range', 200, { min: 5, max: 122 }),
                    size: new PrimFailure('enum', 'small')
                },
                { name: [3], age: 10000, size: 'tiny' }
            );

            templates = {
                'name.string': 'There was a problem with {$key}!',
                name: 'You should never see this',
                'age.range': '{$key} assert be within {min} to {max}',
                size: '{her} says size assert not be {$value}'
            };
        });

        it('should work', () => {
            let r = fail.explain(templates, { her: 'Sara' });

            assert(r).equate({
                name: 'There was a problem with name!',
                age: 'age assert be within 5 to 122',
                size: 'Sara says size assert not be small'
            });
        });
    });
});
