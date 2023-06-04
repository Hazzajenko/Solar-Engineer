export type CustomIdType<T extends string> = string & {
	readonly _type: T
}
