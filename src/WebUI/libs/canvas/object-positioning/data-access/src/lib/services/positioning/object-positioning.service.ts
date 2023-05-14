import { CanvasElementService } from '@canvas/app/data-access'
import { DomPointService } from '../dom-point'
import { GraphicsStoreService } from '@canvas/graphics/data-access'
import { getNearbyLineDrawCtxFnFromNearbyLinesState } from '../nearby'
import { ObjectPositioningStoreService } from '../../store'
import { RenderService } from '@canvas/rendering/data-access'
import { drawSelectionBoxBoundsCtxFn } from './draw-selection-box'
import { inject, Injectable } from '@angular/core'
import { UpdateStr } from '@ngrx/entity/src/models'
import {
	Axis,
	CANVAS_COLORS,
	CanvasEntity,
	CompleteEntityBounds,
	CURSOR_TYPE,
	ENTITY_TYPE,
	EventPoint,
	Point,
	SizeByType,
	TransformedPoint,
} from '@shared/data-access/models'
import { assertNotNull, groupInto2dArray } from '@shared/utils'
import { sortBy } from 'lodash'
import { injectEntityStore } from '@entities/common/data-access'
import {
	changeCanvasCursor,
	EntityFactory,
	eventToEventPoint,
	eventToPointLocation,
	findNearbyBoundOverlapOnBothAxisExcludingIds,
	getCompleteBoundsFromCenterTransformedPoint,
	getCompleteBoundsFromMultipleEntitiesWithPadding,
	getCtxRectBoundsByAxisV2,
	getEntityBounds,
	getTopLeftPointFromTransformedPoint,
	isHoldingClick,
	isPointInsideBounds,
	multiSelectDraggingKeysDown,
	updateObjectById,
} from '@canvas/utils'
import { CanvasPanel } from '@entities/panels/data-access'

@Injectable({
	providedIn: 'root',
})
export class ObjectPositioningService {
	private _entities = injectEntityStore()
	// private _entities = inject(EntityStoreService)
	private _domPoint = inject(DomPointService)
	private _render = inject(RenderService)
	// private _render = inject(RenderService)
	// private _render = inject(CanvasRenderService)
	private _canvasElement = inject(CanvasElementService)
	// private _app = inject(AppStoreService)
	private _graphicsStore = inject(GraphicsStoreService)
	private _positioningStore = inject(ObjectPositioningStoreService)
	singleToMoveId: string | undefined
	// multiToMoveStart: TransformedPoint | undefined
	multiToMoveStart: EventPoint | undefined
	multipleToMoveIds: string[] = []

	currentAxis: Axis | undefined
	axisRepositionPreviewRect: CompleteEntityBounds | undefined

	// axisPreviewRect: CompleteEntityBounds | undefined

	get canvas() {
		return this._canvasElement.canvas
	}

	setSingleToMoveEntity(event: PointerEvent, singleToMoveId: string) {
		this.singleToMoveId = singleToMoveId
		this._positioningStore.dispatch.startMovingSingleEntity(singleToMoveId)
		// this._app.sendEvent({ type: 'StartSingleMove' })
		// this._app.sendEvent(new StartSingleMove())
	}

	singleToMoveMouseMoveV2Ngrx(event: PointerEvent, currentPoint: TransformedPoint) {
		if (!isHoldingClick(event)) {
			this.singleToMoveMouseUp(event, currentPoint)
			return
		}
		assertNotNull(this.singleToMoveId)
		changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
		// const eventPoint = this._domPoint.getTransformedPointFromEvent(event)
		// const currentPoint = this._domPoint.getTransformedPointFromEvent(event)
		const isSpotTaken = this.areAnyEntitiesNearbyExcludingGrabbed(currentPoint, this.singleToMoveId)
		/*		if (isSpotTaken) {
		 changeCanvasCursor(this.canvas, CURSOR_TYPE.CROSSHAIR)
		 // TODO - implement red box
		 // this.canvas.style.cursor = CURSOR_TYPE.CROSSHAIR
		 // changeCanvasCursor(this.canvas, CURSOR_TYPE.CROSSHAIR)
		 // return
		 } else {
		 changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
		 }*/
		const location = getTopLeftPointFromTransformedPoint(
			currentPoint,
			SizeByType[ENTITY_TYPE.Panel],
		)
		const entity = this._entities.panels.getById(this.singleToMoveId)
		assertNotNull(entity)

		const size = SizeByType[ENTITY_TYPE.Panel]
		const mouseBoxBounds = getCompleteBoundsFromCenterTransformedPoint(currentPoint, size)
		const entities = this._entities.panels.allPanels()
		const nearbyEntitiesOnAxis = findNearbyBoundOverlapOnBothAxisExcludingIds(
			mouseBoxBounds,
			entities,
			[this.singleToMoveId],
		)
		// const nearbyEntitiesOnAxis = findNearbyBoundOverlapOnBothAxis(mouseBoxBounds, entities)
		const nearbyLinesState = this._graphicsStore.state.nearbyLinesState
		const customEntity: CanvasEntity = {
			id: this.singleToMoveId,
			location: getTopLeftPointFromTransformedPoint(currentPoint, SizeByType[ENTITY_TYPE.Panel]),
			angle: entity.angle,
			type: ENTITY_TYPE.Panel,
			width: entity.width,
			height: entity.height,
		}
		// const graphicsSnapshot = this._graphicsStore.snapshot
		if (!nearbyEntitiesOnAxis.length || nearbyLinesState === 'NearbyLinesDisabled') {
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
				// console.log('no nearbyEntities')
				// const drawPreviewFn = getDefaultDrawPreviewCtxFn(mouseBoxBounds)

				// this.clearNearbyState()
			}
			this._render.renderCanvasApp({
				excludedEntityIds: [this.singleToMoveId],
				drawFns: [drawSingleToMove],
				customEntities: [customEntity],
			})
			// this._render.drawCanvasExcludeIdsWithFn([this.singleToMoveId], drawSingleToMove)
			// this._render.drawCanvasWithFunction(drawSingleToMove)
			return
		}

		// const anyNearClick = !!entities.find((entity) => isEntityOverlappingWithBounds(entity, mouseBoxBounds))

		const nearbySortedByDistance = sortBy(nearbyEntitiesOnAxis, (entity) =>
			Math.abs(entity.distance),
		)
		const nearby2dArray = groupInto2dArray(nearbySortedByDistance, 'axis')

		const closestNearby2dArray = nearby2dArray.map((arr) => arr[0])
		const closestEnt = closestNearby2dArray[0]

		// const gridLines = getEntityAxisGridLinesByAxisV2(closestEnt.bounds, closestEnt.axis)
		// const gridLineBounds = getBoundsFromArrPoints(gridLines)

		const axisPreviewRect = getCtxRectBoundsByAxisV2(
			closestEnt.bounds,
			closestEnt.axis,
			mouseBoxBounds,
		)
		this.currentAxis = closestEnt.axis
		this.axisRepositionPreviewRect = axisPreviewRect

		const holdAltToSnapToGrid = true
		// const holdAltToSnapToGrid = GraphicsSettings.HoldAltToSnapToGrid
		const altKey = event.altKey
		const isMovingExistingEntity = true

		const ctxFn = getNearbyLineDrawCtxFnFromNearbyLinesState(
			nearbyLinesState,
			axisPreviewRect,
			mouseBoxBounds,
			closestEnt,
			CANVAS_COLORS.HoveredPanelFillStyle,
			altKey,
			holdAltToSnapToGrid,
			isMovingExistingEntity,
		)

		this._render.renderCanvasApp({
			excludedEntityIds: [this.singleToMoveId],
			drawFns: [ctxFn],
			customEntities: [customEntity],
		})
		// this._render.drawCanvasExcludeIdsWithFn([this.singleToMoveId], ctxFn)
	}

	singleToMoveMouseUp(event: PointerEvent | boolean, currentPoint: TransformedPoint) {
		assertNotNull(this.singleToMoveId)
		const altKey = event instanceof PointerEvent ? event.altKey : false
		// const middleOf = getMiddleOfObjectFromEvent(event, ENTITY_TYPE.Panel)
		let location: {
			x: number
			y: number
		}
		if (this.axisRepositionPreviewRect && altKey) {
			location = {
				x: this.axisRepositionPreviewRect.left,
				y: this.axisRepositionPreviewRect.top,
			}
		} else {
			location = getTopLeftPointFromTransformedPoint(currentPoint, SizeByType[ENTITY_TYPE.Panel])
		}
		/*		const location = getTopLeftPointFromTransformedPoint(
		 currentPoint,
		 SizeByType[ENTITY_TYPE.Panel],
		 )*/
		// const location = this._domPoint.getTransformedPointToMiddleOfObjectFromEvent(event, ENTITY_TYPE.Panel)
		this._entities.panels.updatePanel({
			id: this.singleToMoveId,
			changes: {
				location,
			},
		})

		changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		this.singleToMoveId = undefined

		this._positioningStore.dispatch.stopMoving()
		// this._app.sendEvent({ type: 'StopSingleMove' })
		this._render.renderCanvasApp()
		// this._render.drawCanvas()
		return
	}

	multiSelectDraggingMouseDown(event: PointerEvent, multipleSelectedIds: string[]) {
		if (!event.shiftKey || !event.ctrlKey) return
		this.multipleToMoveIds = multipleSelectedIds
		this.multiToMoveStart = eventToEventPoint(event)
		// this.multiToMoveStart = currentPoint
		// this.multiToMoveStart = this._domPoint.getTransformedPointFromEvent(event)
		this._positioningStore.dispatch.startMovingMultipleEntities(multipleSelectedIds)
		// this._app.sendEvent({ type: 'StartMultipleMove' })
		// this._app.sendEvent(new StartMultipleMove())
	}

	setMultiSelectDraggingMouseMove(event: PointerEvent, multipleSelectedIds: string[]) {
		if (!multiSelectDraggingKeysDown(event)) return
		/*		if (!event.shiftKey || !event.ctrlKey) {
		 this.stopMultiSelectDragging(event)
		 return
		 }*/
		this.multipleToMoveIds = multipleSelectedIds
		this.multiToMoveStart = eventToEventPoint(event)
		// this.multiToMoveStart = currentPoint
		// this.multiToMoveStart = this._domPoint.getTransformedPointFromEvent(event)
		this._positioningStore.dispatch.startMovingMultipleEntities(multipleSelectedIds)
		// this._app.sendEvent({ type: 'StartMultipleMove' })
		// this._app.sendEvent(new StartMultipleMove())
	}

	multiSelectDraggingMouseMove(event: PointerEvent) {
		if (!multiSelectDraggingKeysDown(event)) {
			this.stopMultiSelectDragging(event)
			changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
			return
		}
		changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
		const multiToMoveStart = this.multiToMoveStart
		assertNotNull(multiToMoveStart)
		// const eventLocation = this._domPoint.getTransformedPointFromEvent(event)
		const eventLocation = eventToPointLocation(event)
		const scale = this._domPoint.scale
		const offset = {
			x: eventLocation.x - multiToMoveStart.x,
			y: eventLocation.y - multiToMoveStart.y,
		}
		offset.x = offset.x / scale
		offset.y = offset.y / scale

		const multipleToMoveIds = this.multipleToMoveIds
		const entities = this._entities.panels.getByIds(multipleToMoveIds)

		const updates = entities.map((entity) => {
			const location = entity.location
			const newLocation = {
				x: location.x + offset.x,
				y: location.y + offset.y,
			}
			return {
				...entity,
				location: newLocation,
			}
		})

		/*		const panelsInArea = this._state.entities.canvasEntities.getEntitiesByIds(
		 this._machine.ctx.selected.multipleSelectedIds,
		 )*/
		const selectionBoxBounds = getCompleteBoundsFromMultipleEntitiesWithPadding(updates, 10)

		const drawMultipleToMove = (ctx: CanvasRenderingContext2D) => {
			ctx.save()
			updates.forEach((entity) => {
				ctx.save()
				ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
				ctx.rotate(entity.angle)

				ctx.fillStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
				ctx.beginPath()
				ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
				ctx.fill()
				ctx.stroke()
				ctx.restore()
			})
			ctx.restore()

			/** Draw selection box */

			drawSelectionBoxBoundsCtxFn(selectionBoxBounds)(ctx)
			/*			ctx.save()
			 const { left, top, width, height } = selectionBoxBounds
			 ctx.strokeStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
			 ctx.lineWidth = 1
			 ctx.strokeRect(left, top, width, height)
			 ctx.restore()*/
		}

		// if (selectionBoxBounds) {

		this._render.renderCanvasApp({
			excludedEntityIds: multipleToMoveIds,
			drawFns: [drawMultipleToMove],
			shouldRenderSelectedEntitiesBox: false,
			shouldRenderSelectedStringBox: false,
		})
		// this._render.drawCanvasExcludeIdsWithFnEditSelectBox(multipleToMoveIds, drawMultipleToMove)
		// this._render.drawCanvasExcludeIdsWithFn(multipleToMoveIds, drawMultipleToMove)
		return
	}

	stopMultiSelectDragging(event: MouseEvent | Point) {
		const multiToMoveStart = this.multiToMoveStart
		assertNotNull(multiToMoveStart)
		const dragStopPoint = event instanceof MouseEvent ? eventToPointLocation(event) : event
		// if (event instanceof MouseEvent) {
		// 	const eventLocation = eventToPointLocation(event)
		// }
		const scale = this._domPoint.scale
		const offset = {
			x: dragStopPoint.x - multiToMoveStart.x,
			y: dragStopPoint.y - multiToMoveStart.y,
		}
		offset.x = offset.x / scale
		offset.y = offset.y / scale
		const multipleToMoveIds = this.multipleToMoveIds
		const entities = this._entities.panels.getByIds(multipleToMoveIds)
		const multiSelectedUpdated = entities.map((entity) => {
			const location = entity.location
			const newLocation = {
				x: location.x + offset.x,
				y: location.y + offset.y,
			}
			return updateObjectById(entity, { location: newLocation })
		})

		const storeUpdates = multiSelectedUpdated.map((entity) => {
			return EntityFactory.updateForStore(entity, { location: entity.location })
		})
		this._entities.panels.updateManyPanels(storeUpdates as UpdateStr<CanvasPanel>[])

		this._positioningStore.dispatch.stopMoving()
		// this._app.sendEvent({ type: 'StopMultipleMove' })

		// this._canvasElement.changeCursor('')
		changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		console.log('stopMultiSelectDragging changeCanvasCursor')

		this.multipleToMoveIds = []
		this.multiToMoveStart = undefined

		this._render.renderCanvasApp()
		// this._render.drawCanvas()
		return
	}

	resetObjectPositioning(event: PointerEvent, currentPoint: TransformedPoint) {
		if (this.multiToMoveStart) {
			this.stopMultiSelectDragging(event)
			this._positioningStore.dispatch.stopMoving()
			// this._app.sendEvent({ type: 'StopMultipleMove' })
		}
		if (this.singleToMoveId) {
			this.singleToMoveMouseUp(event, currentPoint)
			this._positioningStore.dispatch.stopMoving()
			// this._app.sendEvent({ type: 'StopSingleMove' })
		}

		this._canvasElement.changeCursor(CURSOR_TYPE.AUTO)
		this.singleToMoveId = undefined
		this.multipleToMoveIds = []
		this.multiToMoveStart = undefined
	}

	areAnyEntitiesNearbyExcludingGrabbed(point: TransformedPoint, grabbedId: string) {
		return !!this._entities.panels
			.allPanels()
			.find(
				(entity) => entity.id !== grabbedId && isPointInsideBounds(point, getEntityBounds(entity)),
			)
	}
}

// const isMultiDraggingKeysDown = (event: PointerEvent) => event.shiftKey && event.ctrlKey && event.altKey

// const entitiesNearPoint = (entity: CanvasPanel, grabbedId: string, point: TransformedPoint) => (entity:CanvasPanel) => entity.id !== grabbedId && isPointInsideBounds(point, getEntityBounds(entity))
