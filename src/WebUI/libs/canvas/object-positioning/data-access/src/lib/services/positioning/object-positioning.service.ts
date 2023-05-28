import { CanvasElementService } from '@canvas/app/data-access'
import { DomPointService } from '../dom-point'
import { GraphicsStoreService } from '@canvas/graphics/data-access'
import { getClosedEntityOnAxis, getSnapToGridBoolean } from '../nearby'
import { ObjectPositioningStoreService } from '../../store'
import { RenderService } from '@canvas/rendering/data-access'
import { inject, Injectable } from '@angular/core'
import { UpdateStr } from '@ngrx/entity/src/models'
import {
	Axis,
	CompleteEntityBounds,
	CURSOR_TYPE,
	EventPoint,
	Point,
	TransformedPoint,
} from '@shared/data-access/models'
import { assertNotNull, updateMany } from '@shared/utils'
import { isEqual } from 'lodash'
import { EntityStoreService } from '@entities/data-access'
import {
	changeCanvasCursor,
	eventToEventPoint,
	eventToPointLocation,
	findNearbyBoundOverlapOnBothAxisExcludingIds,
	getCompleteBoundsFromCenterTransformedPoint,
	getCtxRectBoundsByAxisV2,
	getEntityBounds,
	getTopLeftPointFromTransformedPoint,
	isEntityOverlappingWithBounds,
	isHoldingClick,
	isPointInsideBounds,
	multiSelectDraggingKeysDown,
} from '@canvas/utils'
import {
	CanvasEntity,
	ENTITY_TYPE,
	getEntitySize,
	PanelId,
	PanelModel,
	SizeByType,
} from '@entities/shared'

@Injectable({
	providedIn: 'root',
})
export class ObjectPositioningService {
	private _entities = inject(EntityStoreService)
	private _domPoint = inject(DomPointService)
	private _render = inject(RenderService)
	private _canvasElement = inject(CanvasElementService)
	private _graphicsStore = inject(GraphicsStoreService)
	private _positioningStore = inject(ObjectPositioningStoreService)
	singleToMoveId: string | undefined
	multiToMoveStart: EventPoint | undefined
	multipleToMoveIds: string[] = []

	currentAxis: Axis | undefined
	axisRepositionPreviewRect: CompleteEntityBounds | undefined

	get canvas() {
		return this._canvasElement.canvas
	}

	get canvasV2() {
		return document.getElementById('canvas') as HTMLCanvasElement
	}

	setSingleToMoveEntity(event: PointerEvent | TouchEvent, singleToMoveId: string) {
		this.singleToMoveId = singleToMoveId
		this._positioningStore.dispatch.startMovingSingleEntity(singleToMoveId)
		changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
	}

	singleEntityToMoveMouseMove(event: PointerEvent | TouchEvent, currentPoint: TransformedPoint) {
		if (event instanceof PointerEvent) {
			if (!isHoldingClick(event)) {
				this.singleEntityToMoveMouseUp(event, currentPoint)
				return
			}
		}
		assertNotNull(this.singleToMoveId)
		const isSpotTaken = this.areAnyEntitiesNearbyExcludingGrabbed(currentPoint, this.singleToMoveId)
		if (isSpotTaken) {
			if (!this._positioningStore.state.toMoveSpotTaken) {
				this._positioningStore.dispatch.setToMoveSpotTaken()
			}
		} else {
			if (this._positioningStore.state.toMoveSpotTaken) {
				this._positioningStore.dispatch.setToMoveSpotFree()
			}
		}
		const entity = this._entities.panels.getById(this.singleToMoveId)
		assertNotNull(entity)

		const size = getEntitySize(entity)
		const mouseBounds = getCompleteBoundsFromCenterTransformedPoint(currentPoint, size)
		const entities = this._entities.panels.allPanels
		const nearbyEntitiesOnAxis = findNearbyBoundOverlapOnBothAxisExcludingIds(
			mouseBounds,
			entities,
			[this.singleToMoveId],
		)

		const nearbyLinesState = this._graphicsStore.state.nearbyLinesState
		const customEntity: PanelModel = {
			...entity,
			id: this.singleToMoveId as PanelId,
			location: getTopLeftPointFromTransformedPoint(currentPoint, SizeByType[ENTITY_TYPE.Panel]),
		}
		if (!nearbyEntitiesOnAxis.length || nearbyLinesState === 'NearbyLinesDisabled') {
			this._render.renderCanvasApp({
				customPanels: [customEntity],
				singleToMoveId: this.singleToMoveId,
				singleToMovePanel: customEntity,
			})
			return
		}

		/*		const nearbySortedByDistance = sortBy(nearbyEntitiesOnAxis, (entity) =>
		 Math.abs(entity.distance),
		 )
		 const nearby2dArray = groupInto2dArray(nearbySortedByDistance, 'axis')

		 const closestNearby2dArray = nearby2dArray.map((arr) => arr[0])*/
		const closestEntity = getClosedEntityOnAxis(nearbyEntitiesOnAxis)
		// const closestEntity = closestNearby2dArray[0]

		const axisPreviewRect = getCtxRectBoundsByAxisV2(
			closestEntity.bounds,
			closestEntity.axis,
			mouseBounds,
		)
		this.currentAxis = closestEntity.axis
		this.axisRepositionPreviewRect = axisPreviewRect

		const holdAltToSnapToGrid = true
		const altKey = event.altKey

		const snapToGridBool = getSnapToGridBoolean(
			altKey,
			mouseBounds,
			closestEntity.axis,
			axisPreviewRect,
			holdAltToSnapToGrid,
		)

		this._render.renderCanvasApp({
			customPanels: [customEntity],
			singleToMoveId: this.singleToMoveId,
			singleToMovePanel: customEntity,
			nearby: {
				axisPreviewRect,
				mouseBounds,
				closestEntity,
				snapToGridBool,
				entityToMove: customEntity,
			},
		})
	}

	singleEntityToMoveMouseUp(
		event: PointerEvent | TouchEvent | boolean,
		currentPoint: TransformedPoint,
	) {
		assertNotNull(this.singleToMoveId)

		if (this._positioningStore.state.toMoveSpotTaken) {
			this._positioningStore.dispatch.stopMoving()
			return
		}

		const altKey = event instanceof PointerEvent ? event.altKey : false

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

		this._entities.panels.updatePanel({
			id: this.singleToMoveId,
			changes: {
				location,
			},
		})

		changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
		this.singleToMoveId = undefined

		this._positioningStore.dispatch.stopMoving()
		this._render.renderCanvasApp()
		return
	}

	multipleEntitiesToMoveMouseDown(event: PointerEvent, multipleSelectedIds: string[]) {
		if (!event.shiftKey || !event.ctrlKey) return
		this.multipleToMoveIds = multipleSelectedIds
		this.multiToMoveStart = eventToEventPoint(event)
		this._positioningStore.dispatch.startMovingMultipleEntities(multipleSelectedIds)
	}

	setMultipleEntitiesToMove(event: PointerEvent, multipleSelectedIds: string[]) {
		if (!multiSelectDraggingKeysDown(event)) return
		this.multipleToMoveIds = multipleSelectedIds
		this.multiToMoveStart = eventToEventPoint(event)
		this._positioningStore.dispatch.startMovingMultipleEntities(multipleSelectedIds)
	}

	multipleEntitiesToMoveMouseMove(event: PointerEvent) {
		if (!multiSelectDraggingKeysDown(event)) {
			this.stopMultipleEntitiesToMove(event)
			// changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
			return
		}
		// changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
		const multiToMoveStart = this.multiToMoveStart
		assertNotNull(multiToMoveStart)
		const eventLocation = eventToPointLocation(event)
		const scale = this._domPoint.scale
		const offset = {
			x: (eventLocation.x - multiToMoveStart.x) / scale,
			y: (eventLocation.y - multiToMoveStart.y) / scale,
		}

		const multipleToMoveIds = this.multipleToMoveIds
		const entities = this._entities.panels.getByIds(multipleToMoveIds)

		const updates = entities.map((entity) => ({
			...entity,
			location: {
				x: entity.location.x + offset.x,
				y: entity.location.y + offset.y,
			},
		}))

		const isSpotTaken = this.areAnyEntitiesNearbyExcludingMultipleGrabbed(updates)
		const spotTakenIds = isSpotTaken.map((entity) => entity.id)
		if (spotTakenIds.length > 0) {
			if (!this._positioningStore.state.toMoveSpotTaken) {
				this._positioningStore.dispatch.setToMoveSpotTaken()
			}
			if (
				this._positioningStore.state.toMoveMultipleSpotTakenIds.length === 0 ||
				!isEqual(this._positioningStore.state.toMoveMultipleSpotTakenIds, spotTakenIds)
			) {
				this._positioningStore.dispatch.setMultipleMovingSpotsTaken(spotTakenIds)
			}
		} else {
			if (this._positioningStore.state.toMoveSpotTaken) {
				this._positioningStore.dispatch.setToMoveSpotFree()
			}
			if (this._positioningStore.state.toMoveMultipleSpotTakenIds.length > 0) {
				this._positioningStore.dispatch.clearMultipleMovingSpotsTaken()
			}
		}

		this._render.renderCanvasApp({
			// excludedEntityIds: multipleToMoveIds,
			// drawFns: [drawMultipleToMove],
			multipleToMoveIds,
			multipleToMovePanels: updates,
			multipleToMoveSpotsTakenIds: spotTakenIds,
			customPanels: updates,
			shouldRenderSelectedEntitiesBox: false,
			shouldRenderSelectedStringBox: false,
		})
		return
	}

	stopMultipleEntitiesToMove(event: MouseEvent | Point) {
		if (this._positioningStore.state.toMoveMultipleSpotTakenIds.length > 0) {
			this._positioningStore.dispatch.stopMoving()
			return
		}
		const multiToMoveStart = this.multiToMoveStart
		assertNotNull(multiToMoveStart)
		const dragStopPoint = event instanceof MouseEvent ? eventToPointLocation(event) : event
		const scale = this._domPoint.scale
		const offset = {
			x: (dragStopPoint.x - multiToMoveStart.x) / scale,
			y: (dragStopPoint.y - multiToMoveStart.y) / scale,
		}
		const entities = this._entities.panels.getByIds(this.multipleToMoveIds)
		const multiSelectedUpdated = entities.map((entity) => ({
			...entity,
			location: {
				x: entity.location.x + offset.x,
				y: entity.location.y + offset.y,
			},
		}))

		const storeUpdates = updateMany(multiSelectedUpdated, 'location')
		this._entities.panels.updateManyPanels(storeUpdates as UpdateStr<PanelModel>[])

		this._positioningStore.dispatch.stopMoving()

		this.multipleToMoveIds = []
		this.multiToMoveStart = undefined

		this._render.renderCanvasApp()
		return
	}

	resetObjectPositioning(event: PointerEvent, currentPoint: TransformedPoint) {
		if (this.multiToMoveStart) {
			this.stopMultipleEntitiesToMove(event)
			this._positioningStore.dispatch.stopMoving()
		}
		if (this.singleToMoveId) {
			this.singleEntityToMoveMouseUp(event, currentPoint)
			this._positioningStore.dispatch.stopMoving()
		}

		this._canvasElement.changeCursor(CURSOR_TYPE.AUTO)
		this.singleToMoveId = undefined
		this.multipleToMoveIds = []
		this.multiToMoveStart = undefined
	}

	areAnyEntitiesNearbyExcludingGrabbed(point: TransformedPoint, grabbedId: string) {
		return !!this._entities.panels.allPanels.find(
			(entity) => entity.id !== grabbedId && isPointInsideBounds(point, getEntityBounds(entity)),
		)
	}

	areAnyEntitiesNearbyExcludingMultipleGrabbed(updatedEntities: CanvasEntity[]) {
		const grabbedIds = updatedEntities.map((entity) => entity.id)
		const panelsExceptGrabbed = this._entities.panels.allPanels.filter(
			(entity) => !grabbedIds.includes(entity.id),
		)

		return updatedEntities.filter((entity) =>
			panelsExceptGrabbed.find((panel) =>
				isEntityOverlappingWithBounds(entity, getEntityBounds(panel)),
			),
		)
	}
}
