import { Renderer2 } from '@angular/core'

export const initBackdropEvent = (element: HTMLElement, callback: () => void) => {
	const killClickListener = () => {
		document.removeEventListener('click', clickListener)
	}

	const clickListener = (event: MouseEvent) => {
		if (element && !element.contains(event.target as Node)) {
			callback()
			killClickListener()
		}
	}

	document.addEventListener('click', clickListener)

	return killClickListener
}

export const initBackdropEventWithRenderer = (
	renderer: Renderer2,
	element: HTMLElement,
	callback: () => void,
) => {
	const clickListener = (event: MouseEvent) => {
		if (element && !element.contains(event.target as Node)) {
			callback()
			killClickListener()
		}
	}

	const killClickListener = renderer.listen(window, 'click', clickListener)

	return killClickListener
}
