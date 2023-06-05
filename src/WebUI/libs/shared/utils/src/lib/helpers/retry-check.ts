const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function retryCheck(
	func: () => Promise<boolean>,
	retries: number,
	delayMs: number,
): Promise<boolean> {
	for (let i = 0; i < retries; i++) {
		const result = await func()
		if (result) {
			return true
		}
		await delay(delayMs)
	}
	return false
}
