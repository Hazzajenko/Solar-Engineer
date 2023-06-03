import { delay } from './delay'

/**
 * @async
 * @function tryNTimes<T> Tries to resolve a {@link Promise<T>} N times, with a delay between each attempt.
 * @param {Object} options Options for the attempts.
 * @param {() => Promise<T>} options.toTry The {@link Promise<T>} to try to resolve.
 * @param {number} [options.times=5] The maximum number of attempts (must be greater than 0).
 * @param {number} [options.interval=1] The interval of time between each attempt in seconds.
 * @returns {Promise<T>} The resolution of the {@link Promise<T>}.
 */
export async function tryNTimes<T>({
	toTry,
	times = 5,
	interval = 1,
}: {
	toTry: () => Promise<T>
	times?: number
	interval?: number
}): Promise<T> {
	if (times < 1)
		throw new Error(`Bad argument: 'times' must be greater than 0, but ${times} was received.`)
	let attemptCount: number
	for (attemptCount = 1; attemptCount <= times; attemptCount++) {
		let error = false
		const result = await toTry().catch((reason) => {
			error = true
			return reason
		})

		if (error) {
			if (attemptCount < times) {
				await delay(interval)
			} else {
				return Promise.reject(result)
			}
		} else return result
	}
	throw new Error(`The function was not able to resolve the promise after ${times} attempts.`)
}
