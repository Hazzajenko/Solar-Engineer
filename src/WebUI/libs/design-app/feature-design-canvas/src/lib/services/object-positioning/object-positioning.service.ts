import { inject, Injectable } from '@angular/core'
import { AdjustedSingleToMove, CancelSingleMove, CanvasClientStateService, CanvasElementService, CanvasRenderService, DomPointService, MachineService, StartMultipleMove, StopMultipleMove, StopSingleMove } from '..'
import { TypeOfEntity } from '@design-app/feature-selected'
import { CURSOR_TYPE, Point } from '@shared/data-access/models'
import { CANVAS_COLORS, CanvasEntity, changeCanvasCursor, EntityFactory, eventToPointLocation, getEntityBounds, getTopLeftPointFromTransformedPoint, isHoldingClick, isPointInsideBounds, SizeByType, TransformedPoint, updateObjectByIdForStore } from '@design-app/feature-design-canvas'
import { assertNotNull } from '@shared/utils'
import { ENTITY_TYPE } from '@design-app/shared'

@Injectable({
	providedIn: 'root',
})
export class ObjectPositioningService {
	private _state = inject(CanvasClientStateService)
	private _domPoint = inject(DomPointService)
	private _render = inject(CanvasRenderService)
	private _canvasElement = inject(CanvasElementService)
	private _machine = inject(MachineService)
	multiToMoveStart: Point | undefined

	get canvas() {
		return this._canvasElement.canvas
	}

	singleToMoveMouseMove(event: MouseEvent, entityOnMouseDown: TypeOfEntity) {
		if (!isHoldingClick(event)) {
			this._machine.sendEvent(new CancelSingleMove())
			// sendStateEvent(new CancelSingleMove())
			return
		}
		/*		if (!this._state.mouse.mouseDown) {
		 // if (!isHoldingClick(event)) {
		 // console.log('singleToMoveMouseMove - not holding click')
		 this._state.updateState({
		 toMove: {
		 singleToMove: undefined,
		 },
		 })
		 sendStateEvent(new CancelSingleMove())
		 return
		 }*/
		// console.log('singleToMoveMouseMove', event)
		// assertNotNull(this.singleToMove)
		changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
		// console.log('singleToMoveMouseMove', this.canvas)
		// this.canvas.style.cursor = CURSOR_TYPE.MOVE
		const eventPoint = this._domPoint.getTransformedPointFromEvent(event)
		const isSpotTaken = this.areAnyEntitiesNearbyExcludingGrabbed(eventPoint, entityOnMouseDown.id)
		if (isSpotTaken) {
			// TODO - change cursor to not allowed
			// this.canvas.style.cursor = CURSOR_TYPE.CROSSHAIR
			// changeCanvasCursor(this.canvas, CURSOR_TYPE.CROSSHAIR)
			// return
		}
		const location = getTopLeftPointFromTransformedPoint(eventPoint, SizeByType[entityOnMouseDown.type])
		const ent = this._state.entities.canvasEntities.getEntityById(entityOnMouseDown.id)
		assertNotNull(ent)
		const angle = ent.angle
		// this._machine.sendEvent(new MoveSingleEntity({ id: entityOnMouseDown.id, location, angle }))

		const drawSingleToMove = (ctx: CanvasRenderingContext2D) => {
			ctx.save()
			ctx.fillStyle = CANVAS_COLORS.HoveredPanelFillStyle
			ctx.translate(location.x + ent.width / 2, location.y + ent.height / 2)
			ctx.rotate(ent.angle)

			ctx.beginPath()
			ctx.rect(-ent.width / 2, -ent.height / 2, ent.width, ent.height)
			ctx.fill()
			ctx.stroke()
			ctx.restore()
		}

		this._render.drawCanvasExcludeIdsWithFn([entityOnMouseDown.id], drawSingleToMove)

		// this._render.drawCanvas()
	}

	singleToMoveMouseUp(event: MouseEvent, singleToMove: AdjustedSingleToMove) {
		// this.isDraggingEntity = false
		// assertNotNull(this.singleToMoveId)
		// const entityToMove = this._entitiesStore.select.entityById(entityOnMouseDown.id)
		const location = this._domPoint.getTransformedPointToMiddleOfObjectFromEvent(event, ENTITY_TYPE.Panel)
		// const updatedEntity = EntityFactory.updateForStore(entityToMove, { location })
		const update = updateObjectByIdForStore(singleToMove.id, { location })
		// this._entitiesStore.dispatch.updateCanvasEntity(update)
		this._state.entities.canvasEntities.updateEntity(singleToMove.id, { location })
		// this.singleToMoveId = undefined
		// this.singleToMoveLocation = undefined
		// this.singleToMove = undefined
		console.log('entityOnMouseDown', update)
		changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		// updateClientStateCallback({ singleToMoveEntity: undefined })
		/*    this._clientState.updater.toMove({
		 singleToMoveEntity: undefined,
		 })*/
		/*		this._state.updateState({
		 toMove: {
		 singleToMove: undefined, // singleToMoveEntity: undefined,
		 },
		 })*/
		this._machine.sendEvent(new StopSingleMove())
		// sendStateEvent(new StopSingleMove())
		this._render.drawCanvas()
		// */
		/*    if (this.entityOnMouseDown) {
		 const location = this._domPoint.getTransformedPointToMiddleOfObjectFromEvent(event, this.entityOnMouseDown.type)
		 const updatedEntity = EntityFactory.updateForStore(this.entityOnMouseDown, { location })
		 this._entitiesStore.dispatch.updateCanvasEntity(updatedEntity)
		 this.entityOnMouseDown = undefined
		 }*/
		return
	}

	multiSelectDraggingMouseDown(event: MouseEvent, multipleSelectedIds: string[]) {
		// if (this._multiSelected.length === 0) return
		/*    const selectedIds = this._state.selected.multipleSelectedIds
		 if (selectedIds.length <= 0) return*/
		if (!event.shiftKey || !event.ctrlKey) return
		// if (!event.shiftKey) return
		// this.isMultiSelectDragging = true
		// this.multiSelectStart = eventToPointLocation(event)
		const multiSelectStart = this._domPoint.getTransformedPointFromEvent(event)
		/*		this._state.updateState({
		 toMove: {
		 multipleToMove: {
		 ids: multipleSelectedIds, startPoint: multiSelectStart, offset: { x: 0, y: 0 }, entities: this._state.entities.canvasEntities.getEntitiesByIds(multipleSelectedIds),
		 }, // multiToMoveStart: multiSelectStart,
		 },
		 })*/
		this._machine.sendEvent(new StartMultipleMove({
			ids: multipleSelectedIds, startPoint: multiSelectStart, offset: { x: 0, y: 0 }, entities: this._state.entities.canvasEntities.getEntitiesByIds(multipleSelectedIds),
		}))
		this.multiToMoveStart = multiSelectStart

		// this._entityStore.dispatch.setDraggingEntityIds()
	}

	setMultiSelectDraggingMouseMove(event: MouseEvent, multipleSelectedIds: string[]) {
		if (!event.shiftKey || !event.ctrlKey) {
			this.stopMultiSelectDragging(event)
			// this.drawPanels()
			return
		}
		const multiToMove = this._machine.ctx.toMove.multipleToMove
		// const multiToMove = this._state.toMove.multipleToMove
		if (multiToMove) return
		// changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
		// this.canvas.style.cursor = CURSOR_TYPE.GRABBING

		// assertNotNull(multiToMove)
		const multiToMoveStart = this._domPoint.getTransformedPointFromEvent(event)
		// const multiSelectedIds = this._state.selected.multipleSelectedIds
		if (multipleSelectedIds.length <= 0) return
		const entities = this._state.entities.canvasEntities.getEntitiesByIds(multipleSelectedIds)
		// const multiToMoveStart = this._state.toMove.multiToMove?.startPoint
		// if (!multiToMoveStart) return
		// const multiSelectStart = this._domPoint.getTransformedPointFromEvent(event)
		// assertNotNull(this.multiSelectStart)
		/*    const eventLocation = eventToPointLocation(event)
		 const scale = this._domPoint.scale
		 const offset = {
		 x: eventLocation.x - multiToMoveStart.x,
		 y: eventLocation.y - multiToMoveStart.y,
		 }*/
		/*   const entities = multiToMove.entities.map((e) => {
		 return {
		 ...e,
		 location: {
		 x: e.location.x + offset.x / scale,
		 y: e.location.y + offset.y / scale,
		 },
		 }
		 })*/
		/*		this._state.updateState({
		 toMove: {
		 multipleToMove: {
		 ids: multipleSelectedIds, entities, offset: { x: 0, y: 0 }, startPoint: multiToMoveStart,
		 },
		 },
		 })*/
		this._machine.sendEvent(new StartMultipleMove({
			ids: multipleSelectedIds, entities, offset: { x: 0, y: 0 }, startPoint: multiToMoveStart,
		}))
		this.multiToMoveStart = multiToMoveStart

		// }
		// this._render.drawCanvas()
		// this.drawPanels()
	}

	multiSelectDraggingMouseMove(event: MouseEvent) {
		if (!event.shiftKey || !event.ctrlKey) {
			this.stopMultiSelectDragging(event)
			return
		}
		changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
		// const multiToMove = this._machine.ctx.toMove.multipleToMove
		// assertNotNull(multiToMove)
		// const multiToMoveStart = multiToMove.startPoint
		const multiToMoveStart = this.multiToMoveStart
		assertNotNull(multiToMoveStart)
		// if (!multiToMoveStart) return
		const eventLocation = eventToPointLocation(event)
		// const eventLocation = this._domPoint.getTransformedPointFromEvent(event)
		const scale = this._domPoint.scale
		const offset = {
			x: eventLocation.x - multiToMoveStart.x, y: eventLocation.y - multiToMoveStart.y,
		}
		offset.x = offset.x / scale
		offset.y = offset.y / scale
		const multiSelectedIds = this._machine.ctx.selected.multipleSelectedIds
		const multiSelected = multiSelectedIds
			.map(id => this._state.entities.canvasEntities.getEntityById(id))
			.filter(entity => entity !== undefined) as CanvasEntity[]
		// const multiToMoveIds = multiToMove.ids
		// const multiToMoveEntities = multiToMove.entities
		const updates = multiSelected.map((entity) => {
			const location = entity.location
			const newLocation = {
				x: location.x + offset.x, y: location.y + offset.y,
			}

			// const { width, height } = SizeByType[ENTITY_TYPE.Panel]
			return {
				...entity, location: newLocation,
			}
			// return updateObjectByIdForStore(entity.id, { location: newLocation })
			/*   this._state.updateState({
			 toMove: {
			 multipleToMove: {
			 ids:        multiToMoveIds,
			 startPoint: multiToMoveStart,

			 }
			 }
			 })*/
			// this._state.entity.updateEntity(entity.id, { location: newLocation })
		})

		// const width

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

		this._render.drawCanvasExcludeIdsWithFn(multiSelectedIds, drawMultipleToMove)
		return
	}

	stopMultiSelectDragging(event: MouseEvent) {
		const multiToMove = this._machine.ctx.toMove.multipleToMove
		assertNotNull(multiToMove)
		const multiToMoveStart = multiToMove.startPoint
		if (!multiToMoveStart) return
		const eventLocation = eventToPointLocation(event)
		const scale = this._domPoint.scale
		const offset = {
			x: eventLocation.x - multiToMoveStart.x, y: eventLocation.y - multiToMoveStart.y,
		}
		offset.x = offset.x / scale
		offset.y = offset.y / scale
		const multiSelectedIds = this._machine.ctx.selected.multipleSelectedIds
		// const multiSelectedIds = this._state.selected.multipleSelectedIds
		// const multiSelectedEntities = this._state.selected.entities
		/* const multiSelected = Object.keys(multiSelectedEntities)
		 .map(id => this._entitiesStore.select.entityById(id))*/
		const multiSelected = multiSelectedIds
			.map(id => this._state.entities.canvasEntities.getEntityById(id))
			.filter(entity => entity !== undefined) as CanvasEntity[]

		/*    const multiSelected = multiSelectedIds
		 .map(id => this._entitiesStore.select.entityById(id))*/
		// const multiSelectedEntities = this._multiSelectedIds.map(id => this._entitiesStore.select.entityById(id))
		const multiSelectedUpdated = multiSelected.map(entity => {
			const location = entity.location
			const newLocation = {
				x: location.x + offset.x, y: location.y + offset.y,
			}

			// const newEntityInstance = entity.updateWithNewInstance(entity)
			const updatedEntity = EntityFactory.updateForStore(entity, { location: newLocation })
			// const updatedEntity = entity.updateForStore({ location: newLocation })
			const newEntityInstance = EntityFactory.update(entity, { location: newLocation })
			// this._entitiesStore.dispatch.updateCanvasEntity(updatedEntity)
			this._state.entities.canvasEntities.updateEntity(updatedEntity.id, updatedEntity.changes)
			// return updatedEntity
			return newEntityInstance
		})

		const storeUpdates = multiSelectedUpdated.map(entity => {
			return EntityFactory.updateForStore(entity, { location: entity.location })
		})
		this._state.entities.canvasEntities.updateManyEntities(storeUpdates)

		/*	this._state.updateState({
		 toMove: {
		 multipleToMove: undefined,
		 },
		 })*/
		this._machine.sendEvent(new StopMultipleMove())

		this._canvasElement.changeCursor('')
		this._render.drawCanvas()
		return
	}

	areAnyEntitiesNearbyExcludingGrabbed(point: TransformedPoint, grabbedId: string) {
		return !!this._state.entities.canvasEntities.getEntities()
			.find((entity) => entity.id !== grabbedId && isPointInsideBounds(point, getEntityBounds(entity)))
		// return !!this.entities.find((entity) => entity.id !== grabbedId && isPointInsideBounds(point, getEntityBounds(entity)))
	}
}