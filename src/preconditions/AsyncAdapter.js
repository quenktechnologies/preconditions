import beof from 'beof';
import Promise from 'bluebird';
import AsyncChainable from './AsyncChainable';

/**
 * AsyncAdapter allows a synchronous Predicate to be chained to an
 * asynchronous one. The synchrounous one is executed via bluebird's
 * Promise.try.
 * @param {Predicate} sync
 * @param {AsyncPredicate} async
 */
class AsyncAdapter extends AsyncChainable {

    constructor(sync, async) {

        super();

        this._sync = sync;
        this._async = async;

    }

    apply(value) {

        return Promise.try(() => this._sync.apply(value)).
        then(result => result instanceof Error ? result : this._async.apply(value));

    }

}

export default AsyncAdapter
