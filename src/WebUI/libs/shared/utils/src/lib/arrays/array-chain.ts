/*interface Array<T> {
 arrayChain<U>(callback: (element: T, index: number, array: T[]) => U): U[]
 }*/
export {}

declare global {
  interface Array<T> {
    arrayChain<U>(callback: (element: T, index: number, array: T[]) => U): U[]
  }
}

Array.prototype.arrayChain = function <T, U>(
  this: T[],
  callback: (element: T, index: number, array: T[]) => U,
): U[] {
  const output: U[] = []

  for (let i = 0; i < this.length; i++) {
    const result = callback(this[i], i, this)
    output.push(result)
  }

  return output
}

const inputArray: number[] = [1, 2, 3]

const outputArray = inputArray.arrayChain((x) => x * 2)

console.log(outputArray) // [2, 4, 6]
