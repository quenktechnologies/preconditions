export const tests = {
    'should parse array schema': {
        input: {
            type: 'array',
            const: [1],
            default: [2],
            cast: true,
            enum: [[1], [2], [3]],
            minItems: 1,
            maxItems: 3,
            items: {
                type: 'number',
                const: 1,
                default: 2,
                cast: true,
                enum: [1, 2, 3],
                min: 1,
                max: 3
            }
        },

        expected: [
            'array',
            [
                [
                    ['base.default', [[2]]],
                    ['base.const', [[1]]],
                    ['base.type', ['array']],
                    ['array.minItems', [1]],
                    ['array.maxItems', [3]]
                ],
                [
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
                ],
                []
            ]
        ]
    },
    'should honour boolean builtins': {
        input: {
            type: 'array',
            cast: false,
            maxItems: 3,
            items: {
                type: 'number',
                cast: false
            }
        },

        expected: [
            'array',
            [
                [
                    ['base.type', ['array']],
                    ['array.maxItems', [3]]
                ],
                ['number', [['base.type', ['number']]]],
                []
            ]
        ]
    },
    'should support the preconditions key': {
        input: {
            type: 'array',
            maxItems: 3,
            preconditions: [
                ['custom.one', [[1]]],
                ['custom.two', [[2]]],
                ['custom.three', [[3]]]
            ],
            items: {
                type: 'number',
                preconditions: [
                    ['custom.one', [1]],
                    ['custom.two', [2]],
                    ['custom.three', [3]]
                ]
            }
        },

        expected: [
            'array',
            [
                [
                    ['base.type', ['array']],
                    ['array.maxItems', [3]]
                ],

                [
                    'number',
                    [
                        ['base.type', ['number']],
                        ['custom.one', [1]],
                        ['custom.two', [2]],
                        ['custom.three', [3]]
                    ]
                ],
                [
                    ['custom.one', [[1]]],
                    ['custom.two', [[2]]],
                    ['custom.three', [[3]]]
                ]
            ]
        ]
    }
};
