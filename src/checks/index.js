import Cast from './Cast';
import Match from './Match';
import Range from './Range';
import Required from './Required';
import TypeOf from './TypeOf';
import Timestamp from './Timestamp';

/**
 * Rules provides convenience methods for
 * creating some of the builting Criterion.
 */
class Rules {


    /**
     * cast supplies a Cast rule.
     * @param {string} type 
     */
    cast(type) {

        return new Cast(type);

    }

    /**
     * match supplies a Match rule.
     * @param {RegExp} reg 
     * @param {string} emsg 
     */
    match(reg, emsg) {

      return new Match(reg, emsg);
      
    }

    /**
     * range supplies a Range rule
     * @param {number} floor
     * @param {number} ceil 
     * @param {string} emsgFloor 
     * @param {string} emsgCeil 
     */
    range(floor, ceil, emsgFloor, emsgCeil) {

      return new Range(floor, ceil, emsgFloor, emsgCeil);
      
    }


}

export default new Rules();
