import ExecutionError from './ExecutionError';

/**
 * DefaultStrategy runs criterion all one at a time providing
 * a callback to each that allows async operations during filtering to be performed.
 * @implements {Strategy}
 */
class DefaultStrategy {

    execute(criteria, obj, done) {

        var all = criteria.all();
        var allKeys = Object.keys(all);
        var left = allKeys.length;
        var errorCount = 0;
        var errors = {};
        var result = {};

        var next = function(err, key, value) {

            left--;

            if (err) {
                errors[key] = err.message;
                errorCount++;
            } else if (value !== null) {
                result[key] = value;
            }

            if (left === 0) {

                if (errorCount > 0) {

                    done(new ExecutionError(errors), obj);

                } else {
                    done(null, result);
                }


            }

        }

        if (left === 0) return done(null, obj);
        allKeys.forEach((key) => all[key].apply(key, obj[key], next));
        return null;

    }
}

export default DefaultStrategy
