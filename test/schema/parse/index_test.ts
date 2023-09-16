import * as object from './data/object';
import * as array from './data/array';
import * as string from './data/string';
import * as boolean from './data/boolean';
import * as number from './data/number';

import { just } from '@quenk/noni/lib/data/maybe';
import { Value } from '@quenk/noni/lib/data/jsonx';
import { Type } from '@quenk/noni/lib/data/type';
import { merge } from '@quenk/noni/lib/data/record';

import { Node, parse, defaultBuiltins } from '../../../lib/schema/parse';
import { runParseSuites, runParseTest } from '../../tests';
import { allBuiltins } from './data/builtins';

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

describe('parse', () => {
    runParseSuites(
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

    describe('builtinsAvailable', () => {
        for (let [suite, schema] of Object.entries(allBuiltins)) {
            describe(suite, () => {
                let mkpath = (suite, name) =>
                    `${__dirname}/data/expected/${suite}/` +
                    name
                        .split(' ')
                        .join('-')
                        .split('"')
                        .join('')
                        .split('.')
                        .join('-') +
                    '.json';

                for (let builtin of defaultBuiltins[suite]) {
                    describe(builtin, () => {
                        runParseTest(
                            {
                                json: true,
                                name: `should allow omitting "${builtin}"`,
                                suite,
                                mkpath,
                                parse: schema =>
                                    parse(
                                        merge(context, {
                                            builtinsAvailable: {
                                                [suite]: defaultBuiltins[
                                                    suite
                                                ].filter(
                                                    bltn => bltn !== builtin
                                                )
                                            }
                                        }),
                                        schema
                                    )
                            },
                            schema
                        );

                        runParseTest(
                            {
                                json: true,
                                name: `should allow only "${builtin}"`,
                                suite,
                                mkpath,
                                parse: schema =>
                                    parse(
                                        merge(context, {
                                            builtinsAvailable: {
                                                [suite]: [builtin]
                                            }
                                        }),
                                        schema
                                    )
                            },
                            schema
                        );
                    });
                }

                runParseTest(
                    {
                        json: true,
                        name: `should allow omitting all`,
                        suite,
                        mkpath,
                        parse: schema =>
                            parse(
                                merge(context, {
                                    builtinsAvailable: {
                                        [suite]: []
                                    }
                                }),
                                schema
                            )
                    },
                    schema
                );
            });
        }
    });
});
