import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core'

@Directive({ selector: '[appMobileBottomToolbar]', standalone: true })
export class MobileBottomToolbarDirective {
	private _element = inject(ElementRef<HTMLDivElement>).nativeElement
	private _renderer = inject(Renderer2)

	initialTop!: number
	initialHeight!: number

	@Input() set currentContextMenuDiv(
		currentContextMenuDiv: ElementRef<HTMLDivElement> | undefined,
	) {
		console.log(currentContextMenuDiv)
		if (!currentContextMenuDiv) {
			console.log('currentContextMenuDiv is undefined', this.initialHeight)
			// console.log('currentContextMenuDiv is undefined')
			this._renderer.setStyle(this._element, 'height', `${this.initialHeight}px`)
			return
		}
		const currentContextMenuDivHeight =
			currentContextMenuDiv.nativeElement.getBoundingClientRect().height
		const elementRectHeight = this._element.getBoundingClientRect().height
		const spaceY = 10
		// const spaceY = 5
		const newDivHeight = elementRectHeight + currentContextMenuDivHeight + spaceY
		console.log('currentContextMenuDiv', currentContextMenuDiv)
		this.initialHeight = this._element.getBoundingClientRect().height
		console.log(this.initialHeight)
		this._renderer.setStyle(this._element, 'height', `${newDivHeight}px`)
	}

	/*ngOnInit(): void {
	 // this.initialTop = this._element.getBoundingClientRect().top
	 const initialHeight = this._element.getBoundingClientRect().height
	 const initialHeight2 = outerHeight(this._element)
	 const initialHeight3 = getElmHeight(this._element)
	 console.log(initialHeight, initialHeight2, initialHeight3)
	 // const initialHeight = this._element.getBoundingClientRect().height
	 const element = this._element.children.item(0) as HTMLDivElement
	 console.log(element)
	 const initialElements = Array.from(this._element.children) as HTMLDivElement[]
	 console.log(initialElements)
	 const elementIds = initialElements.map((x) => x.id)
	 console.log(elementIds)
	 // const initialElements = Array.from(this._element.childNodes)

	 const observer = new MutationObserver((mutations) => {
	 console.log(mutations)
	 mutations.forEach((mutation) => {
	 if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
	 const component = mutation.addedNodes[0] as HTMLDivElement
	 if (component instanceof SVGElement) {
	 console.log('svg')
	 return
	 }
	 if (!(component instanceof HTMLDivElement)) {
	 console.log('HTMLDivElement')
	 return
	 }

	 if (component.id === element.id) return
	 console.log('component', component)
	 const componentHeight = component.getBoundingClientRect().height
	 const elementRectHeight = this._element.getBoundingClientRect().height
	 const spaceY = 10
	 // const spaceY = 5
	 const newDivHeight = elementRectHeight + componentHeight + spaceY
	 console.log('component', component)
	 this.initialHeight = this._element.getBoundingClientRect().height
	 console.log(this.initialHeight)
	 this._renderer.setStyle(this._element, 'height', `${newDivHeight}px`)
	 }
	 if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
	 this._renderer.setStyle(this._element, 'height', `${this.initialHeight}px`)
	 }
	 })
	 })

	 const config = { childList: true, subtree: true }
	 observer.observe(this._element, config)
	 }*/
}

/**
 * Returns the element height including margins
 * @param element - element
 * @returns {number}
 */
function outerHeight(element: HTMLDivElement) {
	const height = element.offsetHeight,
		style = window.getComputedStyle(element)

	return (
		['top', 'bottom']
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			.map((side) => parseInt(style[`margin-${side}`]))
			.reduce((total, side) => total + side, height)
	)
}

function getElmHeight(node: HTMLDivElement) {
	const list = [
		'margin-top',
		'margin-bottom',
		'border-top',
		'border-bottom',
		'padding-top',
		'padding-bottom',
		'height',
	]

	const style = window.getComputedStyle(node)
	return list.map((k) => parseInt(style.getPropertyValue(k), 10)).reduce((prev, cur) => prev + cur)
}
