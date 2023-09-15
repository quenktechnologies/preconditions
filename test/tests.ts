import { assert } from '@quenk/test/lib/assert';

import { Value } from '@quenk/noni/lib/data/jsonx';
import { Type } from '@quenk/noni/lib/data/type';
import { Record } from '@quenk/noni/lib/data/record';
import { readJSONFile, readTextFile, writeFile } from '@quenk/noni/lib/io/file';
import { Either } from '@quenk/noni/lib/data/either';

import { Precondition } from '../lib';
import { Schema } from '../lib/schema';

/**
 * TestCase is a single input->output test.
 */
export type TestCase = { value?: Type; ok?: Value; notOk?: Value };

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
 *  SchemaTestSuite for testing a schema.
 */
interface SchemaTestSuite extends BaseTestSuite {
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

/**
 * runCompileTests tests schemas.
 */
export const runCompileTests = (
    tests: Record<SchemaTestSuite[]>,
    compile: (s: Schema) => Precondition<Type, Type>
) => runBaseTests(tests, s => compile(s.schema));

/**
 * runBaseTests sets up multiple TestSuites.
 *
 * TestSuites are further grouped into a record so that related suites are in
 * their own collection.
 */
const runBaseTests = <S extends BaseTestSuite>(
    tests: Record<S[]>,
    take: (s: S) => Precondition<Type, Type>
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

                        it(`Test Case ${i}`, () => {
                            let kase = cases[i];
                            let eresult = prec(kase.value);
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
 * runParseTests compares the output of a parse/compile to files stored on disk.
 */
export const runParseTests = (
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
            for (let [test, input] of Object.entries(target)) {
                if (
                    process.env.TEST_NAME &&
                    !new RegExp(process.env.TEST_NAME).test(test)
                )
                    continue;
                it(test, async () => {
                    let path = mkpath(suite, test);
                    let mresult = parse(input);
                    assert(mresult.isRight(), 'parse successful').true();

                    let result = mresult.takeRight();

                    if (process.env.GENERATE)
                        return writeFile(
                            path,
                            json ? JSON.stringify(result) : result
                        );
                    assert(result).equate(
                        await (json ? readJSONFile(path) : readTextFile(path))
                    );
                });
            }
        });
    }
};
