import { Record } from '@quenk/noni/lib/data/record';

import { Schema } from '../../.../../../../lib/schema';

export const tests: Record<Schema> = {
    'should parse boolean schema': {
        type: 'boolean',
        const: false,
        default: true,
        cast: true,
        enum: [false]
    },
    'should honour boolean builtins': {
        type: 'boolean',
        const: false,
        cast: false
    },
    'should support preconditions key': {
        type: 'boolean',
        preconditions: [
            ['custom.one', [1]],
            ['custom.two', [2]],
            ['custom.three', [3]]
        ]
    },
    'should support optional': {
        type: 'boolean',
        optional: true
    }
};
