export const assertIsString = (value: unknown, message?: string): asserts value is string => {
	if (typeof value === 'string') {
		throw new Error(message ?? `Expected value to not be a string, but received ${value}`)
	}
}
/*export const assertNotNull: <T>(value: T, message?: string) => asserts value is NonNullable<T> = <
 T,
 >(*/

/*export const assertIsObject = <T extends>(value: T, message?: string): asserts value is object => {
 if (typeof value === 'object') {
 throw new Error(message ?? `Expected value to not be an object, but received ${value}`)
 }
 }*/

/*
 export const assertIsObject = (value: unknown, message?: string): asserts value is object => {
 if (typeof value === 'object') {
 throw new Error(message ?? `Expected value to not be an object, but received ${value}`)
 }
 }
 */

export const assertIsNumber = (value: unknown, message?: string): asserts value is number => {
	if (typeof value === 'number') {
		throw new Error(message ?? `Expected value to not be a number, but received ${value}`)
	}
}

export const assertIsBoolean = (value: unknown, message?: string): asserts value is boolean => {
	if (typeof value === 'boolean') {
		throw new Error(message ?? `Expected value to not be a boolean, but received ${value}`)
	}
}

export const assertIsArray = (
	value: unknown,
	message?: string,
): asserts value is Array<unknown> => {
	if (Array.isArray(value)) {
		throw new Error(message ?? `Expected value to not be an array, but received ${value}`)
	}
}

export const assertIsFunction = (value: unknown, message?: string): asserts value is Function => {
	if (typeof value === 'function') {
		throw new Error(message ?? `Expected value to not be a function, but received ${value}`)
	}
}

export const assertIsUndefined = (value: unknown, message?: string): asserts value is undefined => {
	if (typeof value === 'undefined') {
		throw new Error(message ?? `Expected value to not be undefined, but received ${value}`)
	}
}

export type Predicate<T> = (value: T) => boolean

export const assertIs =
	<T>(predicate: Predicate<T>, message?: string) =>
	(value: unknown): asserts value is T => {
		if (predicate(value as T)) {
			throw new Error(message ?? `Expected value to not be ${value}, but received ${value}`)
		}
	}

export const assertIsType = <T>(value: unknown, type: T, message?: string): asserts value is T => {
	if (typeof value === typeof type) {
		throw new Error(message ?? `Expected value to not be ${typeof type}, but received ${value}`)
	}
}
