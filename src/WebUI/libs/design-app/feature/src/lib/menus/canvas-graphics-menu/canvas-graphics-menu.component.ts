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
import { ReactiveFormsModule } from '@angular/forms'
import {
	AppStoreService,
	CREATE_PREVIEW_EVENT,
	CREATE_PREVIEW_STATE,
	GraphicsStateEvent,
	NEARBY_GRAPHICS_EVENT,
	NEARBY_GRAPHICS_STATE,
	NEARBY_GRAPHICS_STATE_MODE,
	NearbyGraphicsStateMode,
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
	// graphicsState$ = this.graphicsMachine.subscribe()

	// protected readonly SelectCenterLineScreenSize = SelectCenterLineScreenSize
	protected readonly NEARBY_GRAPHICS_STATE = NEARBY_GRAPHICS_STATE
	protected readonly NEARBY_GRAPHICS_EVENT = NEARBY_GRAPHICS_EVENT
	protected readonly CREATE_PREVIEW_STATE = CREATE_PREVIEW_STATE
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

	toggleCreatePreview() {
		this._app.sendGraphicsEvent(CREATE_PREVIEW_EVENT.CREATE_PREVIEW_TOGGLE)
		this._render.renderCanvasApp()
	}

	toggleNearbyAxisLines() {
		this._app.sendGraphicsEvent(NEARBY_GRAPHICS_EVENT.NEARBY_LINES_TOGGLE)
		this._render.renderCanvasApp()
	}

	changeNearbyGraphics(event: Event) {
		const target = event.target as HTMLInputElement
		const newState = target.value as NearbyGraphicsStateMode
		// console.log('changeNearbyGraphics', newState)
		// this.graphicsMachine.sendEvent(NEARBY_GRAPHsICS_EVENT[''])

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

	// protected readonly event = event
}