import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core'
import { MouseOverRenderDirective } from '@canvas/rendering/data-access'

@Directive({
	selector: '[appChildContextMenu]',
	standalone: true,
	hostDirectives: [MouseOverRenderDirective],
})
export class ChildContextMenuDirective {
	private _renderer = inject(Renderer2)
	private _contextMenuItemElement = inject(ElementRef).nativeElement
	private _contextMenuItemMouseEnterDisposeFn!: ReturnType<typeof Renderer2.prototype.listen>
	private _contextMenuItemMouseLeaveDisposeFn!: ReturnType<typeof Renderer2.prototype.listen>
	private _childContextMenuDisposeFn?: ReturnType<typeof Renderer2.prototype.listen>

	@Input({ required: true }) set childContextMenuElement(childContextMenu: HTMLElement) {
		if (!childContextMenu) {
			console.error('no childContextMenu')
			return
		}

		this._contextMenuItemMouseEnterDisposeFn = this._renderer.listen(
			this._contextMenuItemElement,
			'mouseenter',
			() => {
				this._renderer.setStyle(childContextMenu, 'display', 'block')
			},
		)

		this._contextMenuItemMouseLeaveDisposeFn = this._renderer.listen(
			this._contextMenuItemElement,
			'mouseleave',
			(event: MouseEvent) => {
				console.log('event', event)
				console.log('event.relatedTarget', event.relatedTarget)
				const rect = this._contextMenuItemElement.getBoundingClientRect()
				const mouseX = event.clientX
				const mouseY = event.clientY
				const isMouseGoingToChildMenu =
					mouseX > rect.left && mouseY > rect.top && mouseY < rect.bottom

				if (isMouseGoingToChildMenu) {
					return
				}

				this._renderer.setStyle(childContextMenu, 'display', 'none')
			},
		)

		this._childContextMenuDisposeFn = this._renderer.listen(
			childContextMenu,
			'mouseleave',
			(event: MouseEvent) => {
				console.log('event', event)
				console.log('event.relatedTarget', event.relatedTarget)
				const rect = this._contextMenuItemElement.getBoundingClientRect()
				const childRect = childContextMenu.getBoundingClientRect()

				const biggerTop = childRect.top > rect.top ? childRect.top : rect.top
				const smallerBottom = childRect.bottom < rect.bottom ? childRect.bottom : rect.bottom

				const mouseX = event.clientX
				const mouseY = event.clientY
				const isMouseGoingToMenuItem =
					mouseX < childRect.right && mouseY > biggerTop && mouseY < smallerBottom
				/*				const isMouseGoingToMenuItem =
			 mouseX > rect.left && mouseY > rect.top && mouseY < rect.bottom*/

				if (isMouseGoingToMenuItem) {
					return
				}

				this._renderer.setStyle(childContextMenu, 'display', 'none')
			},
		)
	}

	private dispose() {
		this._contextMenuItemMouseEnterDisposeFn()
		this._contextMenuItemMouseLeaveDisposeFn()

		if (this._childContextMenuDisposeFn) {
			this._childContextMenuDisposeFn()
		}

		this._renderer.destroy()
	}
}
