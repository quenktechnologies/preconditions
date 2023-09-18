export const pipelines = {
    object: {
        type: 'object',
        pipes: [['objectify', []]],
        properties: {
            id: { type: 'string' },

            name: { type: 'string', pipes: [['stringify', []]] }
        },

        additionalProperties: {
            type: 'number',

            pipes: [['numberify', []]]
        }
    },

    array: {
        type: 'array',
        pipes: [['arrayify', []]],
        items: {
            type: 'number',
            pipes: [['numberify', []]]
        }
    },

    string: { type: 'string', pipes: [['stringify', []]] },

    boolean: { type: 'boolean', pipes: [['booleanify', []]] },

    number: {
        type: 'number',

        pipes: [['numberify', []]]
    }
};
