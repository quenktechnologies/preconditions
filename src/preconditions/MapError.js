/**
 * MapError
 */
class MapError extends Error {

    constructor(errors = {}, message = '') {

        super(message);

        Object.defineProperties(this, {

            errors: {
                configurable: true,
                enumerable: true,
                writable: true,
                value: errors
            },
            message: {
                configurable: true,
                enumerable: true,
                writable: true,
                value: message
            },
            name: {
                configurable: true,
                enumerable: false,
                writable: true,
                value: this.constructor.name,
            },
            stack: {
                configurable: true,
                enumerable: false,
                writable: true,
                value: (new Error(message)).stack,
            },
            expand: {
                configurable: true,
                enumerable: false,
                writable: true,
                value: function(str, context) {

                    return (typeof str === 'string') ?
                        str.replace(/\{([\w\$\.\-]*)}/g, (s, k) => context[k] || '') : '';

                },

            },
            asObject: {
                configurable: true,
                enumerable: false,
                writable: true,
                value: function(templates) {

                    var errors = this.errors;
                    var combined;
                    var message;

                    return Object.keys(errors).
                    reduce((prev, curr) => {

                        if (errors[curr].asObject) {

                            prev[curr] = errors[curr].asObject(templates);

                        } else if (errors[curr] instanceof Error) {

                            message = errors[curr].message;
                            combined = `${curr}.${message}`;

                            if (templates[combined]) {

                                prev[curr] = this.expand(templates[combined], errors[curr]);

                            } else if (templates[message]) {

                                prev[curr] = this.expand(templates[message], errors[curr]);

                            } else {

                                prev[curr] = this.expand(message, errors[curr]);

                            }

                        } else if (typeof errors[curr] === 'string') {

                            prev[curr] = this.expand(errors[curr], {}, templates);

                        } else {

                            prev[curr] = errors[curr];

                        }

                        return prev;

                    }, {});
                }

            }
        });

        if (Error.hasOwnProperty('captureStackTrace')) {
            Error.captureStackTrace(this, this.constructor);
            return;
        }

    }

    /**
     * expand a templated string.
     * @param {string} str
     * @param {object} context description
     * @returns {string}
     */
    expand(str, context) {

    }

    /**
     * toObject turns this object into a regular js object.
     */
    asObject(templates) {

    }

}

export default MapError
