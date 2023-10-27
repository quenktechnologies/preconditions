import { preconditions } from '../../../../data/preconditions';

export const tests = [
    {
        name: 'type=boolean',
        schema: { type: 'boolean' },
        cases: [
            { value: true, ok: true },
            { value: false, ok: false },
            { value: 'true', notOk: 'boolean' },
            { value: 'false', notOk: 'boolean' },
            { value: [], notOk: 'boolean' }
        ]
    },
    {
        name: 'const=true',
        schema: {
            type: 'boolean',
            const: true
        },
        cases: [
            { value: true, ok: true },
            { value: false, ok: true },
            { value: [true], ok: true }
        ]
    },
    {
        name: 'const=false',
        schema: {
            type: 'boolean',
            const: false
        },
        cases: [
            { value: true, ok: false },
            { value: false, ok: false },
            { value: [true], ok: false }
        ]
    },
    {
        name: 'default=true',
        schema: { type: 'boolean', default: true },
        cases: [
            { ok: true },
            { value: null, ok: true },
            { value: false, ok: false },
            { value: 'true', notOk: 'boolean' }
        ]
    },
    {
        name: 'default=false',
        schema: { type: 'boolean', default: false },
        cases: [
            { ok: false },
            { value: true, ok: true },
            { value: 'true', notOk: 'boolean' }
        ]
    },
    {
        name: 'cast=true',
        schema: { type: 'boolean', cast: true },
        cases: [
            { value: 0, ok: false },
            { value: 1, ok: true }
        ]
    },
    {
        name: 'enum',
        schema: { type: 'boolean', enum: [false] },
        cases: [
            { value: false, ok: false },
            { value: true, notOk: 'exists' }
        ]
    },
    {
        name: 'optional',
        schema: { type: 'boolean', optional: true },
        cases: [{ value: true }, {}, { value: 1, notOk: 'boolean' }]
    },
    {
        name: 'key=pipes',
        options: { key: 'pipes' },
        schema: { type: 'boolean', pipes: [['flip', []]] },
        cases: [{ value: true, ok: false }]
    },
    {
        name: 'key=pipes (original key)',
        options: { key: 'pipes' },
        schema: { type: 'boolean', preconditions: [['flip', []]] },
        cases: [{ value: true }]
    },
    {
        name: 'inline',
        schema: { type: 'boolean', preconditions: [preconditions.flip()] },
        cases: [{ value: false, ok: true }]
    }
];
