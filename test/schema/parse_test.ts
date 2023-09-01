import * as object from './data/object';
import * as array from './data/array';
import * as string from './data/string';
import * as boolean from './data/boolean';
import * as number from './data/number';

import { assert } from '@quenk/test/lib/assert';

import { just } from '@quenk/noni/lib/data/maybe';
import { Value } from '@quenk/noni/lib/data/jsonx';
import { Type } from '@quenk/noni/lib/data/type';

import { Node, parse } from '../../lib/schema/parse';

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
        for (let [suite, target] of Object.entries(tests))
            describe(suite, () => {
                for (let [test, { input, expected }] of Object.entries(target))
                    it(test, () => {
                        let mresult = parse(context, input);
                        assert(mresult.isRight(), 'parse successful').true();
                        assert(mresult.takeRight()).equate(expected);
                    });
            });
    });
});
