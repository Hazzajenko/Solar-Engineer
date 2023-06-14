export type UppercaseObjectKeys<
	T extends {
		[key: string | number | symbol]: any
	},
> = {
	[x in Uppercase<Extract<keyof T, string>> | Exclude<keyof T, string>]: x extends string
		? T[Lowercase<x>]
		: T[x]
}

export function uppercaseObjectKeys<T extends Record<any, any>>(existingObject: T) {
	return Object.keys(existingObject).reduce((acc, key) => {
		const newKey = `${key}`.toUpperCase() as keyof UppercaseObjectKeys<T>
		acc[newKey] = existingObject[key]
		return acc
	}, {} as UppercaseObjectKeys<T>)
}

type dfsfdsf = {
	test: string
}
const asdsa: UppercaseObjectKeys<dfsfdsf> = {
	TEST: 'Test',
}
