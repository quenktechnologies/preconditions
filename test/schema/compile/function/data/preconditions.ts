import { Value, Object } from '@quenk/noni/lib/data/jsonx';

import { succeed } from '../../../../../lib/result';

export const preconditions = {
    inc: (n: number) => (val: number) => succeed<number, number>(val + n),
    flip: () => (val: boolean) => succeed<boolean, boolean>(!val),
    concat: (str: string) => (val: string) =>
        succeed<string, string>(val + str),
    stringify: () => (val: Value) => succeed<Value, Value>(String(val)),
    get: (name: string) => (val: Object) => succeed<Value, Value>(val[name])
};
