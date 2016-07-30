/**
 *
 * @callback done Called by Criterion implementors to indicate if the new values for key and value
 * of the property as well as any error if one occurs.
 * @param {null|Error} err 
 * @param {string} key 
 * @param {*} value 
 */

/**
 * Key represents a single key on an object being filtered. 
 * @abstract
 * @implements {Criterion}
 */
class Key {

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

    statisfy(key, value, done) {

        throw new ReferenceError('satisfy() must be overrided!');

    }

}

export default Key
