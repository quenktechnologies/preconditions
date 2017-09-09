# Preconditions

A module for validating, transforming and filtering data.

## Installation

```bash
npm install --save @quenk/preconditions
```
## Usage

This module provides an api for applying preconditions to data.

Typically, a precondition is a function of the form:

```haskell
precondition :: forall a b. a -> Either (Failure a) b 

```
to borrow syntax from Purescript.

We use an implentation of the Either monad from the
[afpl](https://github.com/metasansana/afpl) library (that may change at some point) 
which is loosely inspired by `monet.js` and the `fantasy-land` spec.

All preconditions return an Either, you can retrieve the value by apply
a function over the left or right side (using the afpl.Either#cata method) 
or `map`/`chain` etc.

### Failure

Failure is the type used to represent a failed precondition,
it has an `explain(context?)` method that provides details of what precondition failed
(preconditions can be chained to get to run one after the other).

It's good practice to provide an identifier for your Failure rather than a whole
message, that way it can be customised later using templates. You pass
a context object to explain and it will expand the identifier with text
it finds in the context object.

Failure comes with three implementations that return a different type of explanation:

 Type         | Description                      
 ------------ | ---------------------------------
 Failure      | Used for any one value, returns a description of one failure.      
 MapFailure   | Used when a map (object,hash etc) has failures, has info for more than one                         
 ListFailure  | Used for arrays, takes a map of Failures here each key is a failed index.              

When implementing your own preconditions, you don't have to touch `afpl` (as it may change).
Use the provided functions: `fail`, `mapFail`, `listFail` or `valid` on success.

See the commented source for more information.

### Templates

Failure classes recognize a small templating syntax using the module
[polate](https://github.com/quenktechnologies/polate). Anything between `{ }` is 
treated as a context variable and is looked up, if not found, it is left as is.

For MapFailures a property `$key` is added to the context so templates can retrieve 
the name of the property. With ListFailures, it is `$index`.  

Prefix a key in the context passed to a MapFailure's explain with the key name followed
by the precondition, example : `myKey.lengthCheck' and that template will be given 
priority, if not any key corresponding to `myKey` will be used or `lengthCheck` if 
that does not exist. 

Finally if none of the above exist, the identifier of the Failure is expanded and left as is.

### Builtins

See the [index.ts](index.ts) for a list of built in functions.
The most useful of which are the `map` and `list` which allow you to apply
preconditions to a javascript object or array.

## Example

```typescript

import {
    Preconditions,
    map,
    fail,
    valid,
    and,
    string,
    upper,
    number,
    range,
    isin
} from './';

interface User {

    name: string,
    age: number,
    flags: Flags,
    status: number,

}

interface Flags {

    A: boolean,
    B: boolean,
    C: boolean

}

type UserUnion
    = string
    | number
    | Flags
    | any[] //necessary for range, as it measures arrays as well
    ;

//a custom precondition
const len = (length: number) => (s: string) => s.length > length ?
    fail<string, string>('len', s, { length }) : valid<string, string>(s);

const user: Preconditions<any, UserUnion> = {

    name: and(string, and(len(12), upper)),
    age: and(number, range(20, 80)),
    status: isin(['active', 'inactive'])

}

//indicate what value types to expect on the object keys and
//the specify the resulting final object.
const test = map<any, User>(user);

//context for error messages
let ctx = {

    'name': 'There was an error with name',
    'name.len': 'Name is longer than {length}',
    'range': '{$key} is out of range {min}-{max}',
    'status.isin': 'Name must be one of ({enum})'

}

test({ name: 'Red Beans With Jerk Chicken And A Fresh Salad', age: Infinity })
    .map(console.log)
    .orRight(f => console.log(f.explain(ctx)));

//The above logs 
//{ name: 'Name is longer than 12',
//  age: 'age is out of range 20-80',
//  status: 'Name must be one of (active,inactive)' }

test({ name: 'sherman', age: 21, status: 'active' }).map(console.log)

//The above logs
//{ name: 'SHERMAN', age: 21, status: 'active' }

```
## License

Apache-2.0 © Quenk Technologies Limited
