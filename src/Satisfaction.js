import Promise from 'bluebird';
import {
    Failure
} from 'criteria-pattern-core';
import BulkFailure from './BulkFailure';

function resolve_message(key, msg, messages) {

    var combined = `${key}.${msg}`;

    if (messages[combined])
        return messages[combined];

    if (messages[key])
        return messages[key];

    if (messages[msg])
        return messages[msg];

    return msg;

}

/**
 * Satisfaction runs criterion all one at a time providing
 * a callback to each that allows async operations during filtering to be performed.
 * @param {object} messages 
 * @implements {Strategy}
 */
class Satisfaction {

    constructor(messages) {

        this.messages = messages || {};

    }

    apply(values, map) {

        var work = Object.keys(map);
        var ok = true;
        var errors = {};
        var o = {};

        if ((typeof values !== 'object') || (values === null))
            values = {};

        return Promise.all(work.map((key, index) => {

            if ((values[key] === null) || (values[key] === undefined))
                if (map[key].required !== true)
                    return null;

            return Promise.resolve(map[key].satisfy(values[key]))

        })).
        then(results => {

            results.forEach((result, index) => {

                if (result instanceof BulkFailure) {

                    errors[work[index]] = result.errors;
                    ok = false;

                } else if (result instanceof Failure) {

                    errors[work[index]] = result.toMessage(work[index], this.messages);
                    ok = false;

                } else if ((result !== null) && (result !== undefined)) {

                    o[work[index]] = result;

                }

            });

            return ok ? o : new BulkFailure(errors);

        });

    }
}

export default Satisfaction
