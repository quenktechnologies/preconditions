import {
    Record,
    empty as isEmpty,
    filter,
    map
} from '@quenk/noni/lib/data/record';
import { empty } from '@quenk/noni/lib/data/array';

import {
    Node,
    PrimNode,
    ArrayNode,
    ObjectNode,
    BuiltinsAvailable,
    ParseContext
} from '../parse';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { JSONPrecondition, Schema } from '..';
import { Type } from '@quenk/noni/lib/data/type';

/**
 * BuiltinsConf allow for the configuration of the builtinsAvailable parser
 * option.
 *
 * Specifying "false" disables all builtins, specifying false for a single
 * schema disables builtins for that schema.
 */
export type Builtins =
    | boolean
    | { [K in keyof BuiltinsAvailable]: boolean }
    | Partial<BuiltinsAvailable>;

/**
 * BaseOptions for compilation.
 */
export interface BaseOptions {
    /**
     * key indicates the key that custom pipelines will be read from on
     * a schema.
     *
     * Defaults to "preconditions".
     */
    key: string;

    /**
     * propMode specifies how to treat the "properties" field of object types.
     *
     * Each value corresponds to a precondition from the object module.
     */
    propMode: 'restrict' | 'intersect' | 'disjoin' | 'union';

    /**
     * builtins allows the builtinsAvailable passed to the parser to be
     * overwritten.
     */
    builtins: Builtins;
}

const allDisabled = {
    object: [],
    array: [],
    string: [],
    boolean: [],
    number: []
};

/**
 * CompileContext is a base class used to handle the stages of compiling a
 * schema.
 *
 * The functions provided in this interface are used to shape the precondition
 * tree created after parsing.
 */
export abstract class CompileContext<T, O extends BaseOptions = BaseOptions>
    implements ParseContext<T>
{
    constructor(public options: O) {}

    /**
     * identity provides a precondition that always succeeds with its value.
     */
    abstract identity: T;

    get builtinsAvailable() {
        let { builtins } = this.options;

        if (builtins === false) {
            return allDisabled;
        } else if (builtins === true) {
            return {};
        } else {
            let obj = filter(
                <Record<boolean | string[]>>builtins,
                val => val === true
            );
            return map(obj, val => {
                if (val === false) return [];
                return val;
            });
        }
    }

    /**
     * optional wraps a precondition in an optional precondition wrapper to
     * prevent execution if a value is not specified.
     */
    abstract optional: (prec: T) => T;

    /**
     * and joins to preconditions via logical and operation.
     */
    abstract and: (left: T, right: T) => T;

    /**
     * or joins to preconditions via a logical or operation.
     */
    abstract or: (left: T, right: T) => T;

    /**
     * every joins each precondition in the list into one.
     */
    every = (precs: T[]) => {
        let [prec] = precs;
        for (let i = 1; i < precs.length; i++) {
            prec = this.and(prec, precs[i]);
        }
        return prec;
    };

    /**
     * properties combines the preconditions of an object's properties into
     * one precondition.
     *
     * This precondition must handle record/object types.
     */
    abstract properties: (props: Record<T>) => T;

    /**
     * additionalProperties wraps a precondition so it can be used on the
     * encountered properties of an object.
     */
    abstract additionalProperties: (prec: T) => T;

    /**
     * items given a precondition, produces a precondition that will apply it
     * to each element of an array.
     *
     * Note: The resulting precondition should ensure the value passed is an
     * array first.
     */
    abstract items: (prec: T) => T;

    abstract get: (path: string, args: Type[]) => Maybe<T>;

    getPipeline = (schema: Schema) =>
        <JSONPrecondition[]>schema[this.options.key] || [];

    /**
     * visitObject turns an object node into a single precondition.
     */
    visitObject = (node: ObjectNode<T>) => {
        let [, [builtins, rec, addProps, precs = []]] = node;

        let builtinPrecs;

        if (!empty(builtins)) builtinPrecs = this.every(builtins);

        let props;

        if (!isEmpty(rec)) props = this.properties(rec);

        if (addProps) {
            let prec = this.additionalProperties(addProps);
            props = props ? this.or(props, prec) : prec;
        }

        let result;

        if (builtinPrecs && props) {
            result = this.and(builtinPrecs, props);
        } else if (builtinPrecs) {
            result = builtinPrecs;
        } else if (props) {
            result = props;
        }

        if (!empty(precs)) {
            let prec = this.every(precs);
            result = result ? this.and(result, prec) : prec;
        }

        return result ? result : this.identity;
    };

    /**
     * visitArray turns an array node into a single precondition.
     */
    visitArray = (node: ArrayNode<T>) => {
        let [, [builtins, items, precs = []]] = node;
        let result = items ? this.items(items) : this.identity;

        if (!empty(builtins)) result = this.and(this.every(builtins), result);

        if (!empty(precs)) result = this.and(result, this.every(precs));

        return result;
    };

    /**
     * visitPrim turns a primitive node into a single precondition.
     */
    visitPrim = ([, precs]: PrimNode<T>) =>
        empty(precs) ? this.identity : this.every(precs);

    visit = (node: Node<T>): T => {
        let type = node[0];
        let result;
        if (type === 'object') result = this.visitObject(<ObjectNode<T>>node);
        else if (type === 'array') result = this.visitArray(<ArrayNode<T>>node);
        else result = this.visitPrim(<PrimNode<T>>node);

        return node[2] === true ? this.optional(result) : result;
    };
}
