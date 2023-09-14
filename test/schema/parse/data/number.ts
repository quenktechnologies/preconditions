export const tests = {
    'should parse number schema': {
        type: 'number',
        const: 1,
        default: 2,
        cast: true,
        enum: [1, 2, 3],
        min: 1,
        max: 3
    },
    'should honour boolean builtins': {
        type: 'number',
        cast: false,
        min: 1,
        max: 3
    },
    'should support preconditions key': {
        type: 'number',
        preconditions: [
            ['custom.one', [1]],
            ['custom.two', [2]],
            ['custom.three', [3]]
        ]
    },
    'should support optional': {
        type: 'number',
        optional: true
    }
};
