import * as criteria from '../src/Map';

export class UpperCase implements criteria.Precondition<string, string> {

    apply(s: string): criteria.Result<string, string> {

        return criteria.valid(s.toUpperCase());

    }

}

export class Number<A> implements criteria.Precondition<A, number> {

    apply(n: A): criteria.Result<A, number> {

        if (typeof n === 'number')
            return criteria.valid(n);
        else
            return criteria.fail<A, number>('number', n);

    }

}

export class String<A> implements criteria.Precondition<A, string> {

    apply(v: A): criteria.Result<A, string> {

        if (typeof v === 'string')
            return criteria.valid(v);
        else
            return criteria.fail('string', v);

    }

}

export class List<A> implements criteria.Precondition<A, A> {

    apply(a: A): criteria.Result<A, A> {

        if (Array.isArray(a))
            return criteria.valid<A, A>(a);
        else
            return criteria.fail('list', a);

    }

}

export const uppercase = () => new UpperCase();
export const string = () => new String();
export const number = () => new Number();
export const list = () => new List();
