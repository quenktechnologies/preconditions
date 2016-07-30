# Criterias

A library for filtering, validating and transforming an object.

## Background

Instead of relying on complicated O*Ms for validation, why not keep
your validation logic seperate? Of course no one enjoys writing:

```javascript

var v = new Validator(object);

v.validateName();
v.validateAge();
v.validateSomethingElse();
v.validateBlahBlahBlah();

```

This gets tedious quickly and a pain when you have to add/remove new methods or do validation
in different places. Not to mention, if you want to do some asynchronous operation or 
add additional data to your objects you code path becomes a bit more difficult to follow.

An alternative approach is to conduct all these operations in one go, via a simple interface:

```javascript

criteria.execute(object, function (err, result) {

 //do something here.

});

```

### Usage

Extend the built in [Criteria](src/Criteria)
class to get started. Each key not prefixed with '_' are treated
as checks that will be applied to the corresponding keys of any objects passed through
the `execute` method. Checks (internally called Criterion) are treated as chains
of operations that are called one after the other with each having the oppurtunity
to validate, filter, or transform the value of the keys they work on before calling the next.

A check can be one of :

1. A primitive value (string or number). In this case the value is just copied.
2. A callback function with the signature `function (key, value, done)` where:
   * key is the name of the key being processed.
   * value is the current value of that key.
   * done is a callback used to signify the end of processing with the signature 
   `function(err, key, value)` pass an instance of Error if validation fails or null to continue
    the chain.
3. A [Key](src/Key) subclass, in which case you must implement the `satisfy` method which
   has the same signature as the callback above.
4. Another instance of Criteria, use this if you want to check nested properties.

### Example

```javascript

import Criteria from 'criterias/lib/Criteria';
import Rules from 'criterias/lib/Rules';
import Custom from './MyCustomRules';

var id = 0;

class NewUser extends Criteria {

  constructor() {

    super();

    this.id = ids++;
    this.name = [Rules.required];
    this.email = [Custom.validateEmail, Custom.lookupEmail];
    this.created_at = Date.now();

  }

}

//In a route handler somewhere

function (req, res, next) {

var check = new NewUser();

check.execute(req.body, fuction(err, user) {

   if(err) {

    res.render('register.html', {errors:err.errors});

   }else{

    database.createUser(user);

   }

});

}

```

### License

Apache-2.0 (c) Quenk Technologies Limited

