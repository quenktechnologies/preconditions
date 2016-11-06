import beof from 'beof';
import Promise from 'bluebird';
import List from './List';

/**
 * AsyncList is the async version of List.
 */
class AsyncList extends List {

    apply(value) {

        beof({ value }).array();

        var errors = {};
        var ok = true;
        var result;
        var values = [];

        return Promise.all(
            value.map((v, i) => this.precondition.apply(v).then(result => {

                if (result instanceof Error) {

                    errors[i] = result;
                    ok = false;

                } else {

                    return result;

                }

            }))).then(results => ok ? results : new MapError(errors));

    }

}

export default AsyncList
