export const tests = {
    'should parse object schema': {
        type: 'object',
        const: {
            n: 1
        },
        default: {
            n: 2
        },
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
    'should work without properties': {
        type: 'object',
        additionalProperties: {
            type: 'boolean',
            cast: false
        }
    },
    'should support the preconditions key': {
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
    'should support optional': {
        type: 'object',
        optional: true,
        properties: {
            id: { type: 'number' }
        },
        additionalProperties: {
            type: 'string'
        }
    },

    'should support optional (properties)': {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string', optional: true }
        },
        additionalProperties: {
            type: 'string'
        }
    },
    'should support optional (additionalProperties)': {
        type: 'object',
        properties: {
            id: { type: 'number' }
        },
        additionalProperties: {
            type: 'string',
            optional: true
        }
    },
 'should ignore readOnly properties': {
        type: 'object',
        properties: {
          id: { type: 'number', readOnly:true},
          name: {type:'string' },
          active: { type: 'boolean', readOnly: false }
        },
    },

 'should not ignore readOnly properties with a pipeline': {
        type: 'object',
        properties: {
          id: { type: 'number', readOnly:true, preconditions: [['test']]},
          name: {type:'string' },
          active: { type: 'boolean', readOnly: false }
        },
    }

};
