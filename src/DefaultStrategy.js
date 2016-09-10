import ExecutionError from './ExecutionError';

/**
 * DefaultStrategy runs criterion all one at a time providing
 * a callback to each that allows async operations during filtering to be performed.
 * @implements {Strategy}
 */
class DefaultStrategy {

    _run(list, key, value, done) {

        var q = list.slice();
        var target;

        var next = function(err, key, value) {

            if (err !== null)
                return done(err, key, value);

            if (q.length === 0)
                return done(null, key, value);

            if (key === null)
                return done(null, null, null);

            target = q.shift();

            if (typeof target === 'function')
                return target(key, value, next);

            if (typeof target === 'object')
                if (target !== null)
                    if (Array.isArray(target)) {
                        return next(null, key, target);
                    } else {
                        return target.call(null, key, value, next);
                    }

            next(null, key, target);

        };

        next(null, key, value);

    }

    execute(criteria, obj, done) {

        var all = criteria.getCriteria();
        var left = Object.keys(all).length;
        var errorCount = 0;
        var errors = {};
        var result = {};

        if ((typeof obj !== 'object') || (obj === null))
            return done(new Error('Payload is empty!'));

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

        if (left === 0)
            return done(null, obj);

        Object.keys(all).
        forEach(key => {
            this._run(
                (Array.isArray(all[key])) ?
                all[key] : [all[key]], key, obj[key], next)

        });

        return null;

    }
}

export default DefaultStrategy
