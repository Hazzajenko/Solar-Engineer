export const convertToObject = ({ key, list = [] }: { key: any; list: any[] }) => {
  if (!list || !list.length || !key) return undefined
  const kvals = list.map((item) => item[key]).filter((v) => v !== undefined)
  return Object.fromEntries(kvals.map((kval) => [kval, list.find((item) => item[key] === kval)]))
}
/*

export function convertToRecord2<T, K extends string | number>(
  key: string,
  list: T[],
): Record<K, T> {
  if (!list || !list.length || !key) {
    return {} as Record<K, T>
  }
  const kvals = list.map((item) => item[key]).filter((v) => v !== undefined) as K[]
  return kvals.reduce((acc, kval) => {
    const item = list.find((item) => item[key] === kval)
    if (item) {
      return { ...acc, [kval]: item }
    } else {
      return acc
    }
  }, {} as Record<K, T>)
}

export function convertToRecord3<T, K extends keyof T & (string | number | symbol)>(
  key: K,
  list: T[],
): Record<K, T> {
  const kvals = list.map((item) => item[key]).filter((v) => v !== undefined) as K[]
  return kvals.reduce((acc, kval) => {
    const item = list.find((item) => item[key] === kval)
    if (item) {
      return { ...acc, [kval]: item }
    } else {
      return acc
    }
  }, {} as Record<K, T>)
}

export function convertToRecord4<T, K extends keyof T, X extends typeof K>(
  key: K,
  list: T[],
): Record<X, T> {
  const kvals = list.map((item) => item[key]).filter((v) => v !== undefined) as X[]
  return kvals.reduce((acc, kval) => {
    const item = list.find((item) => item[key] === kval)
    if (item) {
      return { ...acc, [kval]: item }
    } else {
      return acc
    }
  }, {} as Record<X, T>)
}
*/
