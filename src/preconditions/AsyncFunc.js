import Promise from 'bluebird';
import Func from './Func';

/**
 * AsyncFunc is the async version of Func.
 */
class AsyncFunc extends Func {

    apply(value) {

        return Promise.resolve(super.apply(value));

    }

}

export default AsyncFunc
