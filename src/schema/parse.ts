import { Except, raise } from '@quenk/noni/lib/control/except';
import { empty } from '@quenk/noni/lib/data/array';
import { right } from '@quenk/noni/lib/data/either';
import { Record } from '@quenk/noni/lib/data/record';

import { JSONPrecondition, Schema } from './';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { isObject, Type } from '@quenk/noni/lib/data/type';

const extractors = new Map([
    ['object', ['base.default', 'base.const', 'base.type']],
    [
        'array',
        [
            'base.default',
            'base.const',
            'base.type',
            'array.nonEmpty',
            'array.minItems',
            'array.maxItems'
        ]
    ],
    [
        'string',
        [
            'base.default',
            'string.cast',
            'base.const',
            'base.type',
            'base.enum',
            'string.nonEmpty',
            'string.minLength',
            'string.maxLength',
            'string.pattern',
            'string.trim',
            'string.lowerCase',
            'string.upperCase',
            'string.split'
        ]
    ],
    [
        'number',
        [
            'base.default',
            'number.cast',
            'base.const',
            'base.type',
            'base.enum',
            'number.min',
            'number.max'
        ]
    ],
    [
        'boolean',
        ['base.default', 'boolean.cast', 'base.const', 'base.type', 'base.enum']
    ]
]);

const booleanExtractors = ['trim', 'lowerCase', 'upperCase', 'cast'];

/**
 * Node holds information about a single schema type that has been parsed
 * to produce a precondition.
 *
 * These types are meant to server as an intermediate representation before
 * producing the final output.
 */
export type Node<T> = ObjectNode<T> | ArrayNode<T> | PrimNode<T>;

/**
 * ObjectNode holds information about an object precondition.
 *
 * The second element is described as follows:
 *
 * 0: Any parsed builtin preconditions.
 * 1: Preconditions parsed from the `properties` key.
 * 2: Preconditions parsed from the `additionalProperties` key.
 * 3: Custom specified preconditions.
 */
export type ObjectNode<T> = ['object', [T[], Record<T>, T?, T[]?]];

/**
 * ArrayNode holds information about an array precondition.
 *
 * The second element is described as follows:
 *
 * 0: Any parsed builtin preconditions.
 * 1: Preconditions parsed from the `items` property.
 * 2 : Custom specified preconditions.
 */
export type ArrayNode<T> = ['array', [T[], T, T[]?]];

/**
 * PrimNode holds information about preconditions for primitive values.
 */
export type PrimNode<T> = ['boolean' | 'number' | 'string', T[]];

/**
 * A string used to resolve a precondition's name consisting of it's module
 * and name separated by a "dot".
 *
 * For example: "base.every" indicates the "every" precondition from the main
 * export of the preconditions library.
 */
export type Path = string;

/**
 * ParseContext is used to shape the output of a parsed schema into a
 * precondition.
 *
 * The generic type <T> determines what a precondition looks like and is
 * specified via the visit function.
 */
export interface ParseContext<T> {
    /**
     * visit a Node in the tree returning a transformation.
     *
     * This function is called on each Node in a tree recursively.
     */
    visit: (entry: Node<T>) => T;

    /**
     * get a single precondition given its path.
     */
    get: (path: Path, args: Type[]) => Maybe<T>;
}

type Index = string | number;

type Frame<T> = [Item<T>[], Owner<T>?];

type Owner<T> = [Node<T>, Index, Target<T>];

type Target<T> = Record<T> | T[];

type Item<T> = [Schema, Index, Target<T>];

/**
 * parse a Schema into a representation.
 *
 * This function works by converting a schema into some generic representation
 * T. It walks the properties of an object type schema or the items property
 * of an array schema in a stack safe manner.
 *
 * The provided ParseContext is given the chance to transform each encountered
 * schema into a precondition via visit().
 *
 * @param ctx     - The parse context.
 * @param schema  - The root schema to parse.
 */
export const parse = <T>(ctx: ParseContext<T>, schema: Schema): Except<T> => {
    let result: T[] = [];
    let initItem: Item<T> = [schema, 0, result];
    let initFrame: Frame<T> = [[initItem]];
    let pending = [initFrame];

    PENDING: while (!empty(pending)) {
        let [stack, owner] = <Frame<T>>pending.pop();
        while (!empty(stack)) {
            let [schema, currentPath, currentTarget] = <Item<T>>stack.pop();
            let builtins = takeBuiltins(schema);
            let preconditions = takePreconditions(schema);

            if (!isComplex(schema)) {
                let eprecs = convert(ctx, [...builtins, ...preconditions]);

                if (eprecs.isLeft()) return raise(eprecs.takeLeft());

                (<T[]>currentTarget)[<number>currentPath] = ctx.visit([
                    <'number'>schema.type,
                    eprecs.takeRight()
                ]);
            } else {
                pending.push([stack, owner]); // Save current state for later.

                let ebuiltinPrecs = convert(ctx, builtins);

                if (ebuiltinPrecs.isLeft())
                    return raise(ebuiltinPrecs.takeLeft());

                let eprecs = convert(ctx, preconditions);

                if (eprecs.isLeft()) return raise(eprecs.takeLeft());

                let builtinPrecs = ebuiltinPrecs.takeRight();

                let precs = eprecs.takeRight();

                if (schema.type === 'object') {
                    let newStack: Item<T>[] = [];

                    let object: ObjectNode<T> = [
                        'object',
                        [builtinPrecs, {}, undefined, precs]
                    ];

                    let [, args] = object;

                    for (let [key, prop] of Object.entries(
                        schema.properties || {}
                    ))
                        newStack.push([prop, key, <Record<T>>args[1]]);

                    if (isObject(schema.additionalProperties))
                        newStack.push([
                            <Schema>schema.additionalProperties,
                            2,
                            <T[]>args
                        ]);

                    pending.push([
                        newStack,
                        [object, currentPath, currentTarget]
                    ]);
                } else if (schema.type === 'array') {
                    let array = <ArrayNode<T>>(
                        (<Type>['array', [builtinPrecs, , precs]])
                    );

                    let newStack: Item<T>[] = [];

                    newStack.push([<Schema>schema.items, 1, <T[]>array[1]]);

                    pending.push([
                        newStack,
                        [array, currentPath, currentTarget]
                    ]);
                }

                continue PENDING;
            }
        }

        if (owner) {
            let [val, loc, target] = owner;
            (<T[]>target)[<number>loc] = ctx.visit(val);
        }
    }

    return right(<T>result.pop());
};

const takeBuiltins = (schema: Schema): JSONPrecondition[] =>
    getExtractors(schema).reduce((result, path) => {
        let [, name] = path.split('.');
        if (
            Object.prototype.hasOwnProperty.call(schema, name) &&
            !(booleanExtractors.includes(name) && schema[name] === false)
        )
            result.push([path, [schema[name]]]);
        return result;
    }, <JSONPrecondition[]>[]);

const takePreconditions = (schema: Schema): JSONPrecondition[] =>
    schema.preconditions || [];

const convert = <T>(
    ctx: ParseContext<T>,
    list: JSONPrecondition[]
): Except<T[]> => {
    let result = [];
    for (let [path, args] of list) {
        let mprec = ctx.get(path, args);

        if (mprec.isNothing()) return raise(`Unknown provider "${path}"!`);

        result.push(mprec.get());
    }

    return right(result);
};

const getExtractors = (schema: Schema) => extractors.get(schema.type) || [];

const complex = ['object', 'array'];

const isComplex = (schema: Schema) => complex.includes(schema.type);
