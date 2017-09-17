export default async function equal<T>(
  first: AsyncIterable<T> | Iterable<T>,
  second: AsyncIterable<T> | Iterable<T>,
  comparer: (a: T, b: T) => boolean
    = function (a, b) { return a === b }
): Promise<boolean> {

  const ItA = first[Symbol.asyncIterator] || first[Symbol.iterator]
  const ItB = second[Symbol.asyncIterator] || second[Symbol.iterator]

  if (typeof ItA !== "function")
    throw Error("first parameter is not iterable");
  if (typeof ItB !== "function")
    throw Error("second parameter is not iterable");

  const ita: AsyncIterator<T> | Iterator<T> = ItA.call(first);
  const itb: AsyncIterator<T> | Iterator<T> = ItB.call(second);

  while (true) {

    let [na, nb] = await Promise.all([ita.next(), itb.next()]);

    if (na.done && nb.done) {
      return true;
    }

    if (na.done !== nb.done) {
      return false;
    }

    if (typeof na.value !== typeof nb.value) {
      return false;
    }

    if (comparer(na.value, nb.value) === false) {
      return false;
    }
  }
}