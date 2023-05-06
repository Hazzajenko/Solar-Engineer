import { NearbyGraphicsMenuOptions } from './nearby-graphics-menu-options'
import { IsNearbyLinesEnabledPipe } from './pipes'
import { AsyncPipe, NgForOf, NgIf } from '@angular/common'
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	NgZone,
	Renderer2,
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ReactiveFormsModule } from '@angular/forms'
import {
	AppStoreService,
	CREATE_PREVIEW_EVENT,
	CREATE_PREVIEW_XSTATE,
	GraphicsStateEvent,
	GraphicsStoreService,
	initialGraphicsState,
	NEARBY_GRAPHICS_EVENT,
	NEARBY_GRAPHICS_STATE,
	NEARBY_GRAPHICS_STATE_MODE,
	NEARBY_LINES_STATE,
	NearbyGraphicsStateMode,
	NearbyLinesState,
	RenderService,
} from '@design-app/data-access'
import { LetModule } from '@ngrx/component'
import { EVENT_TYPE } from '@shared/data-access/models'


@Component({
	selector: 'app-canvas-graphics-menu',
	standalone: true,
	imports: [NgForOf, NgIf, AsyncPipe, ReactiveFormsModule, LetModule, IsNearbyLinesEnabledPipe],
	templateUrl: './canvas-graphics-menu.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasGraphicsMenuComponent implements AfterViewInit {
	private _app = inject(AppStoreService)
	graphicsState$ = this._app.subscribeGraphics$()
	private _graphicsStore = inject(GraphicsStoreService)
	graphicsState = toSignal(this._graphicsStore.state$, { initialValue: initialGraphicsState })
	// graphicsState = this._graphicsStore.state

	// graphicsState$ = this.graphicsMachine.subscribe()

	// protected readonly SelectCenterLineScreenSize = SelectCenterLineScreenSize
	protected readonly NEARBY_GRAPHICS_STATE = NEARBY_GRAPHICS_STATE
	protected readonly NEARBY_LINES_STATE = NEARBY_LINES_STATE

	protected readonly NEARBY_GRAPHICS_EVENT = NEARBY_GRAPHICS_EVENT
	protected readonly CREATE_PREVIEW_STATE = CREATE_PREVIEW_XSTATE
	protected readonly CREATE_PREVIEW_EVENT = CREATE_PREVIEW_EVENT
	private _render = inject(RenderService)
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _elementRef = inject(ElementRef)

	nearbyGraphicsSelectMenuArray = NearbyGraphicsMenuOptions

	public ngAfterViewInit() {
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(this._elementRef.nativeElement, EVENT_TYPE.POINTER_ENTER, () => {
				this._render.renderCanvasApp()
			})
		})
	}

	/*
	 toggleNearbyGraphics() {
	 this.graphicsMachine.sendEvent({ type: 'TOGGLE_NEARBY_GRAPHICS' })
	 // this._render.drawCanvas()
	 }
	 */

	sendGraphicsEvent(event: GraphicsStateEvent) {
		this._app.sendGraphicsEvent(event)
		this._render.renderCanvasApp()
	}

	/*	sendGraphicsEventV2(event: GraphicsStateEvent) {
	 this._graphicsStore.dispatch.this._render.renderCanvasApp()
	 }*/

	toggleCreatePreview() {
		this._graphicsStore.dispatch.toggleCreatePreview()
		this._render.renderCanvasApp()
	}

	toggleNearbyAxisLines() {
		this._app.sendGraphicsEvent(NEARBY_GRAPHICS_EVENT.NEARBY_LINES_TOGGLE)
		this._render.renderCanvasApp()
	}

	changeNearbyGraphics(event: Event) {
		const target = event.target as HTMLInputElement
		const newState = target.value as NearbyGraphicsStateMode

		switch (newState) {
			case NEARBY_GRAPHICS_STATE_MODE.TWO_SIDE_AXIS_LINES:
				this._app.sendGraphicsEvent(NEARBY_GRAPHICS_EVENT.SELECT_TWO_SIDE_AXIS_LINES)
				break
			case NEARBY_GRAPHICS_STATE_MODE.CENTER_LINE_SCREEN_SIZE:
				this._app.sendGraphicsEvent(NEARBY_GRAPHICS_EVENT.SELECT_CENTER_LINE_SCREEN_SIZE)
				break
			case NEARBY_GRAPHICS_STATE_MODE.CENTER_LINE_BETWEEN_TWO_ENTITIES:
				this._app.sendGraphicsEvent(NEARBY_GRAPHICS_EVENT.SELECT_CENTER_LINE_BETWEEN_TWO_ENTITIES)
				break
			default:
				throw new Error(`Unknown nearby graphics state: ${newState}`)
		}
	}

	toggleNearbyLineGraphics() {
		this._graphicsStore.dispatch.toggleNearbyLines()
		this._render.renderCanvasApp()
	}

	changeNearbyGraphicsV2(event: Event) {
		const target = event.target as HTMLInputElement
		const newState = target.value as NearbyLinesState

		switch (newState) {
			case NEARBY_LINES_STATE.TWO_SIDE_AXIS_LINES:
				this._graphicsStore.dispatch.setNearbyLines(NEARBY_LINES_STATE.TWO_SIDE_AXIS_LINES)
				break
			case NEARBY_LINES_STATE.CENTER_LINE_SCREEN_SIZE:
				this._graphicsStore.dispatch.setNearbyLines(NEARBY_LINES_STATE.CENTER_LINE_SCREEN_SIZE)
				break
			case NEARBY_LINES_STATE.CENTER_LINE_BETWEEN_TWO_ENTITIES:
				this._graphicsStore.dispatch.setNearbyLines(
					NEARBY_LINES_STATE.CENTER_LINE_BETWEEN_TWO_ENTITIES,
				)
				break
			default:
				throw new Error(`Unknown nearby graphics state: ${newState}`)
		}
		this._render.renderCanvasApp()
	}

	// protected readonly event = event
}