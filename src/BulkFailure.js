import {
    Failure
} from 'criteria-pattern-core';
/**
 * BulkFailure is a Failure class for object maps.
 * @property {object} errors - A map of error messages.

 */
class BulkFailure extends Failure {

    constructor(errors) {

        super();
        this.errors = errors;

    }

}

export default BulkFailure
