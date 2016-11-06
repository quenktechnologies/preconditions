import beof from 'beof';
import Chainable from './Chainable';
import MapError from './MapError';
import Utils from '../Utils';

/**
 * Map
 * @param {Object.<string, Precondition>} [schema=null]
 */
class Map extends Chainable {

    constructor(schema = null) {

        super();

        if (schema)
            Utils.merge(schema, this, 'apply');

    }

    apply(value) {

        beof({ value }).object();

        var ok = true;
        var errors = {};
        var result;
        var values = {};

        Object.keys(this).forEach(k => {

            if (typeof this[k] === 'function') return;

            result = this[k].apply(value[k]);

            if (result instanceof Error) {

                result.key = k;
                errors[k] = result;
                ok = false;

            } else if(result != null) {

                values[k] = result;

            }

        });

        return (ok) ? values : new MapError(errors, value);

    }

}

export default Map
