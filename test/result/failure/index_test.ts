import { assert } from '@quenk/test/lib/assert';
import { PrimFailure } from '../../../src/result/failure';

describe('PrimFailure', function() {

    let fail;
    let templates: { [key: string]: string };

    beforeEach(function() {

        fail = new PrimFailure('string', 12, { feels: 'joys' });
        templates = { string: 'Input "{$value}" is not a number! I no feel {feels}{punc}' };

    });

    describe('explain', function() {

        it('should explain templates', function() {

            assert(fail.explain(templates, { punc: '!' }))
                .equal('Input "12" is not a number! I no feel joys!');

        });

    });

});
