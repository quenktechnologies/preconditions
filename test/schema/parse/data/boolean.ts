export const tests = {
    'should parse boolean schema': {
        input: {
            type: 'boolean',
            const: false,
            default: true,
            cast: true,
            enum: [false]
        },
        expected: [
            'boolean',
            [
                ['base.default', [true]],
                ['boolean.cast', [true]],
                ['base.const', [false]],
                ['base.type', ['boolean']],
                ['base.enum', [[false]]]
            ]
        ]
    },
    'should honour boolean builtins': {
        input: {
            type: 'boolean',
            const: false,
            cast: false
        },
        expected: [
            'boolean',
            [
                ['base.const', [false]],
                ['base.type', ['boolean']]
            ]
        ]
    },
    'should support preconditions key': {
        input: {
            type: 'boolean',
            preconditions: [
                ['custom.one', [1]],
                ['custom.two', [2]],
                ['custom.three', [3]]
            ]
        },
        expected: [
            'boolean',
            [
                ['base.type', ['boolean']],
                ['custom.one', [1]],
                ['custom.two', [2]],
                ['custom.three', [3]]
            ]
        ]
    }
};
