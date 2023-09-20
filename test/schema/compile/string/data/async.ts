export const asyncSchema = {
    object: {
        type: 'object',
        asyncPreconditions: [['objectify', []]],
        properties: {
            id: { type: 'string' },

            name: { type: 'string', asyncPreconditions: [['stringify', []]] }
        },

        additionalProperties: {
            type: 'number',

            asyncPreconditions: [['numberify', []]]
        }
    },

    array: {
        type: 'array',
        asyncPreconditions: [['arrayify', []]],
        items: {
            type: 'number',
            asyncPreconditions: [['numberify', []]]
        }
    },

    string: { type: 'string', asyncPreconditions: [['stringify', []]] },

    boolean: { type: 'boolean', asyncPreconditions: [['booleanify', []]] },

    number: {
        type: 'number',

        asyncPreconditions: [['numberify', []]]
    }
};
