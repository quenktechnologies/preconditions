export const tests = [
    {
        name: 'type=array',
        schema: {
            type: 'array',
            items: {
                type: 'number'
            }
        },
        cases: [
            {
                value: [1, 2, 3],
                ok: [1, 2, 3]
            },
            {
                value: new Array(1, 2, 3),
                ok: [1, 2, 3]
            },
            {
                value: Array(1, 2, 3),
                ok: [1, 2, 3]
            },
            {
                value: [1, '2', 3],
                notOk: {
                    1: 'number'
                }
            },
            {
                value: {
                    n: 1
                },
                notOk: 'array'
            }
        ]
    },
    {
        name: 'const=[1]',
        schema: {
            type: 'array',
            const: [1],
            items: {
                type: 'number'
            }
        },
        cases: [
            {
                value: [1],
                ok: [1]
            },
            {
                value: [2],
                ok: [1]
            },
            {
                value: ['a', 'b', 'c'],
                ok: [1]
            },
            {
                value: {
                    n: 1
                },
                ok: [1]
            }
        ]
    },
    {
        name: 'default=[1,2,3]',
        schema: {
            type: 'array',
            default: [1, 2, 3],
            items: {
                type: 'number'
            }
        },
        cases: [
            {
                ok: [1, 2, 3]
            },
            { value: null, ok: [1, 2, 3] },
            {
                value: [3, 4, 5],
                ok: [3, 4, 5]
            },
            {
                value: 12,
                notOk: 'array'
            }
        ]
    },
    {
        name: 'minItems=3',
        schema: {
            type: 'array',
            minItems: 3,
            items: {
                type: 'number'
            }
        },
        cases: [
            {
                value: [1, 2, 3],
                ok: [1, 2, 3]
            },
            {
                value: [1, 2, 3, 4],
                ok: [1, 2, 3, 4]
            },
            {
                value: [1, 2],
                notOk: 'minItems'
            },
            {
                value: [1, 2, '3'],
                notOk: {
                    2: 'number'
                }
            }
        ]
    },
    {
        name: 'maxItems=3',
        schema: {
            type: 'array',
            maxItems: 3,
            items: {
                type: 'number'
            }
        },
        cases: [
            {
                value: [1, 2, 3],
                ok: [1, 2, 3]
            },
            {
                value: [1, 2],
                ok: [1, 2]
            },
            {
                value: [1, 2, 3, 4],
                notOk: 'maxItems'
            },
            {
                value: [1, '3'],
                notOk: {
                    1: 'number'
                }
            }
        ]
    },
    {
        name: 'nonEmpty',
        schema: {
            type: 'array',
            nonEmpty: true,
            items: {
                type: 'string'
            }
        },
        cases: [
            {
                value: ['a', 'b', 'c'],
                ok: ['a', 'b', 'c']
            },
            {
                value: [''],
                ok: ['']
            },
            {
                value: [],
                notOk: 'nonEmpty'
            }
        ]
    },
    {
        name: 'optional',
        schema: { type: 'array', optional: true, items: { type: 'number' } },
        cases: [
            { value: [1] },
            { value: [] },
            {},
            { value: ['1'], notOk: { '0': 'number' } }
        ]
    },
    {
        name: 'optional (items)',
        schema: { type: 'array', items: { type: 'number', optional: true } },
        cases: [
            { value: [1] },
            { value: [] },
            { value: [undefined] },
            { value: ['1'], notOk: { '0': 'number' } }
        ]
    },
    {
        name: 'key=pipes',
        options: { key: 'pipes' },
        schema: {
            type: 'array',
            items: { type: 'number' },
            pipes: [['stringify', []]]
        },
        cases: [{ value: [1, 2, 3], ok: '1,2,3' }]
    },
    {
        name: 'key=pipes (original key)',
        options: { key: 'pipes' },
        schema: {
            type: 'array',
            items: { type: 'number' },
            preconditions: [['stringify', []]]
        },
        cases: [{ value: [1, 2, 3] }]
    }
];
