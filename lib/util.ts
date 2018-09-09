
/**
 * combineKeys the keys of two objects into an array.
 */
export const combineKeys = (o1: object, o2: object): string[] =>
  Object
    .keys(o1)
    .concat(Object.keys(o2))
    .filter((k, i, l) => l.indexOf(k) == i);
