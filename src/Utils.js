/**
 * Utils provides internally helpful methods.
 */
class Utils {

    /**
     * merge the properties of src into dest ignoring
     * any that appear in exclude.
     * @param {Object} src
     * @param {Object} dest
     * @param {string|Array} [exclude]
     */
    merge(src, dest, exclude) {

        exclude = Array.isArray(exclude) ? exclude : [exclude];

        Object.keys(src).forEach((key) => {

            if (exclude.indexOf(key) > -1) return;

            Object.defineProperty(dest, key, {
                configurable: false,
                enumerable: true,
                writable: true,
                value: src[key]
            });

        });
    }

    /**
     * hidden hides a property from enumeration.
     * @param {Object} o
     * @param {string} key
     * @param {*} value
     */
    hidden(o, key, value) {

        Object.defineProperty(o, key, {
            configurable: false,
            enumerable: false,
            value: value
        });


    }
}

export default new Utils();
