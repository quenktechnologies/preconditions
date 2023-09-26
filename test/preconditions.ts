import { Value, Object } from '@quenk/noni/lib/data/jsonx';

import { AsyncPreconditionsAvailable } from '../lib/schema/compile/function';
import { succeed } from '../lib/result';
import { lift } from '../lib/async';

export const preconditions = {
    identity: () => (val: Value) => succeed<Value, Value>(val),
    inc: (n: number) => (val: number) => succeed<number, number>(val + n),
    flip: () => (val: boolean) => succeed<Value, Value>(!val),
    concat: (str: string) => (val: string) =>
        succeed<string, string>(val + str),
    stringify: () => (val: Value) => succeed<Value, Value>(String(val)),
    count: () => (val: Value) =>
        succeed<Value, Value>(
            Array.isArray(val) ? val.length : Object.keys(val).length
        ),
    get: (name: string) => (val: Object) => succeed<Value, Value>(val[name]),
    set: (val: Value) => () => succeed<Value, Value>(val)
};

export const asyncPreconditions: AsyncPreconditionsAvailable = {
    identity: () => lift(preconditions.identity()),
    inc: (n: number) => lift(preconditions.inc(n)),
    flip: () => lift(preconditions.flip()),
    concat: (str: string) => lift(preconditions.concat(str)),
    count: () => lift(preconditions.count()),
    stringify: () => lift(preconditions.stringify()),
    get: (name: string) => lift(preconditions.get(name)),
    set: (val: Value) => lift(preconditions.set(val))
};
