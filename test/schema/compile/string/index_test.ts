import * as object from './data/input/object';
import * as array from './data/input/array';
import * as string from './data/input/string';
import * as boolean from './data/input/boolean';
import * as number from './data/input/number';

import { assert } from '@quenk/test/lib/assert';

import { readTextFile, writeFile } from '@quenk/noni/lib/io/file';

import { compile } from '../../../../lib/schema/compile/string';

const tests = {
    object: object.tests,
    array: array.tests,
    string: string.tests,
    boolean: boolean.tests,
    number: number.tests
};

describe('string', () => {
    describe('parse', () => {
        for (let [suite, target] of Object.entries(tests))
            describe(suite, () => {
                for (let [test, input] of Object.entries(target))
                    it(test, async () => {
                        let path =
                            `${__dirname}/data/expected/` +
                            test.split(' ').join('-') +
                            '.expect';
                        let mresult = compile({}, input);

                        assert(mresult.isRight(), 'compile successful').true();

                        let result = mresult.takeRight();

                        if (process.env.GENERATE) await writeFile(path, result);
                        else assert(result).equate(await readTextFile(path));
                    });
            });
    });
});
