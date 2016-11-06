export function uppercase() {

    return {

        apply(str) {
            return str.toUpperCase();
        }
    };
}

export function number() {

    return {

        apply(value) {

            if (typeof value !== 'number')
                return Error;

            return value;

        }

    }

}

export function string() {

    return {

        apply(value, key, errors) {

            if (typeof value !== 'string')
                return new Error();

            return value;

        }

    }

}

export function array() {

    return {

        apply(value, key, errors) {

            if (!Array.isArray(value))
                return new Error();

            return value;

        }

    }

}
