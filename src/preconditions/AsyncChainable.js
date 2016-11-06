import beof from 'beof';
import Promise from 'bluebird';
import AsyncPrecondition from './AsyncPrecondition';

/* jshint ignore:start */

/**
 * AsyncChainable is the async version of Chainable.
 * @abstract
 * @implements {AsyncPrecondition}
 */
class AsyncChainable {

    /**
     * and
     * @param {AsyncPrecondition} right
     * @returns {AsyncAnd}
     */
    and(right) {

        return new AsyncAnd(this, right);

    }

    /**
     * or
     * @param {AsyncPrecondition} right
     * @returns {AsyncOr}
     */
    or(right) {

        return new AsyncOr(this, right);

    }

    /**
     * sync adapts the sync api to become async
     * @param {AsyncPrecondition} predicate
     * @return {AsyncChainable}
     */
    sync(predicate) {

        return new SyncAdapter(this, predicate);

    }

        apply() {

        throw new ReferenceError('AsyncChainable.apply() was not implemented!');

    }

}

/* jshint ignore:end */

/**
 * AsyncAnd is the async version of And.
 * @param {AsyncPrecondition} left
 * @param {AsyncPrecondition} right
 */
class AsyncAnd extends AsyncChainable {

    constructor(left, right) {

        super();

        this._left = left;
        this._right = right;

    }

    apply(value) {

        return this._left.apply(value).
        then(result => result instanceof Error ? result : this._right.apply(value));

    }

}

/**
 * AsyncOr executes the left AsyncPrecondition first then right only if the result of the left is not ok.
 * @param {AsyncPrecondition} left
 * @param {AsyncPrecondition} right
 *
 */
class AsyncOr extends AsyncChainable {

    constructor(left, right) {

        super();
        this._left = left;
        this._right = right;

    }

    apply(value) {

        return this._left.apply(value).
        then(result => (result instanceof Error) ? this._right.apply(value) : result);

    }

}

/**
 * SyncAdapter allows a synchronous AsyncPrecondition to be included in an already
 * asynchronous chain.
 * @param {AsyncAsyncPrecondition} async
 * @param {AsyncPrecondition} sync
 */
class SyncAdapter extends AsyncChainable {

    constructor(async, sync) {

        super();
        this._async = async;
        this._sync = sync;

    }

    apply(value) {

        return this._async.apply(value).
        then(result => result instanceof Error ?
            result :
            Promise.try(() => this._sync.apply(value)));

    }

}

export { AsyncAnd, AsyncOr, SyncAdapter };
export default AsyncChainable
