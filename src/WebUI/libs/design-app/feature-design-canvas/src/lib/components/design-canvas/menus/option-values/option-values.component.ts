import { AfterViewInit, Component, ElementRef, inject, NgZone, Renderer2 } from '@angular/core'
import { AsyncPipe, NgForOf, NgIf } from '@angular/common'
import { CanvasRenderService, GraphicsSettingsMachineService } from '@design-app/feature-design-canvas'
import { EVENT_TYPE } from '@shared/data-access/models'

export type GraphicsValue = {
	label: string
	enabled: boolean
}

/*const arr =
 [
 {
 label: 'Nearby Axis Lines', action: this.toggleNearbyAxisLines.bind(this), selected: this._state.menu.nearbyAxisLines,
 }
 ]*/
@Component({
	selector: 'app-option-values', templateUrl: './option-values.component.html', standalone: true, imports: [
		NgForOf, NgIf, AsyncPipe,
	],
})
export class OptionValuesComponent
	implements AfterViewInit {
	private _render = inject(CanvasRenderService)
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _elementRef = inject(ElementRef)
	private _graphicsMachine = inject(GraphicsSettingsMachineService)
	graphicsState$ = this._graphicsMachine.subscribe()

	// keys = KeyMapKeys
	/*	values = [
	 {
	 label: 'Create Preview', action: this.toggleCreatePreview.bind(this), selected: this._state.menu.createPreview,
	 }
	 ]*/

	public ngAfterViewInit() {
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(this._elementRef.nativeElement, EVENT_TYPE.POINTER_ENTER, (event: PointerEvent) => {
				console.log(EVENT_TYPE.POINTER_ENTER, event)
				this._render.drawCanvas()
			})
		})
	}
}