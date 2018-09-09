import * as must from 'must/register';
import {Failure} from '../src/result';

describe('failure', function() {

    let fail;
    let templates: { [key: string]: string };

    beforeEach(function() {

        fail = new Failure('string', 12, { feels: 'joys' });
        templates = { string: 'Input "{$value}" is not a number! I no feel {feels}{punc}' };

    });

    describe('explain', function() {

        it('should explain templates', function() {

            must(fail.explain(templates, { punc: '!' }))
                .be('Input "12" is not a number! I no feel joys!');

        });

    });

});
