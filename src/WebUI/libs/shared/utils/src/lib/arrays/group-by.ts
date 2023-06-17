export function groupByFunc<RetType extends PropertyKey, T, Func extends (arg: T) => RetType>(
	arr: T[],
	mapper: Func,
): Record<RetType, T[]> {
	return arr.reduce((accumulator, val) => {
		const groupedKey = mapper(val)
		if (!accumulator[groupedKey]) {
			accumulator[groupedKey] = []
		}
		accumulator[groupedKey].push(val)
		return accumulator
	}, {} as Record<RetType, T[]>)
}

// const test = groupByFunc([6.1, 4.2, 6.3], Math.floor)
//
//
// const products = [
// 	{ name: 'apples', category: 'fruits' },
// 	{ name: 'oranges', category: 'fruits' },
// 	{ name: 'potatoes', category: 'vegetables' },
// ]
// const groupByCategory = groupByFunc(products, (product) => {
// 	return product.category
// })

export type MapValuesToKeysIfAllowed<T> = {
	[K in keyof T]: T[K] extends PropertyKey ? K : never
}
export type Filter<T> = MapValuesToKeysIfAllowed<T>[keyof T]

export function groupBy<T extends Record<PropertyKey, any>, Key extends Filter<T>>(
	arr: T[],
	key: Key,
): Record<T[Key], T[]> {
	return arr.reduce((accumulator, val) => {
		const groupedKey = val[key]
		if (!accumulator[groupedKey]) {
			accumulator[groupedKey] = []
		}
		accumulator[groupedKey].push(val)
		return accumulator
	}, {} as Record<T[Key], T[]>)
}

export function groupInto2dArray<T extends Record<PropertyKey, any>, Key extends Filter<T>>(
	arr: T[],
	key: Key,
): T[][] {
	return Object.values(groupBy(arr, key))
}

export function groupIntoMap<T extends Record<PropertyKey, any>, Key extends Filter<T>>(
	arr: T[],
	key: Key,
): Map<T[Key], T[]> {
	const map = new Map()
	arr.forEach((item) => {
		const groupedKey = item[key]
		const collection = map.get(key)
		if (!collection) {
			map.set(groupedKey, [item])
		} else {
			collection.push(item)
		}
	})
	return map
}

export function mapToObj<T>(m: Map<string, T>): {
	[key: string]: T
} {
	return Array.from(m).reduce((obj, [key, value]) => {
		;(obj as any)[key] = value
		return obj
	}, {})
}
