export const tests = {
    'should parse string schema': {
        input: {
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
        expected: [
            'string',
            [
                ['base.default', [':)']],
                ['string.cast', [true]],
                ['base.const', [':(']],
                ['base.type', ['string']],
                ['base.enum', [[':)', ':(', '>:(']]],
                ['string.minLength', [3]],
                ['string.maxLength', [2]],
                ['string.pattern', ['/[:(>(]/']],
                ['string.trim', [true]],
                ['string.lowerCase', [true]],
                ['string.upperCase', [true]]
            ]
        ]
    },
    'should honour boolean builtins': {
        input: {
            type: 'string',
            default: ':)',
            cast: false,
            trim: false,
            lowerCase: false,
            upperCase: false
        },
        expected: [
            'string',
            [
                ['base.default', [':)']],
                ['base.type', ['string']]
            ]
        ]
    },
    'should support preconditions key': {
        input: {
            type: 'string',
            preconditions: [
                ['custom.one', [1]],
                ['custom.two', [2]],
                ['custom.three', [3]]
            ]
        },
        expected: [
            'string',
            [
                ['base.type', ['string']],
                ['custom.one', [1]],
                ['custom.two', [2]],
                ['custom.three', [3]]
            ]
        ]
    }
};
