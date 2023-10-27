import * as precs from './data/preconditions';

import { assert } from '@quenk/test/lib/assert';

import { Value } from '@quenk/noni/lib/data/jsonx';
import { Type } from '@quenk/noni/lib/data/type';
import { Record } from '@quenk/noni/lib/data/record';
import {
    readJSONFile,
    readTextFile,
    removeFile,
    writeFile
} from '@quenk/noni/lib/io/file';
import { Either } from '@quenk/noni/lib/data/either';
import { merge } from '@quenk/noni/lib/data/record';

import { Precondition } from '../lib';
import {
    AsyncOptions,
    compile,
    compileAsync,
    Options
} from '../lib/schema/compile/function';
import { Schema } from '../lib/schema';
import { AsyncPrecondition } from '../lib/async';

/**
 * TestCase is a single input->output test.
 */
export type TestCase = {
    value?: Type;
    ok?: Value;
    notOk?: Value;
};

/**
 * BaseTestSuite
 */
interface BaseTestSuite {
    /**
     * name identifies the particular test suite and can be used to run only
     * that test by specifying the TEST_SUITE_NAME env var.
     */
    name: string;

    /**
     * cases are all the test cases to test a precondition/schema under.
     *
     * The env var TEST_CASE_INDEX can be specified to indicate which case to
     * run.
     */
    cases: TestCase[];
}

/**
 * PrecTestSuite is for testing a precondition directly.
 */
interface PrecTestSuite extends BaseTestSuite {
    /**
     * precondition to test.
     */
    precondition: Precondition<Type, Type>;
}

/**
 *  SchemaTestSuite for testing a compiled schema.
 */
interface SchemaTestSuite extends BaseTestSuite {
    /**
     * options passed to the compile function.
     */
    options?: Partial<Options | AsyncOptions>;

    /**
     * schena to test
     */
    schema: Schema;
}

/**
 * runPrecTests tests preconditions directly.
 */
export const runPrecTests = (tests: Record<PrecTestSuite[]>) =>
    runBaseTests(tests, s => s.precondition);

const options = {
    preconditions: precs.preconditions,
    asyncPreconditions: precs.asyncPreconditions
};

/**
 * runFuncCompileTests tests functions compiled from a schema.
 */
export const runFuncCompileTests = (tests: Record<SchemaTestSuite[]>) =>
    runBaseTests(tests, s => {
        let eresult = compile(merge(options, s.options || {}), s.schema);
        if (eresult.isLeft()) throw new Error(eresult.takeLeft().message);
        return eresult.takeRight();
    });

/**
 * runAsyncFuncCompileTests tests async functions compiled from a schema.
 */
export const runAsyncFuncCompileTests = (tests: Record<SchemaTestSuite[]>) =>
    runBaseTests(tests, s => {
        let eresult = compileAsync(merge(options, s.options || {}), s.schema);
        if (eresult.isLeft()) throw new Error(eresult.takeLeft().message);
        return eresult.takeRight();
    });

/**
 * runBaseTests sets up multiple TestSuites.
 *
 * TestSuites are further grouped into a record so that related suites are in
 * their own collection.
 */
const runBaseTests = <S extends BaseTestSuite>(
    tests: Record<S[]>,
    take: (s: S) => Precondition<Type, Type> | AsyncPrecondition<Type, Type>
) => {
    for (let [suite, targets] of Object.entries(tests))
        describe(suite, () => {
            let runTarget;

            if (process.env.TEST_SUITE_NAME)
                runTarget = new RegExp(process.env.TEST_SUITE_NAME);

            for (let target of targets) {
                let { name, cases } = target;
                if (runTarget && !runTarget.test(name)) continue;

                describe(name, () => {
                    let prec;
                    before(() => {
                        prec = take(target);
                    });

                    let runCase = Number(process.env.TEST_CASE_INDEX);

                    for (let i = 0; i < cases.length; i++) {
                        if (!isNaN(runCase) && i !== runCase) continue;

                        it(`Test Case ${i}`, async () => {
                            let kase = cases[i];
                            let eresult = await prec(kase.value);
                            if (kase.hasOwnProperty('notOk')) {
                                assert(
                                    eresult.isLeft(),
                                    'result not ok'
                                ).true();
                                assert(eresult.takeLeft().explain()).equate(
                                    kase.notOk
                                );
                            } else {
                                assert(eresult.isRight(), 'result ok').true();

                                let { ok = kase.value } = kase;
                                assert(eresult.takeRight()).equate(ok);
                            }
                        });
                    }
                });
            }
        });
};

/**
 * ParseTestSuiteOptions
 */
export interface ParseTestSuiteOptions {
    /**
     * json if true will parse/stringify the output from and to the file.
     */
    json?: boolean;

    /**
     * path generates the path to read/generate output for a schema.
     */
    mkpath: (suite: string, test: string) => string;

    /**
     * parse (or compile function).
     *
     * It should return a string or AST.
     */
    parse: (schema: Schema) => Either<Type, Type>;
}

/**
 * runParseSuites runs multiple parse/compile comparison tests that are grouped
 * together by object schema types.
 */
export const runParseSuites = (
    { json, mkpath, parse }: ParseTestSuiteOptions,
    tests: Record<Record<Schema>>
) => {
    for (let [suite, target] of Object.entries(tests)) {
        if (
            process.env.TEST_SUITE_NAME &&
            !new RegExp(process.env.TEST_SUITE_NAME).test(suite)
        )
            continue;
        describe(suite, () => {
            for (let [name, schema] of Object.entries(target)) {
                if (
                    process.env.TEST_NAME &&
                    !new RegExp(process.env.TEST_NAME).test(name)
                )
                    continue;
                runParseTest(
                    {
                        json,
                        suite,
                        name,
                        mkpath,
                        parse
                    },
                    schema
                );
            }
        });
    }
};

/**
 * RunParseTestOptions
 */
export interface RunParseTestOptions extends ParseTestSuiteOptions {
    /**
     * name of the test.
     */
    name: string;

    /**
     * suite the test belongs to.
     *
     * Used when creating the read/write path for comparison.
     */
    suite: string;
}

/**
 * runParseTests compares the output of a parse (or string compile) to files
 * stored on disk.
 */
export const runParseTest = (
    { json, name, suite, mkpath, parse }: RunParseTestOptions,
    schema: Schema
) => {
    it(name, async () => {
        let mresult = parse(schema);

        if (mresult.isLeft() && process.env.DEBUG)
            console.error('parse error: ', mresult.takeLeft());

        assert(mresult.isRight(), 'parse successful').true();

        let result = mresult.takeRight() || '';

        let path = mkpath(suite, name);

        if (process.env.GENERATE)
            return writeFile(path, json ? JSON.stringify(result) : result);

        if (process.env.REMOVE) return removeFile(path);

        assert(result).equate(
            await (json ? readJSONFile(path) : readTextFile(path))
        );
    });
};
