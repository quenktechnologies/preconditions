# Preconditions

Library for creating constraints before data is used.

## Installation

```bash
npm install --save @quenk/preconditions
```
## Usage

A precondition is a function that when applied to a value
returns either a Failure or the final form of the value.

This module defines provides two precondition types, synchronous and asynchronous.

```typescript
//Sync
type Precondition<A,B> = (a:A) => Either<Failure<A>, B>;

//Async
type Precondition<A,B> = (a:A) => Promise<Either<Failure<A>, B>>

```
For both versions there exists useful functions for working with 
ECMAScript primitives, arrays and objects. There is also a function called
`async` which makes it easier to cast between the two.

The `Either` type is provided by the [@quenk/noni](https://github.com/quenktechnologies/noni)
package and the `Promise`, [bluebird](https://bluebirdjs.com).

## License

Apache-2.0 © Quenk Technologies Limited
