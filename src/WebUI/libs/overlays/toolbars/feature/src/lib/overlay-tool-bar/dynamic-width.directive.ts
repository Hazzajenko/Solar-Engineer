import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core'

@Directive({ selector: '[appDynamicWidth]', standalone: true })
export class DynamicWidthDirective {
	private _element = inject(ElementRef<Element>).nativeElement
	private _renderer = inject(Renderer2)
	left = 0
	right = 0
	rectOne: DOMRectReadOnly | undefined
	rectTwo: DOMRectReadOnly | undefined
	rectMap = new Map<Element, DOMRectReadOnly>()
	rects = [] as DOMRectReadOnly[]
	currentWidth = 0

	// initialTop!: number
	// initialHeight!: number

	@Input() set leftAndRightElements(data: { left: Element; right: Element }) {
		if (!data) {
			console.error('no data')
			return
		}
		console.log('leftAndRightElements', data)
		const { left, right } = data
		const leftRect = left.getBoundingClientRect()
		const rightRect = right.getBoundingClientRect()
		const leftAndRightWidth = rightRect.right - leftRect.left
		console.log('leftAndRightWidth', leftAndRightWidth)
		this._renderer.setStyle(this._element, 'width', `${leftAndRightWidth}px`)
		this.currentWidth = leftAndRightWidth

		const sortByLowestLeft = (a: DOMRectReadOnly, b: DOMRectReadOnly) => {
			if (a.left < b.left) {
				return -1
			}
			if (a.left > b.left) {
				return 1
			}
			return 0
		}

		const observer = new ResizeObserver((entries) => {
			console.log('entries', entries)
			this.rects = entries.map((entry) => entry.contentRect)
			console.log('rects', this.rects)
			this.rects.sort(sortByLowestLeft)
			const width = this.rects[1].right - this.rects[0].left
			console.log('width', width)
			console.log('currentWidth', this.currentWidth)
			this.currentWidth += width
			this._renderer.setStyle(this._element, 'width', `${this.currentWidth}px`)

			/*			entries.forEach((entry) => {
			 // entry.
			 console.log('width', entry.contentRect.width)
			 console.log('height', entry.contentRect.height)
			 })*/
		})

		observer.observe(left)
		observer.observe(right)
	}

	/*	@Input() set currentContextMenuDiv(
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
	 }*/
}
