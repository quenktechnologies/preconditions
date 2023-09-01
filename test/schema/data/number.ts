export const tests = {
    'should parse number schema': {
        input: {
            type: 'number',
            const: 1,
            default: 2,
            cast: true,
            enum: [1, 2, 3],
            min: 1,
            max: 3
        },
        expected: [
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

    'should honour boolean builtins': {
        input: {
            type: 'number',
            cast: false,
            min: 1,
            max: 3
        },
        expected: [
            'number',
            [
                ['base.type', ['number']],
                ['number.min', [1]],
                ['number.max', [3]]
            ]
        ]
    },
    'should support preconditions key': {
        input: {
            type: 'number',
            preconditions: [
                ['custom.one', [1]],
                ['custom.two', [2]],
                ['custom.three', [3]]
            ]
        },
        expected: [
            'number',
            [
                ['base.type', ['number']],
                ['custom.one', [1]],
                ['custom.two', [2]],
                ['custom.three', [3]]
            ]
        ]
    }
};
