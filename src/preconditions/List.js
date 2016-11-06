import beof from 'beof';
import MapError from './MapError';
import Precondition from './Precondition';
import Chainable from './Chainable';

/**
 * List applies a precondition to an array of items.
 * @param {Precondition} precondition
 */
class List extends Chainable {

    constructor(precondition) {

        super();

        beof({ precondition }).interface(Precondition);

        this.precondition = precondition;

    }

    apply(value) {

        beof({ value }).array();

        var errors = {};
        var ok = true;
        var result;
        var values = [];

        value.forEach((v, i) => {

            result = this.precondition.apply(v);

            if (result instanceof Error) {

                errors[i] = result;
                ok = false;

            } else {

                values.push(result);

            }

        });

        return ok ? values : new MapError(errors);

    }

}

export default List
