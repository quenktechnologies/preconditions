import * as criteria from '../src';

export class UpperCase implements criteria.Precondition<string, string> {

    apply(s: string): criteria.Result<string> {

        return criteria.valid(s.toUpperCase());

    }

}

export class Number<A> implements criteria.Precondition<A, number> {

    apply(n: A): criteria.Result<number> {

        if (typeof n === 'number')
            return criteria.valid(n);

        else
            return criteria.fail<number>('number');

    }

}

export class String<A> implements criteria.Precondition<A, string> {

    apply(v: A): criteria.Result<string> {

        if (typeof v === 'string')
            return criteria.valid(v);
        else
            return criteria.fail<string>('string');

    }

}

export class List<A> implements criteria.Precondition<A, A> {

    apply(a: A): criteria.Result<A> {

        if (Array.isArray(a))
            return criteria.valid<A>(a);
        else
            return criteria.fail<A>('list');

    }

}

export const uppercase = () => new UpperCase();
export const string = ()=>new String();
export const number = () => new Number();
export const list = () => new List();
