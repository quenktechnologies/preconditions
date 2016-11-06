import beof from 'beof';
import Chainable from './Chainable';

/**
 * Func wraps a function so it can be treated as a chainable Precondition.
 * @param {function<null|error>} fn
 */
class Func extends Chainable {

    constructor(fn) {

        super();

        beof({ fn }).function();

        this._fn = fn;

    }

    apply(value) {

        return this._fn(value);

    }

}

export default Func
