import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core'
import { MouseOverRenderDirective } from '@canvas/rendering/data-access'
import { ContextMenuInput } from '@overlays/ui-store/data-access'

export const CONTEXT_MENU_WIDTH = 224

@Directive({
	selector: '[appContextMenu]',
	standalone: true,
	hostDirectives: [MouseOverRenderDirective],
})
export class ContextMenuDirective {
	private _element = inject(ElementRef).nativeElement
	private _renderer = inject(Renderer2)

	@Input({ required: true }) set contextMenuInput(contextMenuInput: ContextMenuInput) {
		if (!contextMenuInput) {
			console.error('no contextMenuInput')
			return
		}
		const { x, y } = contextMenuInput.location
		const { innerWidth, innerHeight } = window
		if (contextMenuInput.location.x + CONTEXT_MENU_WIDTH > innerWidth) {
			this._renderer.setStyle(this._element, 'left', `${innerWidth - CONTEXT_MENU_WIDTH - 50}px`)
			this._renderer.setStyle(this._element, 'top', `${y}px`)
			this._renderer.setProperty(this._element, 'id', contextMenuInput.component)
			return
		}
		// const menuRect = this._element.getBoundingClientRect()
		// const menuWidth = menuRect.width
		// const menuHeight = menuRect.height
		// const menuLeft = menuRect.left
		// const menuTop = menuRect.top
		// const menuRight = menuRect.right

		// console.log('menuRect', menuRect)

		// window.

		this._renderer.setStyle(this._element, 'top', `${y}px`)
		this._renderer.setStyle(this._element, 'left', `${x}px`)

		this._renderer.setProperty(this._element, 'id', contextMenuInput.component)
	}

	@Input() set leftAndRight(leftAndRight: { left: number; right: number }) {
		if (!leftAndRight) {
			console.error('no leftAndRight')
			return
		}
		const { left, right } = leftAndRight
		console.log('leftAndRight', leftAndRight)
		this._renderer.setStyle(this._element, 'left', `${left}px`)
	}

	@Input() set trackLeftOfDiv(data: { divId: string }) {
		if (!data) {
			console.error('no trackLeftOfDiv')
			return
		}
		console.log('trackLeftOfDiv', data)
		const { divId } = data
		const div = document.getElementById(divId)
		if (!div) {
			console.error('no div')
			return
		}
		const rect = div.getBoundingClientRect()
		const left = rect.left
		this._renderer.setStyle(this._element, 'left', `${left}px`)

		this._renderer.listen(window, 'resize', () => {
			const rect = div.getBoundingClientRect()
			const left = rect.left
			this._renderer.setStyle(this._element, 'left', `${left}px`)
		})
	}
}
