/**
 * Strategy represents an api that the main Pipe class uses
 * to do its work. Custom Strategies can be created to allow
 * for more finely grained control over how the various chains of
 * a Pipe is handled.
 * @interface
 */
class Strategy {

    /**
     * apply this strategy
     * @param {object} source The source object to filter.
     * @param {Criteria} criteria 
     * @param {callback|null} done A callback that is used by the default (StepStrategy) strategy to indicate 
     * completion.
     * @returns {*}
     */
    apply(source, criteria, done) {

    }

}

export default Strategy
