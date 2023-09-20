import { preconditions } from './preconditions';

export const tests = [
    {
        name: 'type=number',
        schema: { type: 'number' },
        cases: [
            { value: 1, ok: 1 },
            { value: -1, ok: -1 },
            { value: '1', notOk: 'number' },
            { value: [], notOk: 'number' }
        ]
    },
    {
        name: 'const=12',
        schema: {
            type: 'number',
            const: 12
        },
        cases: [
            { value: 24, ok: 12 },
            { value: 12, ok: 12 },
            { value: '12', ok: 12 },
            { value: [12], ok: 12 }
        ]
    },
    {
        name: 'default=true',
        schema: { type: 'number', default: 12 },
        cases: [
            { ok: 12 },
            { value: null, ok: 12 },
            { value: 48, ok: 48 },
            { value: '12', notOk: 'number' }
        ]
    },
    {
        name: 'cast=true',
        schema: { type: 'number', cast: true },
        cases: [
            { value: 12, ok: 12 },
            { value: '144826', ok: 144826 },
            { value: {}, notOk: 'NaN' }
        ]
    },
    {
        name: 'enum',
        schema: { type: 'number', enum: [1, 2, 3] },
        cases: [
            { value: 1, ok: 1 },
            { value: 5, notOk: 'exists' }
        ]
    },
    {
        name: 'min=12',
        schema: { type: 'number', min: 12 },
        cases: [
            { value: 24, ok: 24 },
            { value: 12, ok: 12 },
            { value: 1, notOk: 'min' },
            { value: -12, notOk: 'min' }
        ]
    },
    {
        name: 'max=12',
        schema: { type: 'number', max: 12 },
        cases: [
            { value: 12, ok: 12 },
            { value: 1, ok: 1 },
            { value: -12, ok: -12 },
            { value: 24, notOk: 'max' },
            { value: Infinity, notOk: 'max' }
        ]
    },
    {
        name: 'optional',
        schema: { type: 'number', optional: true },
        cases: [{ value: 12 }, {}, { value: '12', notOk: 'number' }]
    },
    {
        name: 'key=pipes',
        options: { key: 'pipes', preconditions },
        schema: { type: 'number', pipes: [['inc', [1]]] },
        cases: [{ value: 11, ok: 12 }]
    },
    {
        name: 'key=pipes (original key)',
        options: { key: 'pipes', preconditions },
        schema: { type: 'number', preconditions: [['inc', [1]]] },
        cases: [{ value: 11 }]
    }
];
