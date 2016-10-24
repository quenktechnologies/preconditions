import * as core from 'criteria-pattern-core';
import Satisfaction from './Satisfaction';

/**
 * Criteria represents a set of Criterion that will be applied to 
 * the keys of an object (map).
 *
 * @param {object} schema
 * @property {object} messages
 */
class Criteria extends core.Criterion {

    constructor(schema, messages) {

        super();
        this.schema = schema;
      this.messages = messages;
        this._strategy = new Satisfaction(messages);

    }

    satisfy(value) {

        return this._strategy.apply(value, this.schema);

    }

}

export default Criteria
