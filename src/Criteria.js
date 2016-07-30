import DefaultStrategy from './DefaultStrategy';

/**
 * Criteria is the main entry point for using this library.
 * Each key decleared in a Criteria sub class represents
 * a check or set of checks that will be performed on corresponding
 * keys of each object passed to the execute() method.
 *
 * Any key prefixed with '_' (underscore) is treated as private and is
 * not considered a check.
 *
 * @abstract
 * @implements {Criterion}
 */
class Criteria {

    /**
     * getCriteria returns a map of Criteron this objects.
     * @returns {object}
     */
    getCriteria() {

        var o = {};

        Object.keys(this).forEach(key => {

            if (this.hasOwnProperty(key))
                if (key[0] !== '_')
                    o[key] = this[key];

        });

        return o;

    }

    /**
     * onComplete is called if there are no errors after applying all the rules.
     * @param {object} result 
     * @param {function} done 
     */
    onComplete(result, done) {

        done(null, result);

    }

    /**
     * onError is called if an error occured after applying all the rules.
     */
    onError(err, obj, done) {

        done(err, obj);

    }

    satisfy(key, value, done) {

        (new DefaultStrategy()).execute(this, value,
            (err, o) => (err !== null) ?
            done(err, key, value) :
            this.onComplete(o, (err, o) => done(err, key, o)));

    }

    /**
     * execute the rules to the passed object.
     * If a callback is provided, it is called with the results,
     * the return value of the internal strategy in use is also returned which
     * is expected to be null or a Promise.
     * @param {object} obj The object to apply through the pipe.
     * @param {function} cb A callback that is called with the results.
     * @returns {null|Promise} 
     */
    execute(obj, done) {

        (new DefaultStrategy()).execute(this, obj,
            (err, o) => (err !== null) ? this.onError(err, obj, done) : this.onComplete(o, done));

    }

}

export default Criteria
