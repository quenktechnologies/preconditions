# Preconditions

A library for validating, transforming and filtering data.

## Installation

``bash
npm install --save @quenk/preconditions

## Usage

```ts

import * as Map from '@quenk/preconditions';

class Test extends Map.Map {
 
  name = Map.string()
  age = Map.or(Map.string(), Map.number())
  status = Map.equals('active')

}

let test = new Test();

//left function handles failure, right receives the original value
let results = test.apply({age:'12'}).cata(f=>f.expand(), v=>v);

console.log(results); // {name:'string', status:'equals'}

```

## License

Apache-2.0 © Quenk Technologies Limited

