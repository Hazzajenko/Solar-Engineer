// import { AppStateActions } from '@canvas/app/data-access'

// import { Push } from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript'
// import { UnionToIntersection } from 'utility-types'

// import { GetActionParametersByKey } from '@canvas/app/data-access'

export type KeyOf<T> = {
	[K in keyof T]: {
		key: K
	}
}[keyof T]

export type ObjectKeysOf<T> = {
	[K in keyof T]: K
}

export type ObjectKeysOfInArray<T> = [keyof T]

/*const arr: ObjectKeysOfInArray<typeof AppStateActions> = [
 'setHoveringOverEntity',
 'clearState',
 'setModeState',
 'setViewPositioningState',
 'liftHoveringOverEntity',
 'setDragBoxState',
 'setPreviewAxisState',
 ]*/

export type ObjectValuesOf<T> = {
	[K in keyof T]: T[K]
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
	? I
	: never

type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R
	? R
	: never

type Push<T extends any[], V> = [...T, V]
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
	? []
	: Push<TuplifyUnion<Exclude<T, L>>, L>

type ObjValueTuple<T, KS extends any[] = TuplifyUnion<keyof T>, R extends any[] = []> = KS extends [
	infer K,
	...infer KT,
]
	? ObjValueTuple<T, KT, [...R, T[K & keyof T]]>
	: R

// type toArr = ObjValueTuple<ObjectKeysOf<typeof AppStateActions>>
type ObjectToKeyTuple<T> = ObjValueTuple<ObjectKeysOf<T>>

/*const idk: ObjectKeysOf<typeof AppStateActions> = {
 setHoveringOverEntity: 'setHoveringOverEntity',
 clearState: 'clearState',
 setModeState: 'setModeState',
 setViewPositioningState: 'setViewPositioningState',
 liftHoveringOverEntity: 'liftHoveringOverEntity',
 setDragBoxState: 'setDragBoxState',
 setPreviewAxisState: 'setPreviewAxisState',
 }*/

/*export const getObjectPropertyKeys = <T>(obj: T): KeysOf<T>[] => {
 return Object.keys(obj) as KeysOf<T>[]
 }*/

export const getObjectPropertyKeys = <T>(obj: T) => {
	return Object.getOwnPropertyNames(obj) as Readonly<ObjectToKeyTuple<T>>
}

export type TupleToObject<TTuple extends readonly PropertyKey[]> = {
	[TIndex in TTuple[number]]: TIndex
}

// const tuple = ['a', 'b', 'c'] as const
// const appKeys = getObjectPropertyKeys(AppStateActions)

// type numberArr = TupleToObject<typeof appKeys>

/*
 const idk: numberArr = {
 liftHoveringOverEntity: 'liftHoveringOverEntity',
 setDragBoxState: 'setDragBoxState',
 setHoveringOverEntity: 'setHoveringOverEntity',
 setModeState: 'setModeState',
 setPreviewAxisState: 'setPreviewAxisState',
 setViewPositioningState: 'setViewPositioningState',
 clearState: 'clearState',
 }
 */

/*const arrayToObject = <T extends readonly PropertyKey[], V>(
 array: T,
 value: V,
 ): TupleToObject<T> => {
 return array.reduce((acc, key) => {
 acc[key] = value
 return acc
 }, Object.create(null))
 }

 const idk2 = arrayToObject(appKeys, Symbol())*/

export const reducePropertyKeyArrayToObject = <T extends readonly PropertyKey[]>(
	array: T,
): TupleToObject<T> => {
	return array.reduce((acc, key) => {
		acc[key] = key
		return acc
	}, Object.create(null))
}

export const reducePropertyKeyArrayToObjectV2 = <T extends PropertyKey>(
	array: T[],
): TupleToObject<T[]> => {
	return array.reduce((acc, key) => {
		acc[key] = key
		return acc
	}, Object.create(null))
}

/*export const reducePropertyKeyArrayToObjectV3 = <T extends PropertyKey>(
 array: ((
 params: GetActionParametersByKey<
 | 'setPreviewAxisState'
 | 'setModeState'
 | 'setHoveringOverEntity'
 | 'setViewPositioningState'
 | 'setDragBoxState'
 | 'liftHoveringOverEntity'
 | 'clearState'
 >,
 ) => void)[],
 ): TupleToObject<T[]> => {
 return array.reduce((acc, key) => {
 acc[key as any] = key
 return acc
 }, Object.create(null))
 }*/

/*export const reducePropertyKeyArrayToObjectV4 = <
 T extends readonly PropertyKey[] &
 GetActionParametersByKey<
 | 'setPreviewAxisState'
 | 'setModeState'
 | 'setHoveringOverEntity'
 | 'setViewPositioningState'
 | 'setDragBoxState'
 | 'liftHoveringOverEntity'
 | 'clearState'
 >,
 >(
 array: T,
 ): TupleToObject<T> => {
 return array.reduce((acc, key) => {
 acc[key as any] = key
 return acc
 }, Object.create(null))
 }*/

// const

// const idk3 = arrayToObjectV2(appKeys)
// idk3.clearState

/*
 const convertArrayToObject = <T>(array: T[], key: keyof T) =>
 array.reduce((acc, curr) =>(acc[curr[key]] = curr, acc), {});
 */

/*const convertArrayToObject = <T>(array: T[], key: keyof T) => {
 const initialValue = {}
 return array.reduce((obj, item) => {
 return {
 ...obj,
 [item[key]]: item,
 }
 }, initialValue)
 }*/
// export type TupleToObject<X extends symbol, T extends Array<X>> = { [K in T[number]]: X }
// type numberArr = TupleToObject<number, typeof [1, 2, 3, 4, 5]>
/*const dfdsa: TupleToObject<typeof [1, 2, 3, 4, 5]> = {
 1: Symbol(),
 2: Symbol(),
 3: Symbol(),
 4: Symbol(),
 5: Symbol(),
 }*/
// const idk = getObjectPropertyKeys(AppStateActions)
/*Object.getOwnPropertyNames(AppStateActions).map((key) => {
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 const action = AppStateActions[key as keyof typeof AppStateActions]
 return (params: GetActionParameters<typeof key>) => {
 store.dispatch(action(params))
 }
 })*/
/*
 export const getObjectPropertyValues = <T>(obj: T): T[keyof T][] => {
 return Object.values(obj) as T[keyof T][]
 }*/
