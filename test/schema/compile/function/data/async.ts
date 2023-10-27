import { asyncPreconditionsRaw } from '../../../../data/preconditions';

export const tests = {
    object: [
        {
            name: 'no async pipeline',
            schema: {
                type: 'object',
                const: {}
            },
            cases: [{ value: { n: 1 } }]
        },
        {
            name: 'empty async pipeline',
            schema: {
                type: 'object',
                const: {},
                asyncPreconditions: [],
                properties: {}
            },
            cases: [{ value: { n: 1 } }]
        },
        {
            name: 'single async prec',
            schema: {
                type: 'object',
                const: {},
                asyncPreconditions: [['count', []]]
            },
            cases: [{ value: { n: 1 }, ok: 1 }]
        },
        {
            name: 'multi async precs',
            schema: {
                type: 'object',
                const: {},
                asyncPreconditions: [
                    ['count', []],
                    ['inc', [1]],
                    ['inc', [1]]
                ]
            },
            cases: [{ value: { n: 1 }, ok: 3 }]
        },
        {
            name: 'no async pipeline (properties)',
            schema: {
                type: 'object',
                properties: {
                    n: {
                        type: 'number',
                        const: 12
                    }
                }
            },
            cases: [
                { value: { n: 1 } },
                { value: { n: 1, b: 1 }, ok: { n: 1 } }
            ]
        },
        {
            name: 'empty async pipeline (properties)',
            schema: {
                type: 'object',
                properties: {
                    n: {
                        type: 'number',
                        const: 12,
                        asyncPreconditions: []
                    }
                }
            },
            cases: [
                { value: { n: 1 } },
                { value: { n: 1, b: 1 }, ok: { n: 1 } }
            ]
        },
        {
            name: 'single async prec (properties)',
            schema: {
                type: 'object',
                properties: {
                    n: {
                        type: 'number',
                        const: 12,
                        asyncPreconditions: [['inc', [1]]]
                    }
                }
            },
            cases: [
                { value: { n: 1 }, ok: { n: 2 } },
                { value: { n: 1, b: 1 }, ok: { n: 2 } }
            ]
        },
        {
            name: 'multi async precs (properties)',
            schema: {
                type: 'object',
                properties: {
                    n: {
                        type: 'number',
                        const: 12,
                        asyncPreconditions: [
                            ['inc', [1]],
                            ['identity', []],
                            ['inc', [1]]
                        ]
                    }
                }
            },
            cases: [
                { value: { n: 1 }, ok: { n: 3 } },
                { value: { n: 1, b: 1 }, ok: { n: 3 } }
            ]
        },
        {
            name: 'no async pipeline (additionalProperties)',
            schema: {
                type: 'object',
                additionalProperties: {
                    type: 'number',
                    const: 12
                }
            },
            cases: [{ value: { n: 1 } }]
        },
        {
            name: 'empty async pipeline (additionalProperties)',
            schema: {
                type: 'object',
                additionalProperties: {
                    type: 'number',
                    const: 12,
                    asyncPreconditions: []
                }
            },
            cases: [{ value: { n: 1 } }]
        },
        {
            name: 'single async prec (additionalProperties)',
            schema: {
                type: 'object',
                additionalProperties: {
                    type: 'number',
                    const: 12,
                    asyncPreconditions: [['inc', [1]]]
                }
            },
            cases: [{ value: { n: 1 }, ok: { n: 2 } }]
        },
        {
            name: 'multi async precs (additionalProperties)',
            schema: {
                type: 'object',
                additionalProperties: {
                    type: 'number',
                    const: 12,
                    asyncPreconditions: [
                        ['inc', [1]],
                        ['identity', []],
                        ['inc', [1]]
                    ]
                }
            },
            cases: [{ value: { n: 1 }, ok: { n: 3 } }]
        },
        {
            name: 'inline',
            schema: {
                type: 'object',
                asyncPreconditions: [asyncPreconditionsRaw.stringify()],
                properties: {
                    x: {
                        type: 'number',
                        asyncPreconditions: [asyncPreconditionsRaw.inc(1)]
                    },
                    y: { type: 'number' }
                }
            },
            cases: [{ value: { x: 1, y: 1 }, ok: '{"y":1,"x":2}' }]
        }
    ],
    array: [
        {
            name: 'no async pipeline',
            schema: {
                type: 'array',
                minItems: 100,
                items: { type: 'number' }
            },
            cases: [{ value: [1, 1, 1] }]
        },
        {
            name: 'empty async pipeline',
            schema: {
                type: 'array',
                minItems: 100,
                asyncPreconditions: [],
                items: {
                    type: 'number'
                }
            },
            cases: [{ value: [1, 1, 1] }]
        },
        {
            name: 'single async prec',
            schema: {
                type: 'array',
                minItems: 100,
                asyncPreconditions: [['count', []]],
                items: {
                    type: 'number'
                }
            },
            cases: [{ value: [1, 1, 1], ok: 3 }]
        },
        {
            name: 'multi async precs',
            schema: {
                type: 'array',
                minItems: 100,
                asyncPreconditions: [
                    ['count', []],
                    ['inc', [1]],
                    ['inc', [1]]
                ],
                items: {
                    type: 'number'
                }
            },
            cases: [{ value: [1, 1, 1], ok: 5 }]
        },
        {
            name: 'no async pipeline (items)',
            schema: {
                type: 'array',
                items: { type: 'number', const: 12 }
            },
            cases: [{ value: [1, 1, 1] }]
        },
        {
            name: 'empty async pipeline (items)',
            schema: {
                type: 'array',
                items: {
                    type: 'number',
                    const: 12,
                    asyncPreconditions: []
                }
            },
            cases: [{ value: [1, 1, 1] }]
        },
        {
            name: 'single async prec (items)',
            schema: {
                type: 'array',
                items: {
                    type: 'number',
                    const: 12,
                    asyncPreconditions: [['inc', [1]]]
                }
            },
            cases: [{ value: [1, 1, 1], ok: [2, 2, 2] }]
        },
        {
            name: 'multi async precs (items)',
            schema: {
                type: 'array',
                items: {
                    type: 'number',
                    asyncPreconditions: [
                        ['inc', [1]],
                        ['identity', []],
                        ['inc', [1]]
                    ]
                }
            },
            cases: [{ value: [1, 1, 1], ok: [3, 3, 3] }]
        },

        {
            name: 'inline',
            schema: {
                type: 'array',
                asyncPreconditions: [asyncPreconditionsRaw.stringify()],
                items: {
                    type: 'number',
                    asyncPreconditions: [asyncPreconditionsRaw.inc(1)]
                }
            },
            cases: [{ value: [1, 1, 1], ok: '[2,2,2]' }]
        }
    ],
    string: [
        {
            name: 'no async pipeline',
            schema: { type: 'string', minLength: 1 },
            cases: [{ value: 'hi' }]
        },
        {
            name: 'empty async pipeline',
            schema: { type: 'string', minLength: 1, asyncPreconditions: [] },
            cases: [{ value: 'hi' }]
        },
        {
            name: 'single async prec',
            schema: {
                type: 'string',
                minLength: 1,
                asyncPreconditions: [['concat', ['!']]]
            },
            cases: [{ value: 'hi', ok: 'hi!' }]
        },
        {
            name: 'multi async prec',
            schema: {
                type: 'string',
                minLength: 1,
                asyncPreconditions: [
                    ['concat', ['?']],
                    ['identity', []],
                    ['concat', ['!']]
                ]
            },
            cases: [{ value: 'hi', ok: 'hi?!' }]
        },
        {
            name: 'inline',
            schema: {
                type: 'string',
                asyncPreconditions: [asyncPreconditionsRaw.concat('!')]
            },
            cases: [{ value: 'hello', ok: 'hello!' }]
        }
    ],

    boolean: [
        {
            name: 'no async pipeline',
            schema: { type: 'boolean', const: false },
            cases: [{ value: true }]
        },
        {
            name: 'empty async pipeline',
            schema: { type: 'boolean', const: false, asyncPreconditions: [] },
            cases: [{ value: true }]
        },
        {
            name: 'single async prec',
            schema: {
                type: 'boolean',
                const: false,
                asyncPreconditions: [['flip', []]]
            },
            cases: [{ value: true, ok: false }]
        },
        {
            name: 'multi async prec',
            schema: {
                type: 'boolean',
                const: false,
                asyncPreconditions: [
                    ['flip', []],
                    ['set', [false]],
                    ['flip', []]
                ]
            },
            cases: [{ value: true, ok: true }]
        },
        {
            name: 'inline',
            schema: {
                type: 'boolean',
                asyncPreconditions: [asyncPreconditionsRaw.flip()]
            },
            cases: [{ value: false, ok: true }]
        }
    ],

    number: [
        {
            name: 'no async pipeline',
            schema: { type: 'number', min: 12 },
            cases: [{ value: 11 }]
        },
        {
            name: 'empty async pipeline',
            schema: { type: 'number', min: 12, asyncPreconditions: [] },
            cases: [{ value: 11 }]
        },
        {
            name: 'single async prec',
            schema: {
                type: 'number',
                max: 12,
                asyncPreconditions: [['inc', [1]]]
            },
            cases: [{ value: 11, ok: 12 }]
        },
        {
            name: 'multiple async precs',
            schema: {
                type: 'number',
                max: 12,
                asyncPreconditions: [
                    ['inc', [1]],
                    ['identity', []],
                    ['inc', [2]]
                ]
            },
            cases: [{ value: 9, ok: 12 }]
        },
        {
            name: 'inline',
            schema: {
                type: 'number',
                asyncPreconditions: [asyncPreconditionsRaw.inc(1)]
            },
            cases: [{ value: 11, ok: 12 }]
        }
    ]
};
