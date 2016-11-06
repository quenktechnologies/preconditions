/**
 * PreconditionError
 */
function PreconditionError(message, context) {

    this.message = message;
    this.stack = (new Error(message)).stack;

    if (Error.hasOwnProperty('captureStackTrace'))
        Error.captureStackTrace(this, this.constructor);

}

PreconditionError.prototype = Object.create(Error.prototype);
PreconditionError.prototype.name = 'PreconditionError';
PreconditionError.prototype.message = '';
PreconditionError.prototype.constructor = PreconditionError;

export default PreconditionError
