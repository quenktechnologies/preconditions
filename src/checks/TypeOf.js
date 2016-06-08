import Criterion from '../Criterion';

const DEFAULT_ERROR_MESSAGE = 'Invalid value given for {key}, expected {expected}, got {actual}!';

/**
 * TypeOf checks the type of the value being passed through the criterion chain.
 * Sets [key, value, actual, expected]
 * @implements {Criteria}
 * @param {Criteria} [next=null] If passed, will be called if this criteria
 */
class TypeOf extends Criterion {

    constructor(type, emsg, next) {

        super(next);
        this._type = type;
        this.message = (emsg) ? emsg : DEFAULT_ERROR_MESSAGE;

    }

    apply(key, value, done) {

        var expected = this._type;
        var actual = typeof value;

        if (expected === TypeOf.types.ARRAY)
            if (Array.isArray(value))
                return this.next(key, value, done);

        if (actual === expected)
            return this.next(key, value, done);

        return done(new Error(this.getMessage({
            key: key,
            value: value,
            expected: expected,
            actual: actual
        })));

    }

}

TypeOf.types = {

    ARRAY: 'array',
    OBJECT: 'object',
    NUMBER: 'number',
    STRING: 'string'

};

export default TypeOf
