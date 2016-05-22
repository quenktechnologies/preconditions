/**
 * ExecutionError is used to neatly combine the
 * errors of the various criteria. It is not intended to be thrown but rather
 * passed as an indicator that errors have occured.
 * @param {object} errors A list of all the errors that have occured
 * @param {number} count  The number of errors that have occured.
 */
class ExecutionError extends Error {

    constructor(errors) {

        super('Errors have occured, use the \'errors\' property of this object to get more information!');

        this.name = this.constructor.name;
        this.errors = errors;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }

    }
}

export default ExecutionError
