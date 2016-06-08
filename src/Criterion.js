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
 * @abstract
 */
class Criterion {

    constructor(msg) {

        this.message = msg || 'The value for {key} is invalid!';

    }

    /**
     * template interpolates the values in a template string so
     * it can be used to display meaningfull messages.
     * @param {object} context 
     */
    template(context) {

        return this.message.replace(/\{([\w\$\.\-]*)}/g, (s, k) => context[k]);

    }

    /**
     * apply the Criterion.
     * @param {string} key The property name currently being actioned.
     * @param {*} value The value of the property
     * @param {done} done A callback that will be called when the Criterion has finished its work.
     */
    apply(key, value, done) {

        throw new ReferenceError('apply() must be overrided!');

    }

}

export default Criterion
