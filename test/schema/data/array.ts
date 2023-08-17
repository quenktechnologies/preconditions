import { just } from '@quenk/noni/lib/data/maybe';

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
                just([
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
                ]),
                [
                    ['base.default', [[2]]],
                    ['array.cast', [true]],
                    ['base.const', [[1]]],
                    ['base.type', ['array']],
                    ['base.enum', [[[1], [2], [3]]]],
                    ['array.minItems', [1]],
                    ['array.maxItems', [3]]
                ]
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
                just(['number', [['base.type', ['number']]]]),
                [
                    ['base.type', ['array']],
                    ['array.maxItems', [3]]
                ]
            ]
        ]
    }
};
