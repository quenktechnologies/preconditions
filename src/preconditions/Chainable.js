import beof from 'beof';
import Precondition from './Precondition';
import AsyncAdapter from './AsyncAdapter';

/* jshint ignore:start */

/**
 * Chainable provides an api that lets Precondition be chained to one another.
 * @abstract
 * @implements {Precondition}
 */
class Chainable {

    /**
     * and
     * @param {Precondition} right
     * @returns {And}
     */
    and(right) {

        return new And(this, right);

    }

    /**
     * or
     * @param {Precondition} right
     * @returns {Or}
     */
    or(right) {

        return new Or(this, right);

    }

    /**
     * async adapts the api to the async version.
     * @param {AsyncPrecondition} predicate
     * @return {AsyncChainable}
     */
    async(predicate) {

        return new AsyncAdapter(this, predicate);

    }

    apply() {

        throw new ReferenceError('Chainable.apply() was not implemented!');

    }

}
/* jshint ignore: end */


/**
 * And executes the left Precondition first then right only if the result of the left is ok.
 * @param {Precondition} left
 * @param {Precondition} right
 *
 */
class And extends Chainable {

    constructor(left, right) {

        super();

        beof({ left }).interface(Precondition);
        beof({ right }).interface(Precondition);

        this.left = left;
        this.right = right;

    }

    apply(value) {

        var result = this.left.apply(value);
        return (result instanceof Error) ? result : this.right.apply(value);

    }

}

/**
 * Or executes the left Precondition first then right only if the result of the left is not ok.
 * @param {Precondition} left
 * @param {Precondition} right
 *
 */
class Or {

    constructor(left, right) {

        beof({ left }).interface(Precondition);
        beof({ right }).interface(Precondition);

        this.left = left;
        this.right = right;

    }

    apply(value) {

        var result = this.left.apply(value);
        return (result instanceof Error) ? this.right.apply(value) : result;

    }

}

export { And, Or }
export default Chainable
