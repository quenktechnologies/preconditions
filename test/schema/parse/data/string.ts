export const tests = {
    'should parse string schema': {
        type: 'string',
        const: ':(',
        default: ':)',
        cast: true,
        enum: [':)', ':(', '>:('],
        minLength: 3,
        maxLength: 2,
        pattern: '/[:(>(]/',
        trim: true,
        lowerCase: true,
        upperCase: true
    },
    'should honour boolean builtins': {
        type: 'string',
        default: ':)',
        cast: false,
        trim: false,
        lowerCase: false,
        upperCase: false
    },
    'should support preconditions key': {
        type: 'string',
        preconditions: [
            ['custom.one', [1]],
            ['custom.two', [2]],
            ['custom.three', [3]]
        ]
    },
    'should support optional': {
        type: 'string',
        optional: true
    }
};
