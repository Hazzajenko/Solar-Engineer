import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, NgZone, Renderer2 } from '@angular/core'
import { AsyncPipe, NgForOf, NgIf } from '@angular/common'
import { CanvasClientStateService, CanvasRenderService } from '../../../../services'
import { EVENT_TYPE } from '@shared/data-access/models'
import { CREATE_PREVIEW_EVENT, CREATE_PREVIEW_STATE, GraphicsSettingsMachineService, NEARBY_GRAPHICS_EVENT, NEARBY_GRAPHICS_STATE, NEARBY_GRAPHICS_STATE_MODE, NearbyGraphicsStateMode } from './+xstate'
import { ReactiveFormsModule } from '@angular/forms'
import { LetModule } from '@ngrx/component'
import { IsNearbyLinesEnabledPipe } from './pipes'
import { NearbyGraphicsMenuOptions } from './nearby-graphics-menu-options'

@Component({
	selector:       'app-canvas-graphics-menu', standalone: true, imports: [
		NgForOf, NgIf, AsyncPipe, ReactiveFormsModule, LetModule, IsNearbyLinesEnabledPipe,
	], templateUrl: './canvas-graphics-menu.component.html', styles: [], changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasGraphicsMenuComponent

	implements AfterViewInit {

	graphicsMachine = inject(GraphicsSettingsMachineService)
	// snapshot = this.graphicsMachine.getSnapshot()

	graphicsState$ = this.graphicsMachine.subscribe()

	// protected readonly SelectCenterLineScreenSize = SelectCenterLineScreenSize
	protected readonly NEARBY_GRAPHICS_STATE = NEARBY_GRAPHICS_STATE
	protected readonly NEARBY_GRAPHICS_EVENT = NEARBY_GRAPHICS_EVENT
	protected readonly CREATE_PREVIEW_STATE = CREATE_PREVIEW_STATE
	protected readonly CREATE_PREVIEW_EVENT = CREATE_PREVIEW_EVENT
	private _state = inject(CanvasClientStateService)
	private _render = inject(CanvasRenderService)
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _elementRef = inject(ElementRef)

	nearbyGraphicsSelectMenuArray = NearbyGraphicsMenuOptions

	public ngAfterViewInit() {
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(this._elementRef.nativeElement, EVENT_TYPE.POINTER_ENTER, (event: PointerEvent) => {
				console.log(EVENT_TYPE.POINTER_ENTER, event)
				this._render.drawCanvas()
			})
		})
	}

	/*
	 toggleNearbyGraphics() {
	 this.graphicsMachine.sendEvent({ type: 'TOGGLE_NEARBY_GRAPHICS' })
	 // this._render.drawCanvas()
	 }
	 */

	toggleCreatePreview() {
		this.graphicsMachine.sendEvent(CREATE_PREVIEW_EVENT.CREATE_PREVIEW_TOGGLE)
		this._render.drawCanvas()
	}

	toggleNearbyAxisLines() {
		this.graphicsMachine.sendEvent(NEARBY_GRAPHICS_EVENT.NEARBY_LINES_TOGGLE)
		this._render.drawCanvas()
	}

	changeNearbyGraphics(event: Event) {
		const target = event.target as HTMLInputElement
		const newState = target.value as NearbyGraphicsStateMode
		// console.log('changeNearbyGraphics', newState)
		// this.graphicsMachine.sendEvent(NEARBY_GRAPHsICS_EVENT[''])

		switch (newState) {
			case NEARBY_GRAPHICS_STATE_MODE.TWO_SIDE_AXIS_LINES:
				this.graphicsMachine.sendEvent(NEARBY_GRAPHICS_EVENT.SELECT_TWO_SIDE_AXIS_LINES)
				break
			case NEARBY_GRAPHICS_STATE_MODE.CENTER_LINE_SCREEN_SIZE:
				this.graphicsMachine.sendEvent(NEARBY_GRAPHICS_EVENT.SELECT_CENTER_LINE_SCREEN_SIZE)
				break
			case NEARBY_GRAPHICS_STATE_MODE.CENTER_LINE_BETWEEN_TWO_ENTITIES:
				this.graphicsMachine.sendEvent(NEARBY_GRAPHICS_EVENT.SELECT_CENTER_LINE_BETWEEN_TWO_ENTITIES)
				break
			default:
				throw new Error(`Unknown nearby graphics state: ${newState}`)
		}
	}

	// protected readonly event = event
}
