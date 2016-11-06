/**
 * Precondition represents some condition that must be satisfied
 * to continue. Implement it to validate or transform input.
 * @interface
 */
class Precondition {

    /**
     * apply this Precondition
     * Returning an instance of Error indicates the Precondition failed.
     * @param {*} value
     * @returns {*|Error}
     */
    apply() {

    }

}

export default Precondition
