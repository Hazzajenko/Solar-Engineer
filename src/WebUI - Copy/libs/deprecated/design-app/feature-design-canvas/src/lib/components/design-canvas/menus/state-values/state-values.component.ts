import { AppStateMatchesModel, CanvasRenderService, MachineService } from '../../../../services'
import { GraphicsSettingsMachineService } from '../canvas-graphics-menu'
import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common'
import { AfterViewInit, Component, ElementRef, inject, NgZone, Renderer2 } from '@angular/core'
import { EVENT_TYPE } from '@shared/data-access/models'
import { CastPipe } from '@shared/pipes'
import { map, tap } from 'rxjs'

/*
 type SelectedStateEdit = {
 [key in keyof AppStateMatches]: AppStateMatches[key]
 }*/

type SelectedStateEdit = {
	SelectedState: 'EntitySelected' | 'MultipleEntitiesSelected' | 'NoneSelected' | 'StringSelected'
}

/*const SelectedStateEdit = {
 SelectedState: 'ViewState'
 }*/
@Component({
	selector: 'app-state-values',
	templateUrl: './state-values.component.html',
	standalone: true,
	imports: [NgForOf, NgIf, AsyncPipe, JsonPipe, CastPipe],
})
export class StateValuesComponent implements AfterViewInit {
	private _render = inject(CanvasRenderService)
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _elementRef = inject(ElementRef)
	private _graphicsMachine = inject(GraphicsSettingsMachineService)
	private _appMachine = inject(MachineService)

	appState$ = this._appMachine.subscribe().pipe(
		tap((state) => {
			console.log('appState$', state)
		}),
		map((state) => state as AppStateMatchesModel),
	)
	graphicsState$ = this._graphicsMachine.subscribe()

	// graphicsState$ = this._graphicsMachine.subscribe()

	public ngAfterViewInit() {
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(
				this._elementRef.nativeElement,
				EVENT_TYPE.POINTER_ENTER,
				(event: PointerEvent) => {
					console.log(EVENT_TYPE.POINTER_ENTER, event)
					this._render.drawCanvas()
				},
			)
		})
	}
}
