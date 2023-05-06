import { Dictionary } from '@ngrx/entity'

export const dictionaryToArray = <
	T extends {
		id: string
	},
>(
	dictionary: Dictionary<T>,
) => {
	return Object.values(dictionary)
}

export const dictionaryToMap = <
	T extends {
		id: string
	},
>(
	dictionary: Dictionary<T>,
) => {
	return Object.entries(dictionary).reduce((acc, [key, value]) => {
		acc.set(key, value)
		return acc
	}, new Map())
}