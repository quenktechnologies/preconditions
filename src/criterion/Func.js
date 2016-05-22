import Criterion from '../Criterion';

/**
 *
 * @callback CriterionCallback
 * @param {string} key
 * @param {*} value 
 * @param {function} done
 *
 */

/**
 * Func simply calls a function.
 * @param {CriterionCallback} f
 * @param {Criterion|null} The next Criteria to activate after this one.
 */
class Func extends Criterion {

    constructor(f, next) {

        super(next);
        this._f = f;

    }

    enforce(key, value, done) {

        var next;
        var ptr = 0;

        this._f(key, value, (err, key, value) => {

            if (err !== null)
                return done(err, key, value);

            return this.next(key, value, done);

        });

    }

}

export default Func
