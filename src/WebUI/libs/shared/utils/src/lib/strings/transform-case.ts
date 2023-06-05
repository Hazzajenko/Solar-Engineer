export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
	? `${Lowercase<T>}${Capitalize<SnakeToCamelCase<U>>}`
	: S

export type SnakeToCamelCaseNested<T> = T extends object
	? {
			[K in keyof T as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<T[K]>
	  }
	: T

export type CamelCaseToPascalCaseNested<T> = T extends object
	? {
			[K in keyof T as Capitalize<K & string>]: T[K] extends string
				? string
				: T[K] extends number
				? number
				: CamelCaseToPascalCaseNested<T[K]>
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
/*

 type dfsfdsf = {
 test: string
 }
 type wot =  Capitalize<dfsfdsf['test']>
 const asdsa: wot = 'Test'
 export function convertPascalCaseToCamelCaseNested<T>(object: T): PascalCaseToCamelCaseNested<T> {

 const convertedObject: Record<Capitalize<keyof T & string>, T[keyof T]> = {} as any

 for (const key in object) {
 const newKey = key.charAt(0).toUpperCase() + key.slice(1)

 if (typeof object[key] === 'object' && object[key] !== null && !Array.isArray(object[key])) {
 convertedObject[newKey] = convertPascalCaseToCamelCaseNested(object[key])
 } else {
 convertedObject[newKey] = object[key]
 }
 }

 return convertedObject
 }

 export function convertCamelCaseToPascalCaseNested<T>(object: T): CamelCaseToPascalCaseNested<T> {
 const convertedObject: any = {}

 for (const key in object) {
 const newKey = key.charAt(0).toLowerCase() + key.slice(1)

 if (typeof object[key] === 'object' && object[key] !== null && !Array.isArray(object[key])) {
 convertedObject[newKey] = convertCamelCaseToPascalCaseNested(object[key])
 } else {
 convertedObject[newKey] = object[key]
 }
 }

 return convertedObject
 }
 */
