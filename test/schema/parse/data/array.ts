export const tests = {
    'should parse array schema': {
        type: 'array',
        const: [1],
        default: [2],
        cast: true,
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
    'should honour boolean builtins': {
        type: 'array',
        cast: false,
        maxItems: 3,
        items: {
            type: 'number',
            cast: false
        }
    },
    'should support the preconditions key': {
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
    'should support optional': {
        type: 'array',
        optional: true,
        items: {
            type: 'string'
        }
    },
    'should support optional (items)': {
        type: 'array',
        items: {
            optional: true,
            type: 'string'
        }
    }
};
