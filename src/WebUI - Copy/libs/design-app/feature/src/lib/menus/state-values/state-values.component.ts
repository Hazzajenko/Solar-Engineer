import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common'
import { AfterViewInit, Component, ElementRef, inject, NgZone, Renderer2 } from '@angular/core'
import { AppStoreService, RenderService } from '@design-app/data-access'
import { EVENT_TYPE } from '@shared/data-access/models'
import { CastPipe } from '@shared/pipes'
import { combineLatest, map, tap } from 'rxjs'


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
	private _app = inject(AppStoreService)

	appState$ = this._app.subscribeApp$().pipe(
		tap((state) => {
			console.log('appState$', state)
		}),
	)
	selectedState$ = this._app.subscribeSelected$().pipe(
		tap((state) => {
			console.log('selectedState$', state)
		}),
	)
	graphicsState$ = this._app.subscribeGraphics$().pipe(
		tap((state) => {
			console.log('graphicsState$', state)
		}),
	)

	vm$ = combineLatest([this.appState$, this.selectedState$, this.graphicsState$]).pipe(
		map(([app, selected, graphics]) => {
			return {
				app,
				selected,
				graphics,
			}
		}),
	)

	public ngAfterViewInit() {
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(this._elementRef.nativeElement, EVENT_TYPE.POINTER_ENTER, () => {
				this._render.renderCanvasApp()
			})
		})
	}
}