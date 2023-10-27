export const allInline = {
    object: {
        type: 'object',
        preconditions: [['objectify', []], 'dedupe'],
        asyncPreconditions: [['asyncObjectify', []], 'asyncDedupe'],
        properties: {
            id: {
                type: 'string'
            },

            name: {
                type: 'string',
                trim: true,
                preconditions: [['stringify', []], 'uppercase'],
                asyncPreconditions: [['asyncStringify', []], 'asyncUppercase']
            }
        },

        additionalProperties: {
            type: 'number',
            min: 12,
            preconditions: [['numberify', []], 'inc(1)'],
            asyncPreconditions: [['asyncNumberify', []], 'asyncInc(1)']
        }
    },

    array: {
        type: 'array',
        preconditions: [['arrayify', []], 'dedupe'],
        asyncPreconditions: [['asyncArrayify', []], 'asyncDedupe'],
        items: {
            type: 'number',
            min: 12,
            preconditions: [['numberify', []], 'inc(1)'],
            asyncPreconditions: [['asyncNumberify', []], 'asyncInc(1)']
        }
    },

    string: {
        type: 'string',
        trim: true,
        preconditions: [['stringify', []], 'uppercase'],
        asyncPreconditions: [['asyncStringify', []], 'asyncUppercase']
    },

    boolean: {
        type: 'boolean',
        default: false,
        preconditions: [['booleanify', []], 'set(true)'],
        asyncPreconditions: [['asyncBooleanify', []], 'asyncSet(true)']
    },

    number: {
        type: 'number',
        min: 12,
        preconditions: [['numberify', []], 'inc(1)'],
        asyncPreconditions: [['asyncNumberify', []], 'asyncInc(1)']
    }
};
