import DefaultStrategy from './DefaultStrategy';
import Criterion from './Criterion';

/**
 * Criteria is the main entry point for using this library.
 * It represents a set of Criterion that will be applied
 * to each property in an object passed to apply that it knows about.
 *
 * @abstract
 * @implements {Criterion}
 * @param {Strategy} [strategy=DefaultStrategy] The strategy to use when applyning the pipe.
 * @param {Criterion} [next=null]
 */
class Criteria extends Criterion {

    constructor(strategy, next) {

        super(next);
        this._strategy = strategy || new DefaultStrategy();

    }

    /**
     * all returns a map of Criteron this objects.
     * @returns {object}
     */
    all() {

        var o = {};

        Object.keys(this).forEach(key => {

            if (this[key] instanceof Criterion)
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

    apply(key, value, done) {

        this._strategy.execute(this, value,
            (err, o) => (err !== null) ?
            next(err, key, value) :
            this.onComplete(o, (err, o)=>done(err, key, o)));

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

        return this._strategy.execute(this, obj,
            (err, o) => (err !== null) ? done(err, obj) : this.onComplete(o, done));

    }

}

export default Criteria
