/**
 *
 * @callback done Called by Criterion implementors to indicate if the new values for key and value
 * of the property as well as any error if one occurs.
 * @param {null|Error} err 
 * @param {string} key 
 * @param {*} value 
 */

/**
 * Criterion is the abstract class that must be sub classed to 
 * create a check, filter or other operation during the execution of Criteria.
 * @param {Criteria} [next=null] If passed, will be called if this criteria
 * @abstract
 */
class Criterion {

    constructor(next) {

        this._next = next || null;

    }

    /**
     * next will apply the next Criterion if it exists.
     * @param {string} key 
     * @param {*} value 
     * @param {CriterionCallback} done 
     */
    next(key, value, done) {

        if (this._next !== null)
            return this._next.apply(key, value, done);

        done(null, key, value);

    }

    /**
     * apply the Criterion.
     * @param {string} key The property name currently being actioned.
     * @param {*} value The value of the property
     * @param {done} done A callback that will be called when the Criterion has finished its work.
     */
    apply(key, value, done) {

    }

}

export default Criterion
