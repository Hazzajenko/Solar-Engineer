export const createCallback = <T extends (...args: any[]) => any>(callback: T): Callback<T> => {
	return (...args: Parameters<T>): ReturnType<T> => {
		return callback(...args)
	}
}

type CreateCallback = ReturnType<typeof createCallback>

export const createManyCallbacks = <T extends (...args: any[]) => any>(callbacks: T[]) => {
	return callbacks.map((callback) => createCallback(callback))
	/*	return (...args: Parameters<T>): ReturnType<T>[] => {
	 return callbacks.map((callback) => callback(...args))
	 }*/
}

type CreateManyCallbacks = ReturnType<typeof createManyCallbacks>

// export type ReturnType<typeof createCallback>
export type Callback<T extends (...args: unknown[]) => unknown> = (
	...args: Parameters<T>
) => ReturnType<T>

export const isCallback = <T extends (...args: unknown[]) => unknown>(
	callback: unknown,
): callback is Callback<T> => {
	return typeof callback === 'function'
}

export const checkTypeOfCallback = <T extends (...args: unknown[]) => unknown>(
	callback: unknown,
): callback is Callback<T> => {
	return typeof callback === 'function'
}

export const doesCallbackHaveParameterOfType = <
	T extends (...args: unknown[]) => unknown,
	X extends Parameters<T>[number],
>(
	callback: Callback<T>,
	parameter: X,
): boolean => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return callback.toString().includes(parameter.toString())
	// return callback.toString().includes(parameter.toString())
}

/*
 createCallback((a: number, b: number) => a + b)(1, 2)

 export const createCallbackWithProps = <T extends (...args: any[]) => any>(
 callback: T,
 props: any,
 ) => {
 return (...args: Parameters<T>): ReturnType<T> => {
 return callback(props, ...args)
 }
 }
 */
