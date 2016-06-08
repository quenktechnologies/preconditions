import Criterion from '../Criterion';

const DEFAULT_MSG = 'The field \'{key}\' is required!';
/**
 * Required ensures that the target value is not null, undefined, or an empty string.
 * @implements {Criteria}
 * @param {Criteria} [next=null] If passed, will be called if this criteria
 */
class Required extends Criterion {

    constructor(msg) {

        super(msg || DEFAULT_MSG);

    }

    apply(key, value, done) {

        if ((value === '') || (value === null) || (value === undefined))
            return done(new Error(this.template({
                key,
                value
            })), key, value);

        done(null, key, value);

    }

}

export default Required
