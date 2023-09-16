export const allBuiltins = {
    object: {
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
    array: {
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
    string: {
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
    boolean: {
        type: 'boolean',
        const: false,
        default: true,
        cast: true,
        enum: [false]
    },
    number: {
        type: 'number',
        const: 1,
        default: 2,
        cast: true,
        enum: [1, 2, 3],
        min: 1,
        max: 3
    }
};
