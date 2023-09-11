export const tests = {
    'should parse object schema': {
        input: {
            type: 'object',
            const: {
                n: 1
            },
            default: {
                n: 2
            },
            enum: [
                {
                    n: 1
                },
                {
                    n: 2
                },
                {
                    n: 3
                }
            ],
            properties: {
                n: {
                    type: 'number',
                    const: 1,
                    default: 2,
                    cast: true,
                    enum: [1, 2, 3],
                    min: 1,
                    max: 3
                }
            },
            additionalProperties: {
                type: 'boolean',
                const: false,
                default: true,
                cast: true,
                enum: [false]
            }
        },
        expected: [
            'object',
            [
                {
                    n: [
                        'number',
                        [
                            ['base.default', [2]],
                            ['number.cast', [true]],
                            ['base.const', [1]],
                            ['base.type', ['number']],
                            ['base.enum', [[1, 2, 3]]],
                            ['number.min', [1]],
                            ['number.max', [3]]
                        ]
                    ]
                },
                [
                    'boolean',
                    [
                        ['base.default', [true]],
                        ['boolean.cast', [true]],
                        ['base.const', [false]],
                        ['base.type', ['boolean']],
                        ['base.enum', [[false]]]
                    ]
                ],
                [
                    [
                        'base.default',
                        [
                            {
                                n: 2
                            }
                        ]
                    ],
                    [
                        'base.const',
                        [
                            {
                                n: 1
                            }
                        ]
                    ],
                    ['base.type', ['object']],
                    [
                        'base.enum',
                        [
                            [
                                {
                                    n: 1
                                },
                                {
                                    n: 2
                                },
                                {
                                    n: 3
                                }
                            ]
                        ]
                    ]
                ]
            ]
        ]
    },
    'should work without properties': {
        input: {
            type: 'object',
            additionalProperties: {
                type: 'boolean',
                cast: false
            }
        },
        expected: [
            'object',
            [
                {},
                ['boolean', [['base.type', ['boolean']]]],
                [['base.type', ['object']]]
            ]
        ]
    },
    'should support the preconditions key': {
        input: {
            type: 'object',
            preconditions: [
                [
                    'custom.one',
                    [
                        {
                            n: 1
                        }
                    ]
                ],
                [
                    'custom.two',
                    [
                        {
                            n: 2
                        }
                    ]
                ],
                [
                    'custom.three',
                    [
                        {
                            n: 3
                        }
                    ]
                ]
            ],
            properties: {
                n: {
                    type: 'number',
                    preconditions: [
                        ['custom.one', [1]],
                        ['custom.two', [2]],
                        ['custom.three', [3]]
                    ]
                }
            },
            additionalProperties: {
                type: 'boolean',
                preconditions: [
                    ['custom.one', [true]],
                    ['custom.two', [false]],
                    ['custom.three', [true]]
                ]
            }
        },
        expected: [
            'object',
            [
                {
                    n: [
                        'number',
                        [
                            ['base.type', ['number']],
                            ['custom.one', [1]],
                            ['custom.two', [2]],
                            ['custom.three', [3]]
                        ]
                    ]
                },
                [
                    'boolean',
                    [
                        ['base.type', ['boolean']],
                        ['custom.one', [true]],
                        ['custom.two', [false]],
                        ['custom.three', [true]]
                    ]
                ],
                [
                    ['base.type', ['object']],
                    [
                        'custom.one',
                        [
                            {
                                n: 1
                            }
                        ]
                    ],
                    [
                        'custom.two',
                        [
                            {
                                n: 2
                            }
                        ]
                    ],
                    [
                        'custom.three',
                        [
                            {
                                n: 3
                            }
                        ]
                    ]
                ]
            ]
        ]
    }
};