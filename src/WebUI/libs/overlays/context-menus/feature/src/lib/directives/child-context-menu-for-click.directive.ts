import { Directive, ElementRef, inject, Input, OnDestroy, Renderer2 } from '@angular/core'
import { MouseOverRenderDirective } from '@canvas/rendering/data-access'
import {
	assertNotNull,
	getElementByIdWithRetry,
	initBackdropEventWithRenderer,
} from '@shared/utils'

@Directive({
	selector: '[appChildContextMenuForClick]',
	standalone: true,
	hostDirectives: [MouseOverRenderDirective],
})
export class ChildContextMenuForClickDirective implements OnDestroy {
	private _renderer = inject(Renderer2)
	private _contextMenuItemElement = inject(ElementRef).nativeElement
	private _disposeFn!: ReturnType<typeof Renderer2.prototype.listen>
	private _childContextMenuDisposeFn?: ReturnType<typeof Renderer2.prototype.listen>
	private killClickListener?: () => void

	@Input({ required: true }) set childContextMenuElement(childContextMenu: HTMLElement) {
		if (!childContextMenu) {
			console.error('no childContextMenu')
			return
		}

		this._disposeFn = this._renderer.listen(this._contextMenuItemElement, 'click', () => {
			this._renderer.setStyle(childContextMenu, 'display', 'block')
			const timeOut = setTimeout(() => {
				const elementId = childContextMenu.getAttribute('id')
				assertNotNull(elementId, 'elementId')
				const div = getElementByIdWithRetry(elementId)
				this.killClickListener = initBackdropEventWithRenderer(this._renderer, div, () => {
					this._renderer.setStyle(childContextMenu, 'display', 'none')
					clearTimeout(timeOut)
				})
			}, 100)
		})
	}

	ngOnDestroy() {
		this._disposeFn()

		if (this._childContextMenuDisposeFn) {
			this._childContextMenuDisposeFn()
		}

		this._renderer.destroy()
	}
}
