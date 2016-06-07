import Criterion from '../Criterion';

/**
 * Required ensures that the target value is not null, undefined, or an empty string.
 * @implements {Criteria}
 * @param {Criteria} [next=null] If passed, will be called if this criteria
 */
class Required extends Criterion {

    apply(key, value, done) {

        if ((value === '') || (value === null) || (value === undefined))
            return done(new Error(`The field '${key}' is required!`), key, value);

        this.next(key, value, done);

    }

}

export default Required
