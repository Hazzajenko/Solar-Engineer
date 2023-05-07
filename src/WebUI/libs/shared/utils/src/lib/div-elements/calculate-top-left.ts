export const calculateTopLeft = (
	element: HTMLElement,
): {
	top: string
	left: string
} => {
	const { width, height } = element.getBoundingClientRect()
	const top = (window.innerHeight - height) / 2 + 'px'
	const left = (window.innerWidth - width) / 2 + 'px'
	return {
		top,
		left,
	}
}

export const calculateTopLeftAsNumbers = (
	element: HTMLElement,
): {
	top: number
	left: number
} => {
	const { width, height } = element.getBoundingClientRect()
	const top = (window.innerHeight - height) / 2
	const left = (window.innerWidth - width) / 2
	return {
		top,
		left,
	}
}
