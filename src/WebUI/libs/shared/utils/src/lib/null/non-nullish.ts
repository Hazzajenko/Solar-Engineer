export const isNullish = <T>(argument: T | undefined | null): argument is undefined | null =>
	argument === null || argument === undefined

export const nonNullish = <T>(argument: T | undefined | null): argument is NonNullable<T> =>
	!isNullish(argument)

export class NullError extends Error {}

export const getFunctionCaller = () =>
	new Error().stack?.split('\n')[1].trim().split(' ')[1] ?? 'unknown'

export const assertNotNull: <T>(value: T, message?: string) => asserts value is NonNullable<T> = <
	T,
>(
	value: T,
	message?: string,
): void => {
	if (isNullish(value)) {
		console.error(message)
		console.error(getFunctionCaller())
		throw new NullError(message)
	}
}
