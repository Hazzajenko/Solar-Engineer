import { AppSnapshot, AppStoreService } from '../app'
import { CanvasElementService } from '../div-elements'
import { DomPointService } from '../dom-point'
import { EntityStoreService } from '../entities'
import { GraphicsStateSnapshot } from '../graphics'
import { GraphicsSettings } from '../graphics/graphics.settings'
import { getNearbyLineDrawCtxFnFromGraphicsSnapshot } from '../nearby'
import { RenderService } from '../render'
import { drawSelectionBoxBoundsCtxFn } from './draw-selection-box'
import { inject, Injectable } from '@angular/core'
import {
	Axis,
	CANVAS_COLORS,
	CanvasPanel,
	CompleteEntityBounds,
	ENTITY_TYPE,
	EventPoint,
	SizeByType,
	TransformedPoint,
} from '@design-app/shared'
import {
	changeCanvasCursor,
	EntityFactory,
	eventToEventPoint,
	eventToPointLocation,
	findNearbyBoundOverlapOnBothAxisExcludingIds,
	getBoundsFromArrPoints,
	getCompleteBoundsFromCenterTransformedPoint,
	getCompleteBoundsFromMultipleEntitiesWithPadding,
	getCtxRectBoundsByAxisV2,
	getEntityAxisGridLinesByAxisV2,
	getEntityBounds,
	getTopLeftPointFromTransformedPoint,
	isHoldingClick,
	isPointInsideBounds,
	updateObjectById,
} from '@design-app/utils'
import { UpdateStr } from '@ngrx/entity/src/models'
import { CURSOR_TYPE, Point } from '@shared/data-access/models'
import { assertNotNull, groupInto2dArray } from '@shared/utils'
import { sortBy } from 'lodash'

@Injectable({
	providedIn: 'root',
})
export class ObjectPositioningService {
	private _entities = inject(EntityStoreService)
	private _domPoint = inject(DomPointService)
	private _render = inject(RenderService)
	// private _render = inject(CanvasRenderService)
	private _canvasElement = inject(CanvasElementService)
	private _app = inject(AppStoreService)
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
		this._app.sendEvent({ type: 'StartSingleMove' })
		// this._app.sendEvent(new StartSingleMove())
	}

	singleToMoveMouseMove(
		event: PointerEvent,
		currentPoint: TransformedPoint,
		appSnapshot: AppSnapshot,
		graphicsSnapshot: GraphicsStateSnapshot,
	) {
		if (!isHoldingClick(event)) {
			this._app.sendEvent({ type: 'StopSingleMove' })
			// this._app.sendEvent(new StopSingleMove())
			this.singleToMoveId = undefined
			return
		}
		assertNotNull(this.singleToMoveId)
		changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
		// const eventPoint = this._domPoint.getTransformedPointFromEvent(event)
		// const currentPoint = this._domPoint.getTransformedPointFromEvent(event)
		const isSpotTaken = this.areAnyEntitiesNearbyExcludingGrabbed(currentPoint, this.singleToMoveId)
		if (isSpotTaken) {
			changeCanvasCursor(this.canvas, CURSOR_TYPE.CROSSHAIR)
			// TODO - implement red box
			// this.canvas.style.cursor = CURSOR_TYPE.CROSSHAIR
			// changeCanvasCursor(this.canvas, CURSOR_TYPE.CROSSHAIR)
			// return
		} else {
			changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
		}
		const location = getTopLeftPointFromTransformedPoint(
			currentPoint,
			SizeByType[ENTITY_TYPE.Panel],
		)
		const entity = this._entities.panels.getEntityById(this.singleToMoveId)
		assertNotNull(entity)

		const size = SizeByType[ENTITY_TYPE.Panel]
		const mouseBoxBounds = getCompleteBoundsFromCenterTransformedPoint(currentPoint, size)
		const entities = this._entities.panels.getEntities()
		const nearbyEntitiesOnAxis = findNearbyBoundOverlapOnBothAxisExcludingIds(
			mouseBoxBounds,
			entities,
			[this.singleToMoveId],
		)
		// const nearbyEntitiesOnAxis = findNearbyBoundOverlapOnBothAxis(mouseBoxBounds, entities)

		if (!nearbyEntitiesOnAxis.length) {
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

		const gridLines = getEntityAxisGridLinesByAxisV2(closestEnt.bounds, closestEnt.axis)
		const gridLineBounds = getBoundsFromArrPoints(gridLines)

		const axisPreviewRect = getCtxRectBoundsByAxisV2(
			closestEnt.bounds,
			closestEnt.axis,
			mouseBoxBounds,
		)
		this.currentAxis = closestEnt.axis
		this.axisRepositionPreviewRect = axisPreviewRect

		const holdAltToSnapToGrid = GraphicsSettings.HoldAltToSnapToGrid
		const altKey = event.altKey
		const isMovingExistingEntity = true

		const ctxFn = getNearbyLineDrawCtxFnFromGraphicsSnapshot(
			graphicsSnapshot,
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
		this._entities.panels.updateEntity(this.singleToMoveId, { location })

		changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		this.singleToMoveId = undefined

		this._app.sendEvent({ type: 'StopSingleMove' })
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
		this._app.sendEvent({ type: 'StartMultipleMove' })
		// this._app.sendEvent(new StartMultipleMove())
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
		this._app.sendEvent({ type: 'StartMultipleMove' })
		// this._app.sendEvent(new StartMultipleMove())
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
			x: eventLocation.x - multiToMoveStart.x,
			y: eventLocation.y - multiToMoveStart.y,
		}
		offset.x = offset.x / scale
		offset.y = offset.y / scale

		const multipleToMoveIds = this.multipleToMoveIds
		const entities = this._entities.panels.getEntitiesByIds(multipleToMoveIds)

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
		const entities = this._entities.panels.getEntitiesByIds(multipleToMoveIds)
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
		this._entities.panels.updateManyEntities(storeUpdates as UpdateStr<CanvasPanel>[])

		this._app.sendEvent({ type: 'StopMultipleMove' })

		this._canvasElement.changeCursor('')

		this.multipleToMoveIds = []
		this.multiToMoveStart = undefined

		this._render.renderCanvasApp()
		// this._render.drawCanvas()
		return
	}

	resetObjectPositioning(event: PointerEvent, currentPoint: TransformedPoint) {
		if (this.multiToMoveStart) {
			this.stopMultiSelectDragging(event)
			this._app.sendEvent({ type: 'StopMultipleMove' })
		}
		if (this.singleToMoveId) {
			this.singleToMoveMouseUp(event, currentPoint)
			this._app.sendEvent({ type: 'StopSingleMove' })
		}

		this._canvasElement.changeCursor(CURSOR_TYPE.AUTO)
		this.singleToMoveId = undefined
		this.multipleToMoveIds = []
		this.multiToMoveStart = undefined
	}

	areAnyEntitiesNearbyExcludingGrabbed(point: TransformedPoint, grabbedId: string) {
		return !!this._entities.panels
			.getEntities()
			.find(
				(entity) => entity.id !== grabbedId && isPointInsideBounds(point, getEntityBounds(entity)),
			)
	}
}

// const entitiesNearPoint = (entity: CanvasPanel, grabbedId: string, point: TransformedPoint) => (entity:CanvasPanel) => entity.id !== grabbedId && isPointInsideBounds(point, getEntityBounds(entity))