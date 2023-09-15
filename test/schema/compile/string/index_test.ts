import * as object from '../../parse/data/object';
import * as array from '../../parse/data/array';
import * as string from '../../parse/data/string';
import * as boolean from '../../parse/data/boolean';
import * as number from '../../parse/data/number';

import { compile } from '../../../../lib/schema/compile/string';
import { runParseTests } from '../../../tests';

const tests = {
    object: object.tests,
    array: array.tests,
    string: string.tests,
    boolean: boolean.tests,
    number: number.tests
};

describe('string', () => {
    describe('parse', () => {
        runParseTests(
            {
                mkpath: (suite, test) =>
                    `${__dirname}/data/expected/${suite}/` +
                    test.split(' ').join('-') +
                    '.js',
                parse: schema => compile({}, schema)
            },
            tests
        );
    });
});
