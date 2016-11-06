import beof from 'beof';
import Promise from 'bluebird';
import Map from './Map';
import MapError from './MapError';

/**
 * AsyncMap is the async version of Map.
 * @param {Object.<string, AsyncTransform>} [schema=null]
 */
class AsyncMap extends Map {

    apply(value) {

        beof({ value }).object();

        var ok = true;
        var errors = {};
        var work = Object.keys(this).filter(k => typeof this[k] !== 'function');
        var values = {};

        return Promise.all(
            work.map(k =>
                this[k].apply(value[k]).then(result => {

                    if (result instanceof Error) {
                        result.key = k;
                        errors[k] = result;
                        ok = false;
                    } else if (result != null) {

                        values[k] = result;

                    }

                }))).
        then(result => (ok) ? values : new MapError(errors));

    }

}

export default AsyncMap
