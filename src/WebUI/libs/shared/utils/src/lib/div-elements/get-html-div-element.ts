export const getHtmlDivElementById = (id: string): HTMLDivElement => {
	const element = document.getElementById(id)
	if (!element) {
		throw new Error('No element found')
	}
	return element as HTMLDivElement
}

export const getElementByIdWithRetry = (id: string, retryCount = 0): HTMLElement => {
	const element = document.getElementById(id)
	if (!element) {
		if (retryCount > 10) {
			throw new Error('No element found')
		}
		return getElementByIdWithRetry(id, retryCount + 1)
	}
	return element
}

/*
 export const getElementByIdWithRetryDelay = (id: string, retryCount = 0): HTMLElement => {
 let element = document.getElementById(id)
 let count = 0
 while (!element) {
 if (count > 10) {
 throw new Error('No element found')
 }
 delay(() => {
 element = document.getElementById(id)
 }, 100)
 setTimeout(() => {
 element = document.getElementById(id)
 })
 element = document.getElementById(id)
 count++
 }

 return element
 }
 */
