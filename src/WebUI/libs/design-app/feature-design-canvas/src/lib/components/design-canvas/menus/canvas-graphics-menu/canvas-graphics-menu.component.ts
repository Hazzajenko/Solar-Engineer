import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, NgZone, Renderer2 } from '@angular/core'
import { AsyncPipe, NgForOf, NgIf } from '@angular/common'
import { CanvasClientStateService, CanvasRenderService } from '../../../../services'
import { EVENT_TYPE } from '@shared/data-access/models'
import { GraphicsSettingsMachineService, NEARBY_GRAPHICS_EVENT, NEARBY_GRAPHICS_EVENT_TYPE, NEARBY_GRAPHICS_STATE, NearbyGraphicsEventType } from './+xstate'
import { ReactiveFormsModule } from '@angular/forms'

@Component({
	selector:       'app-canvas-graphics-menu', standalone: true, imports: [
		NgForOf, NgIf, AsyncPipe, ReactiveFormsModule,
	], templateUrl: './canvas-graphics-menu.component.html', styles: [], changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasGraphicsMenuComponent

	implements AfterViewInit {

	graphicsMachine = inject(GraphicsSettingsMachineService)

	graphicsState$ = this.graphicsMachine.subscribe()

	// protected readonly SelectCenterLineScreenSize = SelectCenterLineScreenSize
	protected readonly NEARBY_GRAPHICS_STATE = NEARBY_GRAPHICS_STATE

	private _state = inject(CanvasClientStateService)
	private _render = inject(CanvasRenderService)
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _elementRef = inject(ElementRef)
	canvasMenuArr = [
		{
			label: 'Create Preview', action: this.toggleCreatePreview.bind(this), selected: this._state.menu.createPreview,
		}, {
			label: 'Nearby Axis Lines', action: this.toggleNearbyAxisLines.bind(this), selected: this._state.menu.nearbyAxisLines,
		},
	]

	nearbyGraphicsSelectMenu = {
		label: 'Nearby Axis Lines', action: this.toggleNearbyAxisLines.bind(this), selected: this._state.menu.nearbyAxisLines,

	}

	nearbyGraphicsSelectMenuArray = [
		{
			label: 'Center Line Between Two Entities', value: NEARBY_GRAPHICS_EVENT_TYPE.SELECT_CENTER_LINE_BETWEEN_TWO_ENTITIES, selected: this.graphicsMachine.state.NearbyLinesState === NEARBY_GRAPHICS_STATE.CENTER_LINE_BETWEEN_TWO_ENTITIES,
		}, {
			label: 'Center Line Screen Size', value: NEARBY_GRAPHICS_EVENT_TYPE.SELECT_CENTER_LINE_SCREEN_SIZE, selected: this.graphicsMachine.state.NearbyLinesState === NEARBY_GRAPHICS_STATE.CENTER_LINE_SCREEN_SIZE,
		}, {
			label: 'Two Side Axis Lines', value: NEARBY_GRAPHICS_EVENT_TYPE.SELECT_TWO_SIDE_AXIS_LINES, selected: this.graphicsMachine.state.NearbyLinesState === NEARBY_GRAPHICS_STATE.TWO_SIDE_AXIS_LINES,
		},
	]

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
		this._state.updateState({
			menu: {
				createPreview: !this._state.menu.createPreview,
			},
		})
		this._render.drawCanvas()
	}

	toggleNearbyAxisLines() {
		this._state.updateState({
			menu: {
				nearbyAxisLines: !this._state.menu.nearbyAxisLines,
			},
		})
		this.graphicsMachine.sendEvent(NEARBY_GRAPHICS_EVENT.NEARBY_LINES_TOGGLE)
		this._render.drawCanvas()
	}

	changeNearbyGraphics(event: Event) {
		const target = event.target as HTMLInputElement
		const newState = target.value as NearbyGraphicsEventType
		switch (newState) {
			case NEARBY_GRAPHICS_EVENT_TYPE.SELECT_TWO_SIDE_AXIS_LINES:
				this.graphicsMachine.sendEvent(NEARBY_GRAPHICS_EVENT.SELECT_TWO_SIDE_AXIS_LINES)
				break
			case NEARBY_GRAPHICS_EVENT_TYPE.SELECT_CENTER_LINE_SCREEN_SIZE:
				this.graphicsMachine.sendEvent(NEARBY_GRAPHICS_EVENT.SELECT_CENTER_LINE_SCREEN_SIZE)
				break
			case NEARBY_GRAPHICS_EVENT_TYPE.SELECT_CENTER_LINE_BETWEEN_TWO_ENTITIES:
				this.graphicsMachine.sendEvent(NEARBY_GRAPHICS_EVENT.SELECT_CENTER_LINE_BETWEEN_TWO_ENTITIES)
				break
			default:
				throw new Error(`Unknown nearby graphics state: ${newState}`)
		}
	}
}
