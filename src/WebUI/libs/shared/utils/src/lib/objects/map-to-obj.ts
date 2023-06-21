/*
 const arr2 = [
 {name: 'country', value: 'Austria'},
 {name: 'age', value: 30},
 {name: 'city', value: 'Vienna'},
 ];

 const obj = Object.fromEntries(
 arr2.map(obj => [obj.name, obj.value])
 );

 */
import { Dictionary } from '@ngrx/entity'
import { UpdateStr } from '@ngrx/entity/src/models'

export const mapArrayToUpdateStr = <
	T extends {
		id: string
	},
>(
	array: T[],
): UpdateStr<T>[] => {
	return array.map((item) => ({
		id: item['id'],
		changes: item,
	}))
}

export const mapToObject = <
	T extends {
		id: string
	},
>(
	array: T[],
): Record<string, T> => {
	return array.reduce((acc, item) => ((acc[item['id']] = item), acc), {} as Record<string, T>)
}

export const mapToDictionary = <
	T extends {
		id: string
	},
>(
	array: T[],
): Dictionary<T> => {
	return array.reduce((acc, item) => ((acc[item['id']] = item), acc), {} as Dictionary<T>)
}

export const toEntities = <
	T extends {
		id: string
	},
>(
	collection: T[],
) => {
	return collection.reduce(
		(prev, next) => ({
			...prev,
			[next.id]: next,
		}),
		{},
	)
}

export const entitiesToMap = <
	T extends {
		id: string
	},
>(
	entities: T[],
) => {
	return entities.reduce((acc, element) => {
		acc.set(element.id, element)
		return acc
	}, new Map())
}

export const entitiesToArray = <
	T extends {
		id: string
	},
>(
	entities: T[],
) => {
	return Object.entries(entities)
}

const object = {
	'1': { id: '1', name: 'John' },
	'2': { id: '2', name: 'Jane' },
}

const arr = Object.values(object)

/*
 const arr = [
 { id: '1', name: 'John' },

 { id: '2', name: 'Jane' },
 ]

 const record = mapToObject(arr)*/
