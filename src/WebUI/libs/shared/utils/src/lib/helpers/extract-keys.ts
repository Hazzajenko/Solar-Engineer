import { getKeyVal } from './get-key-val'

export const extractKeys = (keys = [], list = []) => {
	return list.map((obj) => {
		if (!obj) return undefined
		return Object.fromEntries(keys.map((key) => [key, getKeyVal(key, obj)]))
	})
}

export function pick<T, K extends keyof T>(source: T, ...keys: K[]): Pick<T, K> {
	const returnValue = {} as Pick<T, K>
	keys.forEach((k) => {
		returnValue[k] = source[k]
	})
	return returnValue
}

export const omit = <T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> => {
	keys.forEach((key) => delete obj[key])
	return obj
}
