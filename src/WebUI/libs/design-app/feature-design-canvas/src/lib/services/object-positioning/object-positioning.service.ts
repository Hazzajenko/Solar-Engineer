import { inject, Injectable } from '@angular/core'
import { CanvasClientStateService, CanvasElementService, CanvasRenderService, DomPointService, MachineService, StartMultipleMove, StartSingleMove, StopMultipleMove, StopSingleMove } from '..'
import { CURSOR_TYPE } from '@shared/data-access/models'
import { assertNotNull } from '@shared/utils'
import { ENTITY_TYPE } from '@design-app/shared'
import { changeCanvasCursor, getEntityBounds, getTopLeftPointFromTransformedPoint, isHoldingClick, isPointInsideBounds } from '../../utils'
import { CANVAS_COLORS, EntityFactory, EventPoint, SizeByType, TransformedPoint } from '../../types'
import { eventToEventPoint, eventToPointLocation } from '../../functions'

@Injectable({
	providedIn: 'root',
})
export class ObjectPositioningService {
	private _state = inject(CanvasClientStateService)
	private _domPoint = inject(DomPointService)
	private _render = inject(CanvasRenderService)
	private _canvasElement = inject(CanvasElementService)
	private _machine = inject(MachineService)
	singleToMoveId: string | undefined
	// multiToMoveStart: TransformedPoint | undefined
	multiToMoveStart: EventPoint | undefined
	multipleToMoveIds: string[] = []

	get canvas() {
		return this._canvasElement.canvas
	}

	setSingleToMoveEntity(event: PointerEvent, singleToMoveId: string) {
		this.singleToMoveId = singleToMoveId
		this._machine.sendEvent(new StartSingleMove())
	}

	singleToMoveMouseMove(event: PointerEvent, currentPoint: TransformedPoint) {
		if (!isHoldingClick(event)) {
			this._machine.sendEvent(new StopSingleMove())
			this.singleToMoveId = undefined
			return
		}
		assertNotNull(this.singleToMoveId)
		changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
		// const eventPoint = this._domPoint.getTransformedPointFromEvent(event)
		// const currentPoint = this._domPoint.getTransformedPointFromEvent(event)
		const isSpotTaken = this.areAnyEntitiesNearbyExcludingGrabbed(currentPoint, this.singleToMoveId)
		if (isSpotTaken) {
			// TODO - change cursor to not allowed
			// this.canvas.style.cursor = CURSOR_TYPE.CROSSHAIR
			// changeCanvasCursor(this.canvas, CURSOR_TYPE.CROSSHAIR)
			// return
		}
		const location = getTopLeftPointFromTransformedPoint(currentPoint, SizeByType[ENTITY_TYPE.Panel])
		const entity = this._state.entities.canvasEntities.getEntityById(this.singleToMoveId)
		assertNotNull(entity)

		const drawSingleToMove = (ctx: CanvasRenderingContext2D) => {
			ctx.save()
			ctx.fillStyle = CANVAS_COLORS.HoveredPanelFillStyle
			ctx.translate(location.x + entity.width / 2, location.y + entity.height / 2)
			ctx.rotate(entity.angle)

			ctx.beginPath()
			ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
			ctx.fill()
			ctx.stroke()
			ctx.restore()
		}

		this._render.drawCanvasExcludeIdsWithFn([this.singleToMoveId], drawSingleToMove)
	}

	singleToMoveMouseUp(event: PointerEvent, currentPoint: TransformedPoint) {
		assertNotNull(this.singleToMoveId)

		// const middleOf = getMiddleOfObjectFromEvent(event, ENTITY_TYPE.Panel)
		const location = getTopLeftPointFromTransformedPoint(currentPoint, SizeByType[ENTITY_TYPE.Panel])
		// const location = this._domPoint.getTransformedPointToMiddleOfObjectFromEvent(event, ENTITY_TYPE.Panel)
		this._state.entities.canvasEntities.updateEntity(this.singleToMoveId, { location })

		changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		this.singleToMoveId = undefined

		this._machine.sendEvent(new StopSingleMove())
		this._render.drawCanvas()
		return
	}

	multiSelectDraggingMouseDown(event: PointerEvent, multipleSelectedIds: string[]) {
		if (!event.shiftKey || !event.ctrlKey) return
		this.multipleToMoveIds = multipleSelectedIds
		this.multiToMoveStart = eventToEventPoint(event)
		// this.multiToMoveStart = currentPoint
		// this.multiToMoveStart = this._domPoint.getTransformedPointFromEvent(event)
		this._machine.sendEvent(new StartMultipleMove())
	}

	setMultiSelectDraggingMouseMove(event: PointerEvent, multipleSelectedIds: string[]) {
		if (!event.shiftKey || !event.ctrlKey) {
			this.stopMultiSelectDragging(event)
			return
		}
		this.multipleToMoveIds = multipleSelectedIds
		this.multiToMoveStart = eventToEventPoint(event)
		// this.multiToMoveStart = currentPoint
		// this.multiToMoveStart = this._domPoint.getTransformedPointFromEvent(event)
		this._machine.sendEvent(new StartMultipleMove())
	}

	multiSelectDraggingMouseMove(event: PointerEvent) {
		if (!event.shiftKey || !event.ctrlKey) {
			this.stopMultiSelectDragging(event)
			return
		}
		changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
		const multiToMoveStart = this.multiToMoveStart
		assertNotNull(multiToMoveStart)
		// const eventLocation = this._domPoint.getTransformedPointFromEvent(event)
		const eventLocation = eventToPointLocation(event)
		const scale = this._domPoint.scale
		const offset = {
			x: eventLocation.x - multiToMoveStart.x, y: eventLocation.y - multiToMoveStart.y,
		}
		offset.x = offset.x / scale
		offset.y = offset.y / scale

		const multipleToMoveIds = this.multipleToMoveIds
		const entities = this._state.entities.canvasEntities.getEntitiesByIds(multipleToMoveIds)

		const updates = entities.map((entity) => {
			const location = entity.location
			const newLocation = {
				x: location.x + offset.x, y: location.y + offset.y,
			}
			return {
				...entity, location: newLocation,
			}
		})

		const drawMultipleToMove = (ctx: CanvasRenderingContext2D) => {
			ctx.save()
			updates.forEach((entity) => {
				ctx.save()
				ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
				ctx.rotate(entity.angle)

				ctx.beginPath()
				ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
				ctx.fill()
				ctx.stroke()
				ctx.restore()
			})
			ctx.restore()
		}

		this._render.drawCanvasExcludeIdsWithFn(multipleToMoveIds, drawMultipleToMove)
		return
	}

	stopMultiSelectDragging(event: MouseEvent) {
		const multiToMoveStart = this.multiToMoveStart
		assertNotNull(multiToMoveStart)
		const eventLocation = eventToPointLocation(event)
		const scale = this._domPoint.scale
		const offset = {
			x: eventLocation.x - multiToMoveStart.x, y: eventLocation.y - multiToMoveStart.y,
		}
		offset.x = offset.x / scale
		offset.y = offset.y / scale
		const multipleToMoveIds = this.multipleToMoveIds
		const entities = this._state.entities.canvasEntities.getEntitiesByIds(multipleToMoveIds)

		const multiSelectedUpdated = entities.map(entity => {
			const location = entity.location
			const newLocation = {
				x: location.x + offset.x, y: location.y + offset.y,
			}
			return EntityFactory.update(entity, { location: newLocation })
		})

		const storeUpdates = multiSelectedUpdated.map(entity => {
			return EntityFactory.updateForStore(entity, { location: entity.location })
		})
		this._state.entities.canvasEntities.updateManyEntities(storeUpdates)

		this._machine.sendEvent(new StopMultipleMove())

		this._canvasElement.changeCursor('')

		this.multipleToMoveIds = []
		this.multiToMoveStart = undefined

		this._render.drawCanvas()
		return
	}

	resetObjectPositioning(event: PointerEvent, currentPoint: TransformedPoint) {
		if (this.multiToMoveStart) {
			this.stopMultiSelectDragging(event)
			this._machine.sendEvent(new StopMultipleMove())
		}
		if (this.singleToMoveId) {
			this.singleToMoveMouseUp(event, currentPoint)
			this._machine.sendEvent(new StopSingleMove())
		}

		this._canvasElement.changeCursor(CURSOR_TYPE.AUTO)
		this.singleToMoveId = undefined
		this.multipleToMoveIds = []
		this.multiToMoveStart = undefined
	}

	areAnyEntitiesNearbyExcludingGrabbed(point: TransformedPoint, grabbedId: string) {
		return !!this._state.entities.canvasEntities.getEntities()
			.find((entity) => entity.id !== grabbedId && isPointInsideBounds(point, getEntityBounds(entity)))
	}
}