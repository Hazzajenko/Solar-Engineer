import { KeyMapKeys } from './key-map.keys'
import { NgForOf } from '@angular/common'
import { AfterViewInit, Component, ElementRef, inject, NgZone, Renderer2 } from '@angular/core'
import { RenderService } from '@design-app/data-access'
import { EVENT_TYPE } from '@shared/data-access/models'


@Component({
	selector: 'app-key-map-component',
	templateUrl: './key-map.component.html',
	standalone: true,
	imports: [NgForOf],
})
export class KeyMapComponent implements AfterViewInit {
	private _render = inject(RenderService)
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _elementRef = inject(ElementRef)

	keys = KeyMapKeys

	public ngAfterViewInit() {
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(this._elementRef.nativeElement, EVENT_TYPE.POINTER_ENTER, () => {
				this._render.renderCanvasApp()
			})
		})
	}
}