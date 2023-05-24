export type KeysOf<T> = {
	[K in keyof T]: {
		key: K
	}
}[keyof T]
