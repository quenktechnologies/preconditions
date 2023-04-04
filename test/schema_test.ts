import { mapTo } from '@quenk/noni/lib/data/record';
import { Type } from '@quenk/noni/lib/data/type';
import { Value } from '@quenk/noni/lib/data/jsonx';

import { assert } from '@quenk/test/lib/assert';

import { Context, fromSchema, JSONPrecondition, Options, Schema } from '../lib/schema';
import { succeed } from '../lib/result';

interface Test { input: Type, output?: Type, ok: boolean, msg?: string }

interface TestConf {

    options?: Partial<Options>,

    schema: Schema,

    badSchema?: boolean,

    test: Test | Test[]
}


let count = 0;

let context = <Context>{
    inc: (n: number) => succeed(n + 1),
    mul: (n: number) => (m: number) => succeed(n * m),
    lowercase: (s: string) => succeed(s.toLowerCase()),
    append: (s: string) => (a: string) => succeed(s + a),
    flip: (b: boolean) => succeed(!b),
    flipif: (b: boolean) => (f: boolean) => succeed(f ? !b : b),
};

const counter: JSONPrecondition = (val: Value) => {
    count++;
    return succeed(val);
}

const runTest = (conf: TestConf) => {
    let eprec = fromSchema(conf.options || {}, conf.schema);
    assert(eprec.isRight(), 'precondition created').true();

    let prec = eprec.takeRight();

    for (let test of Array.isArray(conf.test) ? conf.test : [conf.test]) {
        count = 0;
        if (test.ok) {
            let result = prec(test.input);
            assert(result.isRight(), test.msg || 'input satisfied precondition').true();
            assert(result.takeRight()).equate(test.output != null ? test.output : test.input);
        } else {
            let result = prec(test.input);
            assert(result.isLeft(), test.msg || 'bad input failed precondition').true();
            assert(result.takeLeft().explain()).equate(test.output);
        }

    }
}

describe('schema', () => {
    describe('fromSchema', () => {
        describe('object type', () => {
            let schema = {
                type: 'object',
                properties: {
                    name: { type: 'string', minLength: 3 },
                    age: { type: 'number', min: 18 },
                    active: { type: 'boolean' },
                    tags: { type: 'array', items: { type: 'string' } },
                    filters: {
                        type: 'object',
                        properties: {
                            name: { type: 'number' },
                            age: { type: 'number' },
                            active: { type: 'number' }
                        }
                    }
                }
            };
            it('should produce a precondition', () => runTest({
                schema,
                test: [
                    {
                        ok: true,
                        input: {
                            name: 'John',
                            age: 25,
                            active: false,
                            tags: ['user', 'archived'],
                            filters: { name: 1, age: 0, active: 1 }
                        }
                    },
                    {
                        ok: false,
                        input: {
                            name: 'J',
                            age: 12,
                            active: 'yes',
                            tags: 'user,active',
                            filters: { name: 'yes', age: 'yes', active: 'yes' }
                        },
                        output: {
                            name: 'minLength',
                            age: 'min',
                            tags: 'isArray',
                            filters: { name: 'NaN', age: 'NaN', active: 'NaN' }
                        }
                    }]
            }))

            it('should cast properties when strict is false', () => runTest({
                options: { strict: false },
                schema,
                test: {
                    ok: true,
                    input: {
                        name: ['John'],
                        age: '25',
                        active: 0,
                        tags: [['user'], ['archived']],
                        filters: { name: '1', age: '0', active: '1' }
                    },
                    output: {
                        name: 'John',
                        age: 25,
                        active: true,
                        tags: ['user', 'archived'],
                        filters: { name: 1, age: 0, active: 1 }
                    }
                }
            }))

            it('should not cast properties when strict is true', () => runTest({
                options: { strict: true },
                schema: schema,
                test: {
                    ok: false,
                    input: {
                        name: ['John'],
                        age: '25',
                        active: 0,
                        tags: [['user'], ['archived']],
                        filters: { name: '1', age: '0', active: '1' }
                    },
                    output: {
                        name: 'isString',
                        age: 'isNumber',
                        active: 'isBoolean',
                        tags: { 0: 'isString', 1: 'isString' },
                        filters: { name: 'isNumber', age: 'isNumber', active: 'isNumber' }
                    }
                }
            }));

            let getInput = () => ({
                name: 'John',
                age: 25,
                active: false,
                tags: ['user', 'archived'],
                filters: { name: 1, age: 0, active: 1 }
            });

            xit('should not permit missing properties', () => {

                return runTest({
                    schema,
                    test: mapTo({
                        name: 'isString',
                        age: 'NaN', tags: 'isArray', filters: 'isRecord'
                    }, (err, key) => {
                        let input = getInput();
                        delete input[key];
                        return { ok: false, input, output: { [key]: err } };
                    })
                })
            });

            it('should not permit missing properties (strict)', () => {
                return runTest({
                    options: { strict: true },
                    schema,
                    test: mapTo({
                        name: 'isString',
                        age: 'isNumber', active: 'isBoolean', tags: 'isArray', filters: 'isRecord'
                    }, (err, key) => {
                        let input = getInput();
                        delete input[key];
                        return { ok: false, input, output: { [key]: err } };
                    })
                })
            });

            it('should allow nullable optional properties', () => runTest({
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', minLength: 3 },
                        age: { type: 'number', min: 18, optional: true },
                        tags: { type: 'array', items: { type: 'string' }, optional: true },
                        filters: {
                            type: 'object',
                            optional: true,
                            properties: {
                                name: { type: 'number' },
                                age: { type: 'number' },
                                active: { type: 'number' }
                            }
                        }
                    }
                },
                test: [
                    {
                        ok: true,
                        input: {
                            name: 'John',
                        }
                    },
                    {
                        ok: false,
                        input: {
                            age: 12,
                            tags: 'user,active',
                            filters: 'yes'
                        },
                        output: {
                            age: 'min',
                            tags: 'isArray',
                            filters: 'isRecord'
                        }
                    }]
            }));

            it('should allow partial objects', () => runTest({
                options: { partial: true },
                schema,
                test: [
                    {
                        ok: true,
                        input: {
                            name: 'John',
                        }
                    },
                    {
                        ok: false,
                        input: {
                            age: 12,
                        },
                        output: {
                            age: 'min',
                        }
                    },
                    {
                        ok: true,
                        input: {
                            tags: ['a', 'b']
                        },
                    }

                ]
            }));

            it('should allow nested partial objects', () => runTest({
                options: { partial: true },
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        l2: { type: 'object', properties: { id: { type: 'number' }, l3: schema } }
                    }
                },
                test: [
                    {
                        ok: true,
                        input: {
                            name: 'John',
                        }
                    },
                    {
                        ok: true,
                        input: {
                            l2: { id: 10 },
                        }
                    },
                    {
                        ok: true,
                        input: {
                            l2: {
                                l3: { age: 24 },
                            },
                        }
                    },
                    {
                        ok: false,
                        input: {
                            l2: {
                                l3: { age: 14 },
                            },
                        },
                        output: { l2: { l3: { age: 'min' } } }
                    },
                    {
                        ok: false,
                        input: {

                            l2: { id: ['a', 10] }

                        },
                        output: { l2: { id: 'NaN' } }
                    }
                ]
            }));

            it('should include pipelines', () => {

                runTest({

                    options: { context },

                    schema: {
                        type: 'object',
                        properties: {

                            name: {
                                type: 'string',
                                pipeline: [['append', ['x']], counter, 'lowercase']
                            },
                            age: {
                                type: 'number',
                                pipeline: [counter, 'inc', ['mul', [10]]]
                            },

                            active: {
                                type: 'boolean',
                                pipeline: ['flip', ['flipif', [true]], counter]
                            },

                            tags: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    pipeline: [['append', ['x']], counter, 'lowercase']
                                }
                            }
                        }
                    },
                    test: {
                        ok: true, input: {
                            name: 'XX',
                            age: 1,
                            active: false,
                            tags: ['XX', 'XX', 'XX']
                        }, output: {
                            name: 'xxx',
                            age: 20,
                            active: false,
                            tags: ['xxx', 'xxx', 'xxx']
                        }
                    }
                });

                assert(count).equal(6);
            })

        })

        describe('array type', () => {
            it('should produce a precondition for an array schema', () => runTest({
                schema: {
                    type: 'array',
                    minLength: 2,
                    maxLength: 4,
                    items: {
                        type: 'number'
                    }
                },
                test: [
                    { ok: true, input: [1, 2, 3] },
                    { ok: false, input: [1], output: 'minLength' },
                    { ok: false, input: [1, 2, 3, 4, 5], output: 'maxLength' },
                    { ok: false, input: [1, 2, 'three', 4], output: { 2: 'NaN' } }
                ]
            }));

            it('should produce a precondition for an array schema with object items', () => runTest({
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', minLength: 3 },
                            age: { type: 'number', min: 18 },
                            active: { type: 'boolean' }
                        }
                    }
                },
                test: [
                    {
                        ok: true,
                        input: [
                            { name: 'John', age: 25, active: false },
                            { name: 'Jane', age: 30, active: true },
                            { name: 'Jack', age: 40, active: false }
                        ]
                    },
                    {
                        ok: false,
                        input: [
                            { name: 'J', age: 12, active: 'yes' },
                            { name: 'Mary', age: 17, active: false },
                            { name: 'Bob', age: 22, active: 'no' }
                        ],
                        output: {
                            0: { name: 'minLength', age: 'min' },
                            1: { age: 'min' }
                        }
                    }
                ]
            }));

            xit('should produce a precondition for an array schema with array items', () => runTest({
                schema: {
                    type: 'array',
                    items: {
                        type: 'array',
                        items: { type: 'number' }
                    }
                },

                test: [
                    {
                        ok: true,
                        input: [
                            [1, 2, 3],
                            [4, 5, 6],
                            [7, 8, 9, 10]
                        ]
                    },
                    {
                        ok: false,
                        input: [
                            [1, 2],
                            [3, 'four'],
                            [5, 6, 7, {}, 9]
                        ],
                        output: {
                            '1': { '1': 'NaN' },
                            '2': { '3': 'NaN' }
                        }
                    }
                ]
            }))

            it('should cast array items when strict is false', () => runTest({
                schema: {
                    type: 'array',
                    items: {
                        type: 'number'
                    }
                },
                test: [
                    {
                        ok: true,
                        input: ['12'],
                        output: [12]
                    }]
            }));

            it('should not cast array items when strict is true', () => runTest({
                options: { strict: true },
                schema: {
                    type: 'array',
                    items: {
                        type: 'boolean'
                    }
                },
                test: [
                    {
                        ok: false,
                        input: ['yes'],
                        output: { 0: 'isBoolean' }
                    }
                ]
            }));

            it('should include array type pipelines', () => {
                runTest({
                    options: { context },
                    schema: {
                        type: 'array',
                        items: {
                            type: 'string',
                            pipeline: [['append', ['x']], counter, 'lowercase']
                        }
                    },
                    test: {
                        ok: true,
                        input: ['XX', 'XX', 'XX'],
                        output: ['xxx', 'xxx', 'xxx']
                    }
                });

                assert(count, 'counter invoked').equal(3);

            });

            it('should be nullable when optional is set', () => runTest({
                schema: {
                    type: 'array',
                    minLength: 100,
                    optional: true,
                    items: {
                        type: 'number'
                    }
                },
                test:
                    { ok: true, input: undefined },
            }));

            it('should not be nullable if the items schema is optional', () => runTest({
                schema: {
                    type: 'array',
                    minLength: 100,
                    items: {
                        type: 'number',
                        optional: true,
                    }
                },
                test:
                    { ok: false, input: undefined, output: 'isArray' },
            }));

        });

        describe('string type', () => {
            it('should produce a precondition for a string schema', () => runTest({
                schema: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 16,
                    pattern: '^[a-z@.]+$',
                },
                test: [
                    {
                        ok: true,
                        input: 'user@example.com'
                    },
                    {
                        ok: false,
                        input: 'u',
                        output: 'minLength'
                    },
                    {
                        ok: false,
                        input: 'user@example.com@',
                        output: 'maxLength'
                    },
                    {
                        ok: false,
                        input: 'user-example.com',
                        output: 'matches'
                    }
                ]
            }));

            it('should produce a precondition for a string schema with a regex', () => runTest({
                schema: {
                    type: 'string',
                    pattern: /[a-z]+/
                },

                test: [
                    { ok: true, input: 'hello' },
                    { ok: false, input: 'HELLO', output: 'matches' }
                ]
            }))

            it('should produce a precondition for a string schema with enum values', () => runTest({
                schema: {
                    type: 'string',
                    enum: ['foo', 'bar', 'baz'],
                    minLength: 5,
                    maxLength: 26,
                    pattern: /^[a-z]+$/
                },
                test: [
                    { ok: true, input: 'bar' },
                    { ok: false, input: 'qux', output: 'exists' },
                    { ok: false, input: 'abcdefghijklmnopqrstuvwxyz', output: 'exists' },
                    { ok: false, input: '', output: 'exists' }
                ]
            }))

            it('should cast to string when strict is false', () => runTest({
                options: { strict: false },
                schema: {
                    type: 'string',
                },
                test: [
                    { ok: true, input: ['str'], output: 'str' }
                ]
            }));

            it('should not cast to string when strict is true', () => runTest({
                options: { strict: true },
                schema: {
                    type: 'string',
                },
                test: [
                    {
                        ok: false,
                        input: ['str'],
                        output: 'isString'
                    }
                ]
            }));

            it('should include string type pipelines', () => {

                runTest({
                    options: { context },
                    schema: {
                        type: 'string',
                        pipeline: [['append', ['x']], counter, 'lowercase']
                    },
                    test: {
                        ok: true,
                        input: 'XX',
                        output: 'xxx'
                    }
                });
            })

            it('should be nullable if optional is set', () => runTest({
                schema: {
                    type: 'string',
                    optional: true
                },
                test: {
                    ok: true,
                    input: undefined,
                },
            }));

        });

        describe('number type', () => {
            it('should produce a precondition for a number schema', () => runTest({
                schema: {
                    type: 'number',
                    min: 0,
                    max: 10
                },
                test: [
                    { ok: true, input: 5 },
                    { ok: false, input: -1, output: 'min' },
                    { ok: false, input: 11, output: 'max' }
                ]
            }));

            it('should produce a precondition for a number schema with enum values', () => runTest({
                schema: {
                    type: 'number',
                    enum: [1, 2, 3],
                    min: 10,
                    max: 40
                },
                test: [
                    { ok: true, input: 2 },
                    { ok: false, input: 10, output: 'exists' },
                    { ok: false, input: 34, output: 'exists' }
                ]
            }));

            it('should cast to number when strict is false', () => runTest({
                options: { strict: false },
                schema: {
                    type: 'number',
                },
                test: [
                    { ok: true, input: '12', output: 12 },
                ]

            }));

            it('should not cast to number when strict is true', () => runTest({
                options: { strict: true },
                schema: {
                    type: 'number',
                },
                test: [
                    {
                        ok: false,
                        input: '12',
                        output: 'isNumber'
                    }
                ]
            }))

            it('should detect bad number casts', () => {

                assert(fromSchema({ strict: false }, { type: 'number' }).takeRight()({}).takeLeft().explain()).equal('NaN');

            });

            it('should include number pipelines', () => {

                runTest({
                    options: { context },
                    schema: {
                        type: 'number',
                        pipeline: [counter, 'inc', ['mul', [10]]]
                    },
                    test: {
                        ok: true,
                        input: 1,
                        output: 20
                    }
                });

                assert(count, 'counter invoked').equal(1);

            });

            it('should be nullable if optional is set', () => runTest({
                schema: {
                    type: 'number',
                    optional: true
                },
                test: {
                    ok: true,
                    input: undefined,
                },
            }));
        });

        describe('boolean type', () => {
            it('should produce a precondition for a boolean schema', () => runTest({
                schema: { type: 'boolean' },
                test: [
                    { ok: true, input: true, msg: 'true input satisfied precondition' },
                    { ok: true, input: false, msg: 'input satisfied precondition' },
                    { ok: true, input: 'yes', output: true, msg: 'non-boolean input is cast' }
                ]
            }));

            it('should cast to boolean when strict is false', () => runTest({
                schema: {
                    type: 'boolean',
                },
                test: [{
                    ok: true,
                    input: [],
                    output: true,
                    msg: 'input casted'
                }
                ]
            }));

            it('should not cast to boolean when strict is true', () => runTest({
                options: { strict: true },
                schema: {
                    type: 'boolean',
                },
                test: [
                    { ok: false, input: [], output: 'isBoolean', msg: 'input not casted' }
                ]

            }));

            it('should include boolean pipelines', () => {

                runTest({
                    options: { context },
                    schema: {
                        type: 'boolean',
                        pipeline: ['flip', ['flipif', [true]], counter]
                    },
                    test: {
                        ok: true,
                        input: false,
                        output: false
                    }
                });

                assert(count, 'counter invoked').equal(1);

            });

            it('should be nullable if optional is set', () => runTest({
                schema: {
                    type: 'boolean',
                    optional: true
                },
                test: {
                    ok: true,
                    input: undefined,
                },
            }));


        })
        describe('refs', () => {

            it('should not produce a precondition if a ref is missing', () => {
                let eprec = fromSchema({}, {
                    type: 'boolean',
                    pipeline: ['flip', ['flipix', []], counter]
                });
                assert(eprec.isLeft()).true();
                assert(eprec.takeLeft().message.includes('"flip" not found')).true();

                eprec = fromSchema({}, {
                    type: 'boolean',
                    pipeline: [counter, ['flipx', []]]
                });
                assert(eprec.isLeft()).true();
                assert(eprec.takeLeft().message.includes('"flipx" not found')).true();

            });

        });

    });
})
