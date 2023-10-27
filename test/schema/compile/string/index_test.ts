import * as object from '../../parse/data/object';
import * as array from '../../parse/data/array';
import * as string from '../../parse/data/string';
import * as boolean from '../../parse/data/boolean';
import * as number from '../../parse/data/number';

import { compile } from '../../../../lib/schema/compile/string';
import { tests as asyncSchema } from '../function/data/async';
import { runParseSuites, runParseTest } from '../../../tests';
import { pipelines } from './data/key';
import { allInline } from './data/inline';

const tests = {
    object: object.tests,
    array: array.tests,
    string: string.tests,
    boolean: boolean.tests,
    number: number.tests
};

const replacements = {
    ' ': '-',
    '"': '',
    '.': '-',
    is: ' equals ',
    '(': '',
    ')': ''
};

const mkpath = (suite, name) => {
    let str = name;
    for (let [target, dest] of Object.entries(replacements))
        str = str.split(target).join(dest);

    return `${__dirname}/data/expected/${suite}/${str}.ts`;
};

describe('compile', () => {
    describe('string', () => {
        describe('default options', () => {
            runParseSuites(
                {
                    mkpath,
                    parse: schema => compile({}, schema)
                },
                tests
            );
        });

        describe('options.key set', () => {
            for (let [suite, schema] of Object.entries(pipelines)) {
                describe(suite, () => {
                    runParseTest(
                        {
                            name: `should work for custom ${suite} key`,
                            suite,
                            mkpath,
                            parse: schema => compile({ key: 'pipes' }, schema)
                        },
                        schema
                    );
                });
            }
        });

        describe('options.async true', () => {
            for (let [suite, tests] of Object.entries(asyncSchema)) {
                describe(suite, () => {
                    for (let test of tests) {
                        if (!test.name.includes('inline'))
                            runParseTest(
                                {
                                    name: test.name,
                                    suite,
                                    mkpath,
                                    parse: schema =>
                                        compile({ async: true }, schema)
                                },
                                test.schema
                            );
                    }
                });
            }
        });

        describe('inline', () => {
            for (let [suite, schema] of Object.entries(allInline)) {
                describe(suite, () => {
                    runParseTest(
                        {
                            name: `should work for ${suite} with embedded preconditions`,
                            suite,
                            mkpath,
                            parse: schema => compile({}, schema)
                        },
                        schema
                    );
                });
            }
        });

        describe('inline (async)', () => {
            for (let [suite, schema] of Object.entries(allInline)) {
                describe(suite, () => {
                    runParseTest(
                        {
                            name: `should work for ${suite} with async embedded preconditions`,
                            suite,
                            mkpath,
                            parse: schema => compile({ async: true }, schema)
                        },
                        schema
                    );
                });
            }
        });
    });
});
