export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
	? `${Lowercase<T>}${Capitalize<SnakeToCamelCase<U>>}`
	: S

export type SnakeToCamelCaseNested<T> = T extends object
	? {
			[K in keyof T as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<T[K]>
	  }
	: T

export type PascalCaseToCamelCaseNested<T> = T extends object
	? {
			[K in keyof T as Uncapitalize<K & string>]: T[K] extends string
				? string
				: T[K] extends number
				? number
				: PascalCaseToCamelCaseNested<T[K]>
	  }
	: T

export function pascalCaseToCamelCaseNested<T extends Record<string, any>>(
	objectToTransform: T,
): PascalCaseToCamelCaseNested<T> {
	return Object.keys(objectToTransform).reduce((acc, key) => {
		const newKey = `${key[0].toLowerCase()}${key.slice(1)}` as keyof PascalCaseToCamelCaseNested<T>
		if (
			typeof objectToTransform[key] === 'object' &&
			objectToTransform[key] !== null &&
			!Array.isArray(objectToTransform[key])
		) {
			if (objectToTransform[key] instanceof Date) {
				acc[newKey] = (objectToTransform[key] as Date).toISOString() as any
				return acc
			}
			acc[newKey] = pascalCaseToCamelCaseNested(objectToTransform[key])
			return acc
		}
		if (Array.isArray(objectToTransform[key])) {
			acc[newKey] = objectToTransform[key].map((item: symbol | object) => {
				if (typeof item === 'object' && item !== null) {
					return pascalCaseToCamelCaseNested(item)
				}
				return item
			})
			return acc
		}

		acc[newKey] = objectToTransform[key]
		return acc
	}, {} as PascalCaseToCamelCaseNested<T>)
}

export type CamelCaseToPascalCaseNested<T> = T extends object
	? {
			[K in keyof T as Capitalize<K & string>]: T[K] extends string
				? string
				: T[K] extends number
				? number
				: CamelCaseToPascalCaseNested<T[K]>
	  }
	: T

export function camelCaseToPascaleCaseNested<T extends Record<string, any>>(
	objectToTransform: T,
): CamelCaseToPascalCaseNested<T> {
	return Object.keys(objectToTransform).reduce((acc, key) => {
		const newKey = `${key[0].toUpperCase()}${key.slice(1)}` as keyof CamelCaseToPascalCaseNested<T>
		if (
			typeof objectToTransform[key] === 'object' &&
			objectToTransform[key] !== null &&
			!Array.isArray(objectToTransform[key])
		) {
			// if (objectToTransform[key] instanceof Date) {
			// 	acc[newKey] = (objectToTransform[key] as Date).toISOString() as any
			// 	return acc
			// }
			acc[newKey] = camelCaseToPascaleCaseNested(objectToTransform[key])
			return acc
		}
		if (Array.isArray(objectToTransform[key])) {
			acc[newKey] = objectToTransform[key].map((item: symbol | object) => {
				if (typeof item === 'object' && item !== null) {
					return camelCaseToPascaleCaseNested(item)
				}
				return item
			})
			return acc
		}
		acc[newKey] = objectToTransform[key]
		return acc
	}, {} as CamelCaseToPascalCaseNested<T>)
}
