import * as object from './data/object';
import * as array from './data/array';
import * as string from './data/string';
import * as boolean from './data/boolean';
import * as number from './data/number';

import { just } from '@quenk/noni/lib/data/maybe';
import { Value } from '@quenk/noni/lib/data/jsonx';
import { Type } from '@quenk/noni/lib/data/type';

import { Node, parse } from '../../../lib/schema/parse';
import { runParseTests } from '../../tests';

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
        runParseTests(
            {
                json: true,
                mkpath: (suite, name) =>
                    `${__dirname}/data/expected/${suite}/` +
                    name.split(' ').join('-') +
                    '.json',
                parse: schema => parse(context, schema)
            },
            tests
        );
    });
});
