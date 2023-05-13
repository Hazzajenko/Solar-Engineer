import { getKeyVal } from './get-key-val'

export const extractKeys = (keys = [], list = []) => {
  return list.map((obj) => {
    if (!obj) return undefined
    return Object.fromEntries(keys.map((key) => [key, getKeyVal(key, obj)]))
  })
}
