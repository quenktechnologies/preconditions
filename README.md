# criteria-pattern

An async friendly version of a Criteria pattern.

## Background

Originally this library was created for validation and transforming
objects, however after coming into contact with the specification and
criteria pattern; this library is still mostly intended for 
validation and transforming objects however it has be refactored
to allowing mimicing those patterns so it can be used for buisiness logic.

## Installation

```sh
 npm install --save criteria-pattern
```

There is also a `criteria-pattern-basics` package you can install for some
basic useful criterion:

```sh
 npm install --save criteria-pattern-basics
```
## Usage

There are four main classes in this library:
* Criterion
* Failure
* Criteria
* BulkFailure

### Criterion

The `Criterion` class represents a single operation that will be performed
on the data passed to its `satisfy(value)` method. Extend this class to 
implement your own custom check, filter or business logic:

```javascript

import {Criterion, Failure} from 'criteria-pattern';

class CanUserWithdraw extends Criterion {

  satisfy(user) {

    return (user.balance > 0) ? user : new Failure('Insufficient funds!', null);

  }

}

someProcessForLoadingUsers.
get().
then(user=>{

  var check = new CanUserWithdraw();
  var result = check.satisfy(user);

  if(result instanceof Failure)
    return reply(result.error);

    withdrawFunds(result);

});

```

In the above example, returning an instance of Failure is not absolutely necessary but is highly recommended.
The `Criteria` class and the boolean logic methods of `Criterion` depend on instances of `Failure` to 
recognise a failure. If the value returned is not an instance of `Failure` and is not a
`Promise` then the Criterion is considered satisfied and the value returned as the result.

When consuming the result of `Criterion#satisfy` remember the result can be a `Failure`, `Promise` or anything else your Criterion return.

It is best to guard against unforseen race conditions by wrapping the result in a `Promise#resolve` call
and continuing execution from there.

For this reason `Criterion#satisfy` should never return an `Error` unless the intention is to reject the promise chain.

### Failure

The `Failure` class accepts two arguments to its constructor: an error message (string)  and a context (object) for the error message.
The error message can contain template variables example: `This is an error message for {you}.`. Calling `Failure#toString` will attempt to replace `{you}` with the key `you` from the context.

This is used internally to allow for more flexible error messages.

### Criteria

The `Criteria` class is a actually a sub-class of `Criterion` however it works by applying an entire schema (map/object/whatever) of Criterion to an object:

```javascript

import {basics} from 'criteria-pattern-common';
import {Criteria, BulkFailure} from 'criteria-pattern';

class NewUserCriteria extends Criteria {

  constructor() {

   super({
 
    name: basics.required().and(basics.string()).and(new NameCriterion()),
    email: basics.required().and(basics.string()).and(new EmailCriterion()),
    password: basics.required().and(basics.range(8, 255))
 
   });

  }

}

var check = new NewUserCriteria();

check.satisfy(req.body).
then(result=> {

  if(result instanceof BulkFailure)
    return res.send(409, result.errros);

    return createUserSomeHow(result.value);

});

```

`Criterion#satisfy` always returns a Promise, this Promise resolves
with the result of applying the Criteria or a `BulkFailure` when one of the Criterion fails.

### BulkFailure

A child class of `Failure` with an additional property `errors`.

### Error Messages

When using the `Criteria` class, you can pass a map of error message templates.
as the second parameter to its constructor. When a Failure occurs,
the Criteria will attempt to resolve and expand the relavant error template.

Resolution of an error message works by using either the concatenation of
key, '.' and the error message or the error message or finally the error message itself as the
property to copy from the error message map.

Example error message map:

```javascript

 const messages = {

  'name.not': 'This is the error message used when the NotCriterion fails for the name key', 
  'not': 'This will be used for any failing NotCriterion except for the name key of course',
  'email.required': 'This is used when the {email} property is not supplied',
  'required': 'This is used for failing required keys',
 }


```

### Chaining

Like the Criteria and Specification pattern, `Criterion` can be chained for boolean
logic effect. Currently the following methods are supported:

* `Criterion#and({Criterion})`
* `Criterion#or({Criterion})`
* `Criterion#Not()`

Each one returns a Crtierion sub class. Keep in mind that in order to support async
operations, their `satisfy({value})` methods all return Promises.

Example:

```javascript

var chain = (new Validate()).
            and(new AlreadySaved().Not())
            and(new CheckLockStatus()).
            or(new RequestQ()).
            and(new Save());

chain.satisfy().
then(result=> {

  if(result instanceof Failure)
  return res.send(409, result.errors);

  res.send(201);

}).
catch(e=>handleError(e));

```

## License

Apache-2.0 © Quenk Technologies Limited

