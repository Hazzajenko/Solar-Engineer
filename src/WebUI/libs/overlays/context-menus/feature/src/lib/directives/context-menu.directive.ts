import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core'
import { Point } from '@shared/data-access/models'
import { MouseOverRenderDirective } from '@canvas/rendering/data-access'

@Directive({
	selector: '[appContextMenu]',
	standalone: true,
	hostDirectives: [MouseOverRenderDirective],
})
export class ContextMenuDirective {
	private _element = inject(ElementRef).nativeElement
	private _renderer = inject(Renderer2)

	@Input({ required: true }) set location(location: Point) {
		if (!location) {
			console.error('no location')
			return
		}
		const { x, y } = location
		this._renderer.setStyle(this._element, 'top', `${y}px`)
		this._renderer.setStyle(this._element, 'left', `${x}px`)
	}
}
