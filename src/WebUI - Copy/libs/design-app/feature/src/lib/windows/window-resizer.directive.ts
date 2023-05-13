import { Directive, ElementRef, inject, Input, NgZone, OnInit, Renderer2 } from '@angular/core'
import { EVENT_TYPE, Point } from '@shared/data-access/models'

export const WINDOW_RESIZER = {
	TOP_LEFT: 'nwse-resize',
	TOP_RIGHT: 'nesw-resize',
	BOTTOM_LEFT: 'nesw-resize',
	BOTTOM_RIGHT: 'nwse-resize',
} as const

export type WindowResizer = (typeof WINDOW_RESIZER)[keyof typeof WINDOW_RESIZER]

@Directive({ selector: '[appWindowResizer]', standalone: true })
export class WindowResizerDirective implements OnInit {
	private _ngZone = inject(NgZone)
	private _elementRef = inject(ElementRef)
	private _renderer = inject(Renderer2)

	startPoint!: Point
	startCorner!: Point

	@Input() windowResizer!: WindowResizer

	ngOnInit(): void {
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(this._elementRef.nativeElement, EVENT_TYPE.POINTER_ENTER, () => {
				console.log('pointerenter')
				this._renderer.setStyle(this._elementRef.nativeElement, 'cursor', this.windowResizer)
			})
			this._renderer.listen(
				this._elementRef.nativeElement,
				EVENT_TYPE.POINTER_DOWN,
				(event: PointerEvent) => {
					console.log('POINTER_DOWN')
					const rect = this._elementRef.nativeElement.getBoundingClientRect()
					this.startCorner = { x: rect.x, y: rect.y }
					this.startPoint = { x: event.clientX, y: event.clientY }
					const mouseMove = this._renderer.listen(
						this._elementRef.nativeElement,
						EVENT_TYPE.POINTER_MOVE,
						(event: PointerEvent) => {
							console.log('POINTER_MOVE')
							const x = this.startCorner.x + (event.clientX - this.startPoint.x)
							const y = this.startCorner.y + (event.clientY - this.startPoint.y)
							this._renderer.setStyle(this._elementRef.nativeElement, 'top', `${y}px`)
							this._renderer.setStyle(this._elementRef.nativeElement, 'left', `${x}px`)
							this._renderer.setStyle(
								this._elementRef.nativeElement,
								'width',
								`${event.clientX - this.startPoint.x}px`,
							)
							this._renderer.setStyle(
								this._elementRef.nativeElement,
								'height',
								`${event.clientY - this.startPoint.y}px`,
							)
						},
					)
					const pointerUp = this._renderer.listen(
						this._elementRef.nativeElement,
						EVENT_TYPE.POINTER_UP,
						() => {
							console.log('POINTER_MOVE')
							mouseMove()
							pointerUp()
							// this._renderer.listen()
						},
					)
				},
			)
		})
	}
}