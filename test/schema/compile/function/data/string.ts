export const tests = [
    {
        name: 'type=string',
        schema: {
            type: 'string'
        },
        cases: [
            {
                value: 'str',
                ok: 'str'
            },
            {
                value: String('hi'),
                ok: 'hi'
            },
            {
                value: new String('hi'),
                notOk: 'string'
            },
            {
                value: ['a', 'b', 'c'],
                notOk: 'string'
            }
        ]
    },
    {
        name: 'const="hi"',
        schema: {
            type: 'string',
            const: 'hi'
        },
        cases: [
            {
                value: 'foo',
                ok: 'hi'
            },
            {
                value: 12,
                ok: 'hi'
            },
            {
                value: ['a', 'b', 'c'],
                ok: 'hi'
            }
        ]
    },
    {
        name: 'default="hi"',
        schema: {
            type: 'string',
            default: 'hi'
        },
        cases: [
            {
                ok: 'hi'
            },
            { value: null, ok: 'hi' },
            {
                value: 'bye',
                ok: 'bye'
            },
            {
                value: 12,
                notOk: 'string'
            }
        ]
    },
    {
        name: 'cast=true',
        schema: {
            type: 'string',
            cast: true
        },
        cases: [
            {
                value: 12,
                ok: '12'
            },
            {
                value: ['a', 'b', 'c'],
                ok: 'a,b,c'
            },
            {
                value: new String('hi'),
                ok: 'hi'
            },
            {
                value: {
                    n: 1
                },
                ok: '[object Object]'
            },
            {
                value: null,
                ok: ''
            },
            {
                value: undefined,
                ok: ''
            },
            {
                ok: ''
            }
        ]
    },
    {
        name: 'enum',
        schema: {
            type: 'string',
            enum: ['a', 'b', 'c']
        },
        cases: [
            {
                value: 'b',
                ok: 'b'
            },
            {
                value: 'd',
                notOk: 'exists'
            },
            {
                value: ['a', 'b', 'c'],
                notOk: 'string'
            },
            {
                value: 'abc',
                notOk: 'exists'
            },
            {
                value: {},
                notOk: 'string'
            }
        ]
    },
    {
        name: 'minLength=12',
        schema: {
            type: 'string',
            minLength: 12
        },
        cases: [
            {
                value: '1234567890123',
                ok: '1234567890123'
            },
            {
                value: '123456789012',
                ok: '123456789012'
            },
            {
                value: '12345678901',
                notOk: 'minLength'
            },
            {
                value: 'a',
                notOk: 'minLength'
            },
            {
                value: 1,
                notOk: 'string'
            }
        ]
    },
    {
        name: 'maxLength=12',
        schema: {
            type: 'string',
            maxLength: 12
        },
        cases: [
            {
                value: '12345678901',
                ok: '12345678901'
            },
            {
                value: '123456789012',
                ok: '123456789012'
            },
            {
                value: 'a',
                ok: 'a'
            },
            {
                value: '1234567890123',
                notOk: 'maxLength'
            },
            {
                value: [],
                notOk: 'string'
            }
        ]
    },
    {
        name: 'pattern',
        schema: {
            type: 'string',
            pattern: '^[abc]$'
        },
        cases: [
            {
                value: 'a',
                ok: 'a'
            },
            {
                value: 'd',
                notOk: 'matches'
            }
        ]
    },
    {
        name: 'lowerCase',
        schema: {
            type: 'string',
            lowerCase: true
        },
        cases: [
            {
                value: 'HI',
                ok: 'hi'
            },
            {
                value: 'hey',
                ok: 'hey'
            },
            {
                value: [],
                notOk: 'string'
            }
        ]
    },
    {
        name: 'upperCase',
        schema: {
            type: 'string',
            upperCase: true
        },
        cases: [
            {
                value: 'hi',
                ok: 'HI'
            },
            {
                value: 'HEY',
                ok: 'HEY'
            },
            {
                value: [],
                notOk: 'string'
            }
        ]
    },
    {
        name: 'trim',
        schema: {
            type: 'string',
            trim: true
        },
        cases: [
            {
                value: ' hello ',
                ok: 'hello'
            },
            {
                value: {},
                notOk: 'string'
            }
        ]
    },
    {
        name: 'split',
        schema: {
            type: 'string',
            split: ','
        },
        cases: [
            {
                value: 'a,b,c',
                ok: ['a', 'b', 'c']
            },
            {
                value: 'a',
                ok: ['a']
            },
            {
                value: '',
                ok: []
            },
            {
                value: ',',
                ok: []
            },
            {
                value: ['a', 'b', 'c'],
                notOk: 'string'
            }
        ]
    },
    {
        name: 'nonEmpty',
        schema: {
            type: 'string',
            nonEmpty: true
        },
        cases: [
            {
                value: 'a,b,c',
                ok: 'a,b,c'
            },
            {
                value: '',
                notOk: 'nonEmpty'
            },
            {
                value: new String(['a', 'b', 'c']),
                notOk: 'string'
            }
        ]
    },
    {
        name: 'optional',
        schema: { type: 'string', optional: true },
        cases: [{ value: 'hi' }, {}, { value: [], notOk: 'string' }]
    }
];
