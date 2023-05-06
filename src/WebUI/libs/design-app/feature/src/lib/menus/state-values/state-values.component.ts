import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common'
import { AfterViewInit, Component, ElementRef, inject, NgZone, Renderer2 } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { initialSelectedState, RenderService, SelectedStoreService } from '@design-app/data-access'
import { EVENT_TYPE } from '@shared/data-access/models'
import { CastPipe } from '@shared/pipes'


@Component({
	selector: 'app-state-values',
	templateUrl: './state-values.component.html',
	standalone: true,
	imports: [NgForOf, NgIf, AsyncPipe, JsonPipe, CastPipe],
})
export class StateValuesComponent implements AfterViewInit {
	private _render = inject(RenderService)
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _elementRef = inject(ElementRef)
	private _selectedStore = inject(SelectedStoreService)

	selectedState = toSignal(this._selectedStore.state$, { initialValue: initialSelectedState })

	ngAfterViewInit() {
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(this._elementRef.nativeElement, EVENT_TYPE.POINTER_ENTER, () => {
				this._render.renderCanvasApp()
			})
		})
	}
}