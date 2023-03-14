export const getKeyVal = (key: string | number, obj: any) => {
  if (!obj) return undefined
  // eslint-disable-next-line no-prototype-builtins
  if (obj.hasOwnProperty(key)) return obj[key]
  return undefined
}
