import { Except, raise } from '@quenk/noni/lib/control/except';
import { empty } from '@quenk/noni/lib/data/array';
import { right } from '@quenk/noni/lib/data/either';
import { merge, Record } from '@quenk/noni/lib/data/record';

import {
    ArrayTypeSchema,
    JSONPrecondition,
    ObjectTypeSchema,
    PreconditionSpec,
    Schema
} from './';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { isObject, Type } from '@quenk/noni/lib/data/type';

export const DEFAULT_PIPELINE_KEY = 'preconditions';

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
 */
export type ObjectNode<T> = ['object', ObjectArgs<T>, Optional];

/**
 * ObjectArgs:
 *
 * 0: Any parsed builtin preconditions.
 * 1: Preconditions parsed from the `properties` key.
 * 2: Preconditions parsed from the `additionalProperties` key.
 * 3: Custom specified preconditions.
 */
export type ObjectArgs<T> = [T[], Record<T>, T?, T[]?];

/**
 * ArrayNode holds information about an array precondition.
 *
 * The second element is described as follows:
 *
 * 0: Any parsed builtin preconditions.
 * 1: Preconditions parsed from the `items` property.
 * 2 : Custom specified preconditions.
 */
export type ArrayNode<T> = ['array', ArrayArgs<T>, Optional];

/**
 * ArrayArgs:
 *
 * 0: Any parsed builtin preconditions.
 * 1: Preconditions parsed from the `items` property.
 * 2 : Custom specified preconditions.
 */
export type ArrayArgs<T> = [T[], T, T[]?];

/**
 * PrimNode holds information about preconditions for primitive values.
 */
export type PrimNode<T> = ['boolean' | 'number' | 'string', T[], Optional];

/**
 * Optional if set to true indicates a precondition is optional and should
 * not be applied if no value is specified.
 *
 * This is only observed for properties of an object schema.
 */
export type Optional = boolean;

/**
 * A string used to resolve a precondition's name consisting of it's module
 * and name separated by a "dot".
 *
 * For example: "base.every" indicates the "every" precondition from the "base"
 * module.
 */
export type Path = string;

/**
 * ParseContext is used to shape the output of a parsed schema into a
 * precondition.
 *
 * @typeparam T - determines what a precondition looks like and is specified by
 *                the result of visit().
 */
export interface ParseContext<T> {
    /**
     * builtinsAvailable to be automatically included in the parsed preconditions.
     *
     * Each schema type has its own list and is included in order.
     */
    builtinsAvailable: Partial<BuiltinsAvailable>;

    /**
     * get a single precondition T given a spec.
     */
    get: (spec: PreconditionSpec<T>) => Maybe<T>;

    /**
     * getPipeline given a Schema, returns its pipeline or an empty array if
     * none exists.
     */
    getPipeline(schema: Schema): PreconditionSpec<T>[];

    /**
     * visit a Node in the tree returning a transformation.
     *
     * This function is called on each Node in a tree recursively.
     */
    visit: (entry: Node<T>) => T;
}

/**
 * BuiltinsAvailable specifies which of the builtins to recognize in each schema
 * type.
 */
export interface BuiltinsAvailable {
    /**
     * object schema builtins.
     */
    object: Path[];

    /**
     * array schema builtins.
     */
    array: Path[];

    /**
     * string schema builtins.
     */
    string: Path[];

    /**
     * boolean schema builtins.
     */
    boolean: Path[];

    /**
     * number schema builtins.
     */
    number: Path[];
}

type Index = string | number;

type Frame<T> = [Item<T>[], Owner<T>?];

type Owner<T> = [Node<T>, Index, Target<T>];

type Target<T> = Record<T> | T[];

type Item<T> = [Schema, Index, Target<T>];

/**
 * defaultBuiltins available.
 */
export const defaultBuiltins: BuiltinsAvailable = {
    object: ['base.default', 'base.const', 'base.type'],
    array: [
        'base.default',
        'base.const',
        'base.type',
        'array.nonEmpty',
        'array.minItems',
        'array.maxItems'
    ],
    string: [
        'base.default',
        'base.cast',
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
    ],
    number: [
        'base.default',
        'base.cast',
        'base.const',
        'base.type',
        'base.enum',
        'number.min',
        'number.max'
    ],
    boolean: [
        'base.default',
        'base.cast',
        'base.const',
        'base.type',
        'base.enum'
    ]
};

const booleanExtractors = ['trim', 'lowerCase', 'upperCase', 'cast'];

const typeTakers = ['cast'];

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
            let [currentSchema, currentPath, currentTarget] = <Item<T>>(
                stack.pop()
            );

            let builtins = currentSchema.readOnly ? [] :  takeBuiltins(
                merge(defaultBuiltins, ctx.builtinsAvailable || {}),
                currentSchema
            );

            let preconditions = ctx.getPipeline(currentSchema);

            if(currentSchema.readOnly && empty(preconditions)) continue;

            if (!isComplex(currentSchema)) {
                let eprecs = toPrecondition(ctx, [
                    ...builtins,
                    ...preconditions
                ]);

                if (eprecs.isLeft()) return raise(eprecs.takeLeft());

                (<T[]>currentTarget)[<number>currentPath] = ctx.visit([
                    <'number'>currentSchema.type,
                    eprecs.takeRight(),
                    Boolean(currentSchema.optional)
                ]);
            } else {
                pending.push([stack, owner]); // Save current state for later.

                let ebuiltinPrecs = toPrecondition(ctx, builtins);

                if (ebuiltinPrecs.isLeft())
                    return raise(ebuiltinPrecs.takeLeft());

                let eprecs = toPrecondition(ctx, preconditions);

                if (eprecs.isLeft()) return raise(eprecs.takeLeft());

                let builtinPrecs = ebuiltinPrecs.takeRight();

                let precs = eprecs.takeRight();

                if (currentSchema.type === 'object') {
                    let schema = <ObjectTypeSchema>currentSchema;
                    let newStack: Item<T>[] = [];

                    let object: ObjectNode<T> = [
                        'object',
                        [builtinPrecs, {}, undefined, precs],
                        Boolean(schema.optional)
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
                } else if (currentSchema.type === 'array') {
                    let schema = <ArrayTypeSchema>currentSchema;
                    let array = <ArrayNode<T>>(
                        (<Type>[
                            'array',
                            [builtinPrecs, null, precs],
                            Boolean(schema.optional)
                        ])
                    );
                    let newStack: Item<T>[] = [];

                    if (schema.items)
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

const takeBuiltins = (
    available: BuiltinsAvailable,
    schema: Schema
): JSONPrecondition[] =>
    (available[<'number'>schema.type] || []).reduce((result, path) => {
        let [, name] = path.split('.');
        if (Object.prototype.hasOwnProperty.call(schema, name)) {
            if (
                booleanExtractors.includes(name) &&
                (<Type>schema)[name] !== false
            ) {
                result.push([
                    path,
                    typeTakers.includes(name) ? [schema.type] : []
                ]);
            } else {
                result.push([path, [(<Type>schema)[name]]]);
            }
        }
        return result;
    }, <JSONPrecondition[]>[]);

const toPrecondition = <T>(
    ctx: ParseContext<T>,
    list: PreconditionSpec<T>[]
): Except<T[]> => {
    let result = [];
    for (let spec of list) {
        let mprec = ctx.get(spec);

        if (mprec.isNothing())
            return raise(
                `Could not resolve the following value to a precondition: ${spec} !`
            );

        result.push(mprec.get());
    }

    return right(result);
};

const complex = ['object', 'array'];

const isComplex = (schema: Schema) => complex.includes(schema.type);
