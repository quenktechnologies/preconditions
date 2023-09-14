import { assert } from '@quenk/test/lib/assert';

import { Value } from '@quenk/noni/lib/data/jsonx';
import { Type } from '@quenk/noni/lib/data/type';
import { Record } from '@quenk/noni/lib/data/record';

import { Precondition } from '../lib';

/**
 * TestCase is a single input->output test.
 */
export type TestCase = { value?: Type; ok?: Value; notOk?: Value };

/**
 * TestSuite is a collection containing a precondition an various test cases
 * to apply to it.
 */
interface TestSuite<A, B> {
    /**
     * name identifies the particular test suite and can be used to run only
     * that test by specifying the TEST_SUITE_NAME env var.
     */
    name: string;

    /**
     * prec is the precondition to test.
     */
    prec: Precondition<A, B>;

    /**
     * cases are all the test cases to test the precondition under.
     *
     * The env var TEST_CASE_INDEX can be specified to indicate which case to
     * run.
     */
    cases: TestCase[];
}

/**
 * runTestSuites sets up multiple TestSuites.
 *
 * TestSuites are further grouped into a record so that related suites are in
 * their own collection.
 */
export const runTestSuites = <A, B>(tests: Record<TestSuite<A, B>[]>) => {
    for (let [suite, targets] of Object.entries(tests))
        describe(suite, () => {
            let runTarget;

            if (process.env.TEST_SUITE_NAME)
                runTarget = new RegExp(process.env.TEST_SUITE_NAME);

            for (let { name, prec, cases } of targets) {
                if (runTarget && !runTarget.test(name)) continue;

                describe(name, () => {
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
