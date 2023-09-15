import * as object from './data/object';
import * as array from './data/array';
import * as string from './data/string';
import * as boolean from './data/boolean';
import * as number from './data/number';

import { compile } from '../../../../lib/schema/compile/function';
import { runCompileTests } from '../../../tests';

describe('compile', () => {
    describe('function', () =>
        runCompileTests(
            {
                object: object.tests,
                array: array.tests,
                string: string.tests,
                boolean: boolean.tests,
                number: number.tests
            },
            s => compile({}, s).takeRight()
        ));
});
