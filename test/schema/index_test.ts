import * as object from './data/object';
import * as array from './data/array';
import * as string from './data/string';
import * as boolean from './data/boolean';
import * as number from './data/number';

import { assert } from '@quenk/test/lib/assert';

import { Value } from '@quenk/noni/lib/data/jsonx';

import { Entry, parse } from '../../lib/schema/parse';
import { just } from '@quenk/noni/lib/data/maybe';

export const xtests = [
    object.tests,
    array.tests,
    string.tests,
    boolean.tests,
    number.tests
];
const tests = [object.tests];

const context = {
    visit: (entry: Entry<Value>) => entry,

    create: (path: string, args: Value[]) => just([path, args])
};

describe('compile', () => {
    describe('parse', () => {
        for (let target of tests)
            for (let [test, { input, expected }] of Object.entries(target))
                it(test, () => {
                    let mresult = parse(context, input);
                    assert(mresult.isRight(), 'parse successful').true();
                    assert(mresult.takeRight()).equate(expected);
                });
    });
});
