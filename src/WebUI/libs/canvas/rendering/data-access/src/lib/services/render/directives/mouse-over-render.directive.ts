import { Directive, ElementRef, inject, NgZone, OnInit, Renderer2 } from '@angular/core'
import { EVENT_TYPE } from '@shared/data-access/models'
import { RenderService } from '../render.service'

@Directive({
	selector: '[appMouseOverRender]',
	standalone: true,
})
export class MouseOverRenderDirective implements OnInit {
	private _element = inject(ElementRef).nativeElement
	private _ngZone = inject(NgZone)
	private _renderer = inject(Renderer2)
	private _render = inject(RenderService)

	ngOnInit(): void {
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(this._element, EVENT_TYPE.POINTER_ENTER, () => {
				this._render.renderCanvasApp()
			})
		})
	}
}
