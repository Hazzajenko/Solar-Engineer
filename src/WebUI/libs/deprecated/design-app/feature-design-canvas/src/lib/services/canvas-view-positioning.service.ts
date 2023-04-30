import { TransformedPoint } from '../types'
import { draggingScreenKeysDown } from '../utils'
import {
	CanvasClientStateService,
	MachineService,
	StartViewDragging,
	StopViewDragging,
} from './canvas-client-state'
// import { CanvasEntitiesStore } from './canvas-entities'
import { CanvasElementService } from './canvas-element.service'
import { CanvasRenderV2Service } from './canvas-render'
import { DomPointService } from './dom-point.service'
import { inject, Injectable } from '@angular/core'
import { CURSOR_TYPE } from '@shared/data-access/models'
import { assertNotNull } from '@shared/utils'

@Injectable({
	providedIn: 'root',
})
export class CanvasViewPositioningService {
	// private _entitiesStore = inject(CanvasEntitiesStore)
	private _domPointService = inject(DomPointService)
	private _canvasElementsService = inject(CanvasElementService)
	private _state = inject(CanvasClientStateService)
	private _render = inject(CanvasRenderV2Service)
	// private _render = inject(CanvasRenderService)
	private _machine = inject(MachineService)

	screenDragStartPoint?: TransformedPoint

	get ctx() {
		return this._canvasElementsService.ctx
	}

	get canvas() {
		return this._canvasElementsService.canvas
	}

	handleDragScreenMouseDown(event: PointerEvent, currentPoint: TransformedPoint) {
		/*    this._state.updateState({
		 view: {
		 dragStart: this._domPointService.getTransformedPointFromEvent(event),
		 },
		 })*/
		this._machine.sendEvent({ type: 'StartViewDragging' })
		// this._machine.sendEvent(new StartViewDragging())
		this.screenDragStartPoint = currentPoint
		// this.screenDragStartPoint = this._domPointService.getTransformedPointFromEvent(event)
	}

	handleDragScreenMouseMove(event: PointerEvent, currentPoint: TransformedPoint) {
		if (!draggingScreenKeysDown(event)) {
			/*      this._state.updateState({
			 view: {
			 dragStart: undefined,
			 },
			 })*/
			this._machine.sendEvent({ type: 'StopViewDragging' })
			// this._machine.sendEvent(new StopViewDragging())
			this.screenDragStartPoint = undefined
			return
		}
		assertNotNull(this.screenDragStartPoint)
		this.canvas.style.cursor = CURSOR_TYPE.MOVE
		// const currentTransformedCursor = this._domPointService.getTransformedPointFromEvent(event)
		const transformX = currentPoint.x - this.screenDragStartPoint.x
		const transformY = currentPoint.y - this.screenDragStartPoint.y
		this.ctx.translate(transformX, transformY)
		this._render.renderCanvasApp()
		// this._render.drawCanvas()
		// this.drawPanels()
	}

	handleDragScreenMouseUp(event: PointerEvent) {
		this.screenDragStartPoint = undefined
		this._machine.sendEvent({ type: 'StopViewDragging' })
		// this._machine.sendEvent(new StopViewDragging())
		/*		this._state.updateState({
		 view: {
		 dragStart: undefined,
		 },
		 })*/
	}
}
