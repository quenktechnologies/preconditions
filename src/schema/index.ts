/**
 * This module provides an APIs for generating a precondition from a json-schema
 * like syntax.
 */
import { Record } from '@quenk/noni/lib/data/record';
import { Value } from '@quenk/noni/lib/data/jsonx';

export const TYPE_OBJECT = 'object';
export const TYPE_ARRAY = 'array';
export const TYPE_STRING = 'string';
export const TYPE_NUMBER = 'number';
export const TYPE_BOOLEAN = 'boolean';

/**
 * Path to a precondition within a context.
 *
 * Paths are two strings joined by '.' with the left hand representing the
 * module and the right hand the actual precondition.
 */
export type Path = string;

/**
 * JSONPrecondition is a precondition specialized to handling jsonx values.
 */
export type JSONPrecondition = [Path, Value[]];

/**
 * PreconditionSpec specifies a precondtion.
 *
 * This can be a JSONPrecondition or an actual precondition value represented
 * by the type T output from the parse/compile function.
 */
export type PreconditionSpec<T> = JSONPrecondition | T;

/**
 * Schema is a valid form of one of the supported schemas.
 */
export type Schema =
    | ObjectTypeSchema
    | ArrayTypeSchema
    | StringTypeSchema
    | NumberTypeSchema
    | BooleanTypeSchema;

/**
 * SchemaType is one of the TYPE_* constants.
 */
export type SchemaType = string;

/**
 * PropertyTypeSchema is parent interface of those schema that appear in the
 * `properties` or `additionalProperties` keys of an object schema or the `items`
 * key of an array schema.
 */
export interface PropertyTypeSchema {
    /**
     * type indicates the type of data that is valid for this schema.
     */
    type: SchemaType;

    /**
     * cast if true indicates the field should be auto cast to the specified
     * type.
     *
     * Note that this is only honoured for string, boolean and number schema.
     */
    cast?: boolean;

    /**
     * const if specified always overrides existing values.
     */
    const?: Value;

    /**
     * default if specified is used if no value is specified for the field.
     */
    default?: Value;

    /**
     * optional indicates the schema is optional and its value can be omitted.
     */
    optional?: boolean;

  /**
   * readOnly if true indicates the property is readOnly and should not be 
   * included.
   *
   * The restrict and intersect preconditions only consider properties that 
   * are defined and will omit any not appearing in the original compiled
   * schema.
   */
    readOnly?: boolean
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
    items?: Schema;

    /**
     * minLength specifies the minimum array length allowed.
     */
    minLength?: number;

    /**
     * maxLength specifies the maximum array length allowed.
     */
    maxLength?: number;

    /**
     * nonEmpty if true, indicates the array must have at least 1 element.
     */
    nonEmpty?: boolean;
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
    pattern?: string;

    /**
     * enum if specified, restricts the valid values to the specified list.
     */
    enum?: string[];

    /**
     * nonEmpty if true, indicates the string must not be an empty string.
     */
    nonEmpty?: boolean;

    /**
     * trim if true, indicates the string should be trimmed of whitespace on
     * both ends.
     */
    trim?: boolean;

    /**
     * lowerCase if true, indicates toLowerCase() should be called on the
     * string.
     */
    lowerCase?: boolean;

    /**
     * upperCase if true, indicates toUpperCase() should be called on the
     * string.
     */
    upperCase?: boolean;

    /**
     * split if specified splits the string into an array based on the
     * token provided.
     */
    split?: string;
}

/**
 * BooleanTypeSchema represents a value that may be true or false.
 */
export interface BooleanTypeSchema extends PropertyTypeSchema {
    /**
     * enum if specified, restricts the valid values to the specified list.
     */
    enum?: boolean[];
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
