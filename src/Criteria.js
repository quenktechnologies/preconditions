import * as core from 'criteria-pattern-core';
import Satisfaction from './Satisfaction';

function merge(that, o) {

    Object.keys(o).forEach(function(key) {

        Object.defineProperty(that, key, {
            configurable: false,
            enumerable: true,
            value: o[key]
        });

    });

}

/**
 * Criteria represents a set of Criterion that will be applied to 
 * the keys of an object (map).
 *
 * @param {object} schema
 * @property {object} messages
 */
class Criteria extends core.Criterion {

    constructor(schema = null, messages = {}) {

        super();

        if (schema)
            merge(this, schema);

        Object.defineProperty(this, '_messages', {
            enumerable: false,
            configurable: false,
            value: messages
        });

        Object.defineProperty(this, '_strategy', {
            enumerable: false,
            configurable: false,
            value: new Satisfaction(messages)
        });

    }

    satisfy(value) {

        return this._strategy.apply(value, this);

    }

}

export default Criteria
