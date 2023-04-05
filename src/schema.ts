/**
 * This module provides an APIs for generating a precondition from a json-schema
 * like syntax.
 */
import * as boolean from './boolean';
import * as number from './number';
import * as string from './string';
import * as array from './array';
import * as object from './record';

import { Record, merge } from '@quenk/noni/lib/data/record';
import { Value } from '@quenk/noni/lib/data/jsonx';
import { match } from '@quenk/noni/lib/control/match';

import { and, exists, identity, optional, Precondition } from '.';
import { attempt, Except, raise } from '@quenk/noni/lib/control/except';
import { isFunction, isNumber, isString } from '@quenk/noni/lib/data/type';
import { right } from '@quenk/noni/lib/data/either';

export const TYPE_OBJECT = 'object';
export const TYPE_ARRAY = 'array';
export const TYPE_STRING = 'string';
export const TYPE_NUMBER = 'number';
export const TYPE_BOOLEAN = 'boolean';

/**
 * SchemaTypeString is one of the TYPE_* constants.
 */
export type SchemaTypeString = string;

/**
 * JSONPrecondition is a precondition specialized to handling jsonx values.
 */
export type JSONPrecondition = Precondition<Value, Value>;

/**
 * PreconditionRef is resolved against a Context to yield a JSONPrecondition.
 */
export type PreconditionRef = StringPreconditionRef | CalledPreconditionRef;

/**
 * StringPreconditionRef is a string that points to a Precondition located within
 * the Context.
 */
export type StringPreconditionRef = string;

/**
 * CallPreconditionRef points to a function in the Context that may be resolved
 * to a precondition once invoked.
 */
export type CalledPreconditionRef = [StringPreconditionRef, Value[]];

/**
 * Pipe is a precondition or ref to one that form part of a pipeline to be
 * applied to a data value.
 */
export type Pipe = JSONPrecondition | PreconditionRef;

/**
 * Schema is a valid form of one of the supported schemas.
 */
export type Schema =
    | BooleanTypeSchema
    | NumberTypeSchema
    | StringTypeSchema
    | ArrayTypeSchema
    | ObjectTypeSchema;

/**
 * PropertyTypeSchema is parent interface of those schema that appear in the
 * `properties` or `additionalProperties` keys of an object schema or the `items`
 * key of an array schema.
 */
export interface PropertyTypeSchema {
    /**
     * type indicates the type of data that is valid for this schema.
     */
    type: SchemaTypeString;

    /**
     * optional indicates the schema is optional and its value can be omitted.
     */
    optional?: boolean;

    /**
     * pipeline specifies a list of preconditions to pass the value through
     * after it has been validated.
     */
    pipeline?: Pipe[];
}

/**
 * ObjectTypeSchema represents a top level or nested object schema.
 */
export interface ObjectTypeSchema extends PropertyTypeSchema {
    /**
     * title can be used to distinguish objects but is not usually required.
     */
    title?: string;

    /**
     * properties that are allowed for the object schema. This can be used to
     * have a rigid set of key to value property pairs effectively treating the
     * object like a class rather than say a map.
     */
    properties?: Record<Schema>;

    /**
     * additionalProperties serves as the schema for any properties not
     * explicitly defined in `properties`. This effectively treats the object
     * like a map whose actual number of properties and their names can vary
     * greatly.
     */
    additionalProperties?: Schema;
}

/**
 * ArrayTypeSchema represents an array of items.
 */
export interface ArrayTypeSchema extends PropertyTypeSchema {
    /**
     * items indicates the allowed schema for any item appearing in the array.
     */
    items: Schema;

    /**
     * minLength specifies the minimum array length allowed.
     */
    minLength?: number;

    /**
     * maxLength specifies the maximum array length allowed.
     */
    maxLength?: number;
}

/**
 * StringTypeSchema represents a string value.
 */
export interface StringTypeSchema extends PropertyTypeSchema {
    /**
     * minLength specifies the minimum string length allowed.
     */
    minLength?: number;

    /**
     * maxLength specifies the maximum string length allowed.
     */
    maxLength?: number;

    /**
     * pattern is a regular expression that will be used to validate the string
     * value.
     */
    pattern?: string | RegExp;

    /**
     * enum if specified, restricts the valid values to the specified list.
     */
    enum?: string[];
}

/**
 * NumberTypeSchema represents a numeric value.
 */
export interface NumberTypeSchema extends PropertyTypeSchema {
    /**
     * min specifies the minimum value.
     */
    min?: number;

    /**
     * max specifies the maximum value.
     */
    max?: number;

    /**
     * enum if specified, restricts the valid values to the specified list.
     */
    enum?: number[];
}

/**
 * BooleanTypeSchema represents a value that may be true or false.
 */
export type BooleanTypeSchema = PropertyTypeSchema;

/**
 * JSONPreconditionProvider is a function that once invoked provides a
 * precondition.
 */
export type JSONPreconditionProvider = (...args: Value[]) => JSONPrecondition;

/**
 * Options used during schema conversion.
 */
export interface Options {
    /**
     * strict if true will not cast types before checking.
     *
     * Defaults to false.
     */
    strict: boolean;

    /**
     * context used to resolve precondition references.
     */
    context: Context;

    /**
     * partial if true will only validate present properties on object types.
     *
     * This is usually used for updates, defaults to false.
     */
    partial: boolean;
}

/**
 * Context is used to resolve preconditions found in the respective pipeline
 * directives.
 */
export type Context = Record<JSONPrecondition | JSONPreconditionProvider>;

const defaultOptions = { strict: false, context: {}, partial: false };

/**
 * fromSchema converts a given schema into a precondition.
 *
 * This function should be considered the entry point to this module and should
 * be used instead of the individual from*TypeSchema functions.
 */
export const fromSchema = (opts: Partial<Options>, schema: Schema) =>
    _fromSchema(merge(defaultOptions, opts), schema);

const _fromSchema = (opts: Options, schema: Schema): Except<JSONPrecondition> =>
    <Except<JSONPrecondition>>match(schema)
        .caseOf({ type: TYPE_OBJECT }, () => fromObjectSchema(opts, schema))
        .caseOf({ type: TYPE_ARRAY }, () =>
            fromArraySchema(opts, <ArrayTypeSchema>schema)
        )
        .caseOf({ type: TYPE_STRING }, () =>
            fromStringSchema(opts, <StringTypeSchema>schema)
        )
        .caseOf({ type: TYPE_NUMBER }, () =>
            fromNumberSchema(opts, <NumberTypeSchema>schema)
        )
        .caseOf({ type: TYPE_BOOLEAN }, () => fromBooleanSchema(opts, schema))
        .orElse(() => yieldError(schema))
        .end();

/**
 * fromObjectSchema converts an object schema to a precondition.
 */
export const fromObjectSchema = (
    opts: Options,
    schema: ObjectTypeSchema
): Except<JSONPrecondition> => {
    let pipes: Pipe[] = [];

    let wrapper = opts.partial ? object.intersect : object.restrict;

    let precs: Record<JSONPrecondition> = {};

    for (let [key, value] of Object.entries(schema.properties || {})) {
        let eprec = _fromSchema(opts, value);

        if (eprec.isLeft()) return eprec;

        precs[key] = eprec.takeRight();
    }

    pipes.push(<JSONPrecondition>wrapper(precs));

    return pipeline2Precondition(opts.context, pipes)
        .map(prec => <JSONPrecondition>and(object.isRecord, prec))
        .map(_optional(schema));
};

/**
 * fromArraySchema converts an array schema to a precondition.
 */
export const fromArraySchema = (
    opts: Options,
    schema: ArrayTypeSchema
): Except<JSONPrecondition> => {
    let arrayPrecs: JSONPrecondition[] = [];

    arrayPrecs.push(array.isArray);

    if (isNumber(schema.minLength))
        arrayPrecs.push(<JSONPrecondition>array.minLength(schema.minLength));

    if (isNumber(schema.maxLength))
        arrayPrecs.push(<JSONPrecondition>array.maxLength(schema.maxLength));

    let arrayPipeline = [...arrayPrecs, ...(schema.pipeline || [])];

    let eArrayPrec = pipeline2Precondition(opts.context, arrayPipeline);

    if (eArrayPrec.isLeft()) return eArrayPrec;

    let eitemsPrec = fromSchema(opts, schema.items);

    if (eitemsPrec.isLeft()) return eitemsPrec;

    let arrayPrec = eArrayPrec.takeRight();

    let itemsPrec = <JSONPrecondition>array.map(eitemsPrec.takeRight());

    return right(_optional(schema)(and(arrayPrec, itemsPrec)));
};

/**
 * fromStringSchema converts a string schema to a precondition.
 */
export const fromStringSchema = (
    opts: Options,
    schema: StringTypeSchema
): Except<JSONPrecondition> => {
    let pipes: Pipe[] = [];

    if (schema.enum) {
        pipes = [
            <JSONPrecondition>exists(schema.enum),
            ...(schema.pipeline || [])
        ];
    } else {
        if (!opts.strict) pipes.push(string.toString);

        pipes.push(string.isString);

        pipes.push(<JSONPrecondition>string.trim);

        if (isNumber(schema.minLength))
            pipes.push(<JSONPrecondition>string.minLength(schema.minLength));

        if (isNumber(schema.maxLength))
            pipes.push(<JSONPrecondition>string.maxLength(schema.maxLength));

        if (schema.pattern) {
            if (schema.pattern instanceof RegExp) {
                pipes.push(<JSONPrecondition>string.matches(schema.pattern));
            } else {
                let ereg = attempt(() => new RegExp(<string>schema.pattern));

                if (ereg.isLeft())
                    return <Except<JSONPrecondition>>(<object>ereg);

                pipes.push(<JSONPrecondition>string.matches(ereg.takeRight()));
            }
        }

        pipes = pipes.concat(schema.pipeline || []);
    }

    return pipeline2Precondition(opts.context, pipes).map(_optional(schema));
};

/**
 * fromNumberSchema converts a number schema type to a precondition.
 */
export const fromNumberSchema = (
    opts: Options,
    schema: NumberTypeSchema
): Except<JSONPrecondition> => {
    let pipes: Pipe[] = [];

    if (schema.enum) {
        pipes = [
            <JSONPrecondition>exists(schema.enum),
            ...(schema.pipeline || [])
        ];
    } else {
        if (!opts.strict) pipes.push(number.toNumber);

        pipes.push(number.isNumber);

        if (isNumber(schema.min))
            pipes.push(<JSONPrecondition>number.min(schema.min));

        if (isNumber(schema.max))
            pipes.push(<JSONPrecondition>number.max(schema.max));

        pipes = pipes.concat(schema.pipeline || []);
    }
    return pipeline2Precondition(opts.context, pipes).map(_optional(schema));
};

/**
 * fromBooleanSchema converts a boolean schema type to a precondition.
 */
export const fromBooleanSchema = (
    opts: Options,
    schema: BooleanTypeSchema
): Except<JSONPrecondition> => {
    let pipes: Pipe[] = [];

    if (!opts.strict) pipes.push(boolean.toBoolean);

    pipes.push(boolean.isBoolean);

    pipes = pipes.concat(schema.pipeline || []);

    return pipeline2Precondition(opts.context, pipes).map(_optional(schema));
};

const yieldError = (schema: Schema) =>
    raise<JSONPrecondition>(
        `fromSchema: invalid schema with type "${schema.type}"!`
    );

const pipeline2Precondition = (
    ctx: Context,
    line: Pipe[] = []
): Except<JSONPrecondition> => {
    let prec: JSONPrecondition = identity;

    for (let ref of line) {
        if (isFunction(ref)) {
            prec = and(prec, ref);
        } else {
            let target = isString(ref) ? ref : (<CalledPreconditionRef>ref)[0];
            let hit = ctx[target];

            if (!hit) return raise(`pipeline: Ref "${target}" not found!`);

            if (Array.isArray(ref))
                hit = (<JSONPreconditionProvider>hit).apply(ctx, ref[1]);

            prec = and(prec, <JSONPrecondition>hit);
        }
    }

    return right(prec);
};

const _optional =
    (schema: Schema) =>
    (prec: JSONPrecondition): JSONPrecondition =>
        schema.optional ? optional(prec) : prec;
