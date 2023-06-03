/**
 * @function delay Delays the execution of an action.
 * @param {number} time The time to wait in seconds.
 * @returns {Promise<void>}
 */
export function delay(time: number): Promise<void> {
	return new Promise<void>((resolve) => setTimeout(resolve, time * 1000))
}
