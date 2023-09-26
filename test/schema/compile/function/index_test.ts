import * as object from './data/object';
import * as array from './data/array';
import * as string from './data/string';
import * as boolean from './data/boolean';
import * as number from './data/number';
import * as async from './data/async';

import { runFuncCompileTests, runAsyncFuncCompileTests } from '../../../tests';

describe('function', () => {
    describe('compile', () =>
        runFuncCompileTests({
            object: object.tests,
            array: array.tests,
            string: string.tests,
            boolean: boolean.tests,
            number: number.tests
        }));

    describe('compileAsync', () => runAsyncFuncCompileTests(async.tests));
});
