export const tests = [
    {
        name: 'type=object',
        schema: {
            type: 'object'
        },
        cases: [
            {
                value: {
                    n: 1
                }
            },
            {
                value: new Object(),
                ok: {}
            },
            {
                value: '{}',
                notOk: 'object'
            },
            {
                value: [],
                notOk: 'object'
            },
            {
                value: 1,
                notOk: 'object'
            }
        ]
    },
    {
        name: 'const={n:1}',
        schema: {
            type: 'object',
            const: {
                n: 1
            }
        },
        cases: [
            {
                value: {
                    n: 2
                },
                ok: {
                    n: 1
                }
            },
            {
                value: [],
                ok: {
                    n: 1
                }
            },
            {
                value: '{}',
                ok: {
                    n: 1
                }
            },
            {
                value: 1,
                ok: {
                    n: 1
                }
            }
        ]
    },
    {
        name: 'default={n:1}',
        schema: {
            type: 'object',
            default: {
                n: 1
            }
        },
        cases: [
            {
                ok: {
                    n: 1
                }
            },
            {
                value: null,
                ok: {
                    n: 1
                }
            },
            {
                value: {
                    n: 1
                }
            },
            {
                value: [],
                notOk: 'object'
            },
            {
                value: 12,
                notOk: 'object'
            }
        ]
    },
    {
        name: 'properties',
        schema: {
            type: 'object',
            properties: {
                id: {
                    type: 'number'
                }
            }
        },
        cases: [
            {
                value: {
                    id: 1
                }
            },
            {
                value: {},
                notOk: {
                    id: 'number'
                }
            },
            {
                value: {
                    id: '1'
                },
                notOk: {
                    id: 'number'
                }
            },
            {
                value: {
                    name: 'Me'
                },
                notOk: {
                    id: 'number'
                }
            }
        ]
    },
    {
        name: 'properties (nested)',
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'object',
                    properties: {
                        first: {
                            type: 'string'
                        }
                    }
                }
            }
        },
        cases: [
            {
                value: {
                    name: {
                        first: 'Lasana'
                    }
                }
            },
            {
                value: {},
                notOk: {
                    name: 'object'
                }
            },
            {
                value: {
                    name: 'Lasana'
                },
                notOk: {
                    name: 'object'
                }
            }
        ]
    },
    {
        name: 'additionalProperties',
        schema: {
            type: 'object',
            additionalProperties: {
                type: 'number'
            }
        },
        cases: [
            {
                value: {},
                ok: {}
            },
            {
                value: {
                    id: 1
                }
            },
            {
                value: {
                    one: 1,
                    two: 2,
                    three: 3
                }
            },

            {
                value: {
                    one: 1,
                    two: '2',
                    three: 3
                },
                notOk: {
                    two: 'number'
                }
            },
            {
                value: {
                    id: '1'
                },
                notOk: {
                    id: 'number'
                }
            },
            {
                value: {
                    name: 'Me'
                },
                notOk: {
                    name: 'number'
                }
            }
        ]
    },

    {
        name: 'additionalProperties (nested)',
        schema: {
            type: 'object',
            additionalProperties: {
                type: 'object',
                additionalProperties: {
                    name: {
                        type: 'object',
                        additionalProperties: {
                            type: 'string'
                        }
                    }
                }
            }
        },
        cases: [
            {
                value: {}
            },
            {
                value: {
                    name: {
                        first: {
                            value: 'Lasana'
                        },
                        middle: {
                            value: 'K'
                        },
                        surname: {
                            value: 'Murray'
                        }
                    }
                }
            },
            {
                value: {
                    badges: {
                        hunter: {
                            value: 'yes'
                        },
                        top10: {
                            value: 'yes'
                        }
                    },
                    name: {
                        first: {
                            value: 'Lasana'
                        },
                        middle: {
                            value: 'K'
                        },
                        surname: {
                            value: 'Murray'
                        }
                    }
                }
            },
            {
                value: 'Lasana',
                notOk: 'object'
            },
            {
                value: {
                    name: 'Lasana'
                },
                notOk: {
                    name: 'object'
                }
            },
            {
                value: {
                    name: {
                        first: 'Lasana'
                    },
                    notOk: {
                        name: {
                            first: 'object'
                        }
                    }
                }
            },
            {
                value: {
                    badges: {
                        hunter: {
                            value: 'yes'
                        }
                    },
                    name: 'first'
                },
                notOk: {
                    name: 'object'
                }
            }
        ]
    },
    /*TODO: #94 {
      name: 'properties and additionalProperties',
      schema: {
        type: 'object',
        properties: { id: {type: 'number'}},
        additionalProperties: { type: 'string'}
      },
      cases: [
        { value: { id: 1} },
        { value: { id: 1, name: 'Me' } },
        { value: { name: 'Me'}, notOk: { id: 'number'} },
        { value: { id: '1', name: 'Me'}, notOk: { id: 'number'}},
        { value: {id: 1, name: 2}, notOk: { name: 'string' }}
      ]
    }*/
    {
        name: 'optional',
        schema: { type: 'object', optional: true },
        cases: [
            { value: { n: 1 } },
            { value: {} },
            {},
            { value: [{}], notOk: 'object' }
        ]
    },
    {
        name: 'optional (properties)',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                name: { type: 'string', optional: true }
            }
        },
        cases: [
            { value: { id: 1 } },
            { value: { id: 1, name: 'foo' } },
            { value: { id: 1, name: 2 }, notOk: { name: 'string' } },
            { notOk: 'object' }
        ]
    },
    {
        name: 'optional (additionalProperties)',
        schema: {
            type: 'object',
            additionalProperties: { type: 'number', optional: true }
        },
        cases: [
            { value: { id: 1 } },
            { value: {} },
            { value: { name: 'me' }, notOk: { name: 'number' } },
            { notOk: 'object' }
        ]
    }
];
