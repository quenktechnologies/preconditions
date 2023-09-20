import * as object from '../../parse/data/object';
import * as array from '../../parse/data/array';
import * as string from '../../parse/data/string';
import * as boolean from '../../parse/data/boolean';
import * as number from '../../parse/data/number';

import { merge } from '@quenk/noni/lib/data/record';

import { compile } from '../../../../lib/schema/compile/string';
import { runParseSuites, runParseTest } from '../../../tests';
import { pipelines } from './data/key';
import { asyncSchema } from './data/async';

const tests = {
    object: object.tests,
    array: array.tests,
    string: string.tests,
    boolean: boolean.tests,
    number: number.tests
};

            const mkpath = (suite, name) =>
                `${__dirname}/data/expected/${suite}/` +
                name
                    .split(' ')
                    .join('-')
                    .split('"')
                    .join('')
                    .split('.')
                    .join('-') +
                '.json';

describe('string', () => {
    describe('compile', () => {
        runParseSuites(
            {
                mkpath,
                parse: schema => compile({}, schema)
            },
            tests
        );

        describe('key', () => {
                        for (let [suite, schema] of Object.entries(pipelines)) {
                describe(suite, () => {
                    runParseTest(
                        {
                            name: `should work for custom ${suite} key`,
                            suite,
                            mkpath,
                            parse: schema =>
                                compile(
                                     { key: 'pipes' },
                                    schema
                                )
                        },
                        schema
                    );
                });
            }
        });

 describe('async', () => {
                        for (let [suite, schema] of Object.entries(asyncSchema)) {
                describe(suite, () => {
                    runParseTest(
                        {
                            name: `should work for async ${suite}`,
                            suite,
                            mkpath,
                            parse: schema =>
                                compile(
                                   {async:true},
                                    schema
                                )
                        },
                        schema
                    );
                });
            }
        });
    });
});
