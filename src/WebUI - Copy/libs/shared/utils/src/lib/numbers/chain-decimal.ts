export {}
declare global {
  interface Number {
    toTwoDecimals(this: number): number

    // arrayChain<U>(callback: (element: T, index: number, array: T[]) => U): U[]
  }
}

Number.prototype.toTwoDecimals = function (this: number): number {
  return Math.round(this * 100) / 100
}

/*
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
 */

/*const inputArray: number[] = [1, 2, 3]

 const outputArray = inputArray.arrayChain((x) => x * 2)

 console.log(outputArray) // [2, 4, 6]*/
