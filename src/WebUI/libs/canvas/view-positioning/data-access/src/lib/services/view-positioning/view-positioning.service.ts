import { AppStateStoreService, CanvasElementService } from '@canvas/app/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import { inject, Injectable } from '@angular/core'
import { CURSOR_TYPE, TransformedPoint } from '@shared/data-access/models'
import { assertNotNull } from '@shared/utils'
import { draggingScreenKeysDown } from '@canvas/utils'

@Injectable({
	providedIn: 'root',
})
export class ViewPositioningService {
	private _canvasElementsService = inject(CanvasElementService)
	private _render = inject(RenderService)
	private _appStore = inject(AppStateStoreService)

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
		// this._app.sendEvent({ type: 'StartViewDragging' })
		this._appStore.dispatch.setViewPositioningState('ViewDraggingInProgress')
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
			// this._app.sendEvent({ type: 'StopViewDragging' })
			this._appStore.dispatch.setViewPositioningState('ViewNotMoving')
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

	handleDragScreenMouseUp() {
		this.screenDragStartPoint = undefined
		// this._app.sendEvent({ type: 'StopViewDragging' })
		this._appStore.dispatch.setViewPositioningState('ViewNotMoving')
		// this._machine.sendEvent(new StopViewDragging())
		/*		this._state.updateState({
		 view: {
		 dragStart: undefined,
		 },
		 })*/
	}
}
