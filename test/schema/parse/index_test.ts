import * as object from './data/object';
import * as array from './data/array';
import * as string from './data/string';
import * as boolean from './data/boolean';
import * as number from './data/number';

import { assert } from '@quenk/test/lib/assert';

import { just } from '@quenk/noni/lib/data/maybe';
import { Value } from '@quenk/noni/lib/data/jsonx';
import { Type } from '@quenk/noni/lib/data/type';
import { readJSONFile, writeFile } from '@quenk/noni/lib/io/file';

import { Node, parse } from '../../../lib/schema/parse';

const tests = {
    object: object.tests,
    array: array.tests,
    string: string.tests,
    boolean: boolean.tests,
    number: number.tests
};

const context = {
    visit: (entry: Node<Value>) => entry,

    get: (path: string, args: Type[]) => just([path, args])
};

describe('schema', () => {
    describe('parse', () => {
        for (let [suite, target] of Object.entries(tests)) {
            if (
                process.env.TEST_SUITE_NAME &&
                !new RegExp(process.env.TEST_SUITE_NAME).test(suite)
            )
                continue;
            describe(suite, () => {
                for (let [test, input] of Object.entries(target)) {
                    if (
                        process.env.TEST_NAME &&
                        !new RegExp(process.env.TEST_NAME).test(test)
                    )
                        continue;
                    it(test, async () => {
                        let path =
                            `${__dirname}/data/expected/${suite}/` +
                            test.split(' ').join('-') +
                            '.json';

                        let mresult = parse(context, input);
                        assert(mresult.isRight(), 'parse successful').true();

                        let result = mresult.takeRight();

                        if (process.env.GENERATE)
                            return writeFile(path, JSON.stringify(result));
                        assert(result).equate(await readJSONFile(path));
                    });
                }
            });
        }
    });
});
