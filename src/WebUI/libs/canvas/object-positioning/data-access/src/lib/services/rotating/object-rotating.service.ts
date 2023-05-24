import { ObjectPositioningStoreService } from '../../store'
import { RenderService } from '@canvas/rendering/data-access'
import { SelectedStoreService } from '@canvas/selected/data-access'
import { inject, Injectable } from '@angular/core'
import { Dictionary } from '@ngrx/entity'
import { UpdateStr } from '@ngrx/entity/src/models'
import {
	AngleRadians,
	Point,
	TransformedPoint,
	TrigonometricBounds,
} from '@shared/data-access/models'
import { assertNotNull } from '@shared/utils'
import { EntityStoreService } from '@entities/data-access'
import {
	getAngleInRadiansBetweenTwoPoints,
	getCommonEntityTrigonometricBounds,
	rotatePointOffPivot,
	rotatingKeysDown,
	updateObjectByIdForStore,
} from '@canvas/utils'
import { PanelModel, SizeByType } from '@entities/shared'

@Injectable({
	providedIn: 'root',
})
export class ObjectRotatingService {
	private _entities = inject(EntityStoreService)
	// private _entities = inject(EntityStoreService)
	private _render = inject(RenderService)
	// private _app = inject(AppStoreService)
	private _positioningStore = inject(ObjectPositioningStoreService)
	private _selectedStore = inject(SelectedStoreService)

	singleToRotateId: string | undefined = undefined
	singleToRotateStartPoint: TransformedPoint | undefined = undefined
	singleToRotateStartAngle: AngleRadians | undefined = undefined
	singleToRotateRecentAngle: AngleRadians | undefined = undefined

	multipleToRotateIds: string[] = []
	multipleToRotateLocationDictionary: Dictionary<Point> = {}
	multipleToRotateAngleDictionary: Dictionary<AngleRadians> = {}
	multipleToRotatePivotPoint: Point | undefined = undefined
	multipleToRotateStartToPivotAngle: AngleRadians | undefined = undefined

	initialSelectionBoxBounds: TrigonometricBounds | undefined

	centerPoint: Point | undefined = undefined

	handleSetEntitiesToRotate(event: PointerEvent, currentPoint: TransformedPoint) {
		const multiSelectIds = this._selectedStore.state.multipleSelectedEntityIds
		// const multiSelectIds = this._app.selectedCtx.multipleSelectedIds
		// const selectedId = this._machine.appCtx.selected.singleSelectedId
		// const selectedId = this._state.selected.singleSelectedId
		if (multiSelectIds.length === 1) {
			// const transformedPoint = this._domPoint.getTransformedPointFromEvent(event)
			this.setEntityToRotate(multiSelectIds[0], currentPoint)
			return
		}
		// const multiSelectIds = this._machine.appCtx.selected.multipleSelectedIds
		// const multiSelectIds = this._state.selected.multipleSelectedIds
		if (multiSelectIds.length > 1) {
			// const transformedPoint = this._domPoint.getTransformedPointFromEvent(event)
			this.setMultipleToRotate(multiSelectIds, currentPoint)
			return
		}
	}

	setEntityToRotate(entityId: string, startPoint: TransformedPoint) {
		const location = this._entities.panels.getById(entityId)?.location
		assertNotNull(location)
		const startAngle = getAngleInRadiansBetweenTwoPoints(startPoint, location)
		this.singleToRotateId = entityId
		this.singleToRotateStartPoint = startPoint
		this.singleToRotateStartAngle = startAngle
		this._positioningStore.dispatch.startRotatingSingleEntity(entityId)
		// this._app.sendEvent({ type: 'StartSingleRotate' })
		// this._app.sendEvent(new StartSingleRotate())
		/*		this._state.updateState({
		 toRotate: {
		 singleToRotate: {
		 id: entityId, startPoint, startAngle,
		 },
		 },
		 })*/
	}

	rotateEntityViaMouse(event: PointerEvent, rotateMode: boolean, currentPoint: TransformedPoint) {
		if (!rotatingKeysDown(event) && !rotateMode) {
			// return
			this.clearEntityToRotate()
			return
		}
		const singleToRotateId = this.singleToRotateId
		const singleToRotateStartPoint = this.singleToRotateStartPoint
		const singleToRotateStartAngle = this.singleToRotateStartAngle
		if (!singleToRotateId || !singleToRotateStartPoint || !singleToRotateStartAngle) {
			throw new Error('No entity to rotate')
		}
		// const currentPoint = this._domPoint.getTransformedPointFromEvent(event)
		const entityLocation = this._entities.panels.getById(singleToRotateId)?.location
		assertNotNull(entityLocation)
		const previousAngle = singleToRotateStartAngle
		const radians = getAngleInRadiansBetweenTwoPoints(currentPoint, entityLocation)
		const angle = (radians - previousAngle) as AngleRadians
		this.singleToRotateRecentAngle = angle

		const entity = this._entities.panels.getById(singleToRotateId)
		assertNotNull(entity)
		/*
		 const singleRotateDrawFn = (ctx: CanvasRenderingContext2D) => {
		 ctx.save()
		 ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
		 ctx.rotate(angle)
		 ctx.fillStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
		 ctx.beginPath()
		 ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
		 ctx.fill()
		 ctx.stroke()
		 ctx.restore()
		 }*/

		const customPanel = {
			...entity,
			angle,
		} as PanelModel

		this._render.renderCanvasApp({
			singleToRotateId,
			singleToRotatePanel: customPanel,
			customPanels: [customPanel], // excludedEntityIds: [singleToRotateId],
			// drawFns: [singleRotateDrawFn],
		})
		/*		this._render.renderCanvasApp({
		 excludedEntityIds: [singleToRotateId],
		 drawFns: [singleRotateDrawFn],
		 })*/
		// this._render.drawCanvasExcludeIdsWithFn([singleToRotateId], singleRotateDrawFn)
	}

	setMultipleToRotate(multipleToRotateIds: string[], startPoint: TransformedPoint) {
		const entities = this._entities.panels.getByIds(multipleToRotateIds)
		const entityLocations = entities.map((e) => e.location)
		const [minX, minY, maxX, maxY] = getCommonEntityTrigonometricBounds(entities)
		const centerX = (minX + maxX) / 2
		const centerY = (minY + maxY) / 2
		const centerPoint = { x: centerX, y: centerY }
		this.centerPoint = centerPoint

		this.multipleToRotateIds = multipleToRotateIds
		const startToPivotAngle = getAngleInRadiansBetweenTwoPoints(startPoint, centerPoint)
		this.multipleToRotateIds = multipleToRotateIds
		this.multipleToRotatePivotPoint = centerPoint
		console.log('this.multipleToRotatePivotPoint', this.multipleToRotatePivotPoint)
		this.multipleToRotateStartToPivotAngle = startToPivotAngle
		this._positioningStore.dispatch.startRotatingMultipleEntities(multipleToRotateIds)
		// this._app.sendEvent({ type: 'StartMultipleRotate' })
	}

	rotateMultipleEntitiesViaMouse(event: PointerEvent, currentPoint: TransformedPoint) {
		this.rotateMultipleEntitiesViaMouseViaEntityTransform(event, currentPoint)
	}

	rotateMultipleEntitiesViaMouseViaEntityTransform(
		event: PointerEvent,
		currentPoint: TransformedPoint,
	) {
		if (!rotatingKeysDown(event)) {
			this.clearEntityToRotate()
			return
		}
		assertNotNull(this.centerPoint)
		const multipleToRotateIds = this.multipleToRotateIds
		if (!multipleToRotateIds.length) throw new Error('No entities to rotate')

		const pivotPoint = this.multipleToRotatePivotPoint
		const startToPivotAngle = this.multipleToRotateStartToPivotAngle

		if (!pivotPoint || !startToPivotAngle) throw new Error('No pivot point or start to pivot angle')

		const angleInRadians = getAngleInRadiansBetweenTwoPoints(currentPoint, pivotPoint)
		const canvasEntities = this._entities.panels.getByIds(multipleToRotateIds)
		assertNotNull(startToPivotAngle)
		const adjustedAngle = (angleInRadians - startToPivotAngle) as AngleRadians
		const entities = canvasEntities.map((entity) => {
			const entityAdjustedAngle = (entity.angle + adjustedAngle) as AngleRadians
			const getPos = rotatePointOffPivot(entity.location, pivotPoint, adjustedAngle)
			this.multipleToRotateLocationDictionary[entity.id] = getPos
			this.multipleToRotateAngleDictionary[entity.id] = entityAdjustedAngle
			const { width, height } = SizeByType[entity.type]
			return {
				...entity,
				id: entity.id,
				location: getPos,
				angle: entityAdjustedAngle,
				width,
				height,
			}
		})
		/*
		 const multipleRotateDrawFn = (ctx: CanvasRenderingContext2D) => {
		 ctx.save()

		 entities.forEach((entity) => {
		 const angle = entity.angle
		 const location = entity.location
		 assertNotNull(angle)
		 assertNotNull(location)

		 ctx.save()
		 // ctx.translate(location.x, location.y)
		 ctx.translate(location.x + entity.width / 2, location.y + entity.height / 2)
		 ctx.rotate(angle)

		 ctx.beginPath()
		 // ctx.rect(0, 0, entity.width, entity.height)
		 ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
		 ctx.fill()
		 ctx.stroke()
		 ctx.restore()
		 })

		 ctx.restore()
		 }*/

		this._render.renderCanvasApp({
			multipleToRotateIds,
			multipleToRotatePanels: entities,
			customPanels: entities,
			shouldRenderSelectedEntitiesBox: false,
			shouldRenderSelectedStringBox: false,
		})

		/*		this._render.renderCanvasApp({
		 excludedEntityIds: multipleToRotateIds,
		 drawFns: [multipleRotateDrawFn],
		 shouldRenderSelectedEntitiesBox: false,
		 shouldRenderSelectedStringBox: false,
		 })*/
	}

	calculatePivotPointPosition(multipleToRotateIds: string[]) {
		const entities = this._entities.panels.getByIds(multipleToRotateIds)
		assertNotNull(entities)
		const totalX = entities.reduce((acc, entity) => acc + entity.location.x, 0)
		const totalY = entities.reduce((acc, entity) => acc + entity.location.y, 0)
		const pivotX = totalX / entities.length
		const pivotY = totalY / entities.length
		return { x: pivotX, y: pivotY } as Point
	}

	clearSingleToRotate() {
		const singleToRotateId = this.singleToRotateId
		if (singleToRotateId) {
			const angle = this.singleToRotateRecentAngle
			assertNotNull(angle)

			this._entities.panels.updatePanel({
				// this._entities.panels.dispatch.updatePanel({
				id: singleToRotateId,
				changes: { angle },
			})
			this._positioningStore.dispatch.stopRotating()
			// this._app.sendEvent({ type: 'StopSingleRotate' })
		}

		this.singleToRotateId = undefined
		this.singleToRotateStartAngle = undefined
		this.singleToRotateStartPoint = undefined
		this.singleToRotateRecentAngle = undefined

		this._render.renderCanvasApp()
		// this._render.drawCanvas()
	}

	clearMultipleToRotate() {
		const multipleToRotateIds = this.multipleToRotateIds
		if (multipleToRotateIds.length) {
			const storeUpdates = multipleToRotateIds.map((id) => {
				const location = this.multipleToRotateLocationDictionary[id]
				const angle = this.multipleToRotateAngleDictionary[id]
				assertNotNull(location)
				assertNotNull(angle)

				return updateObjectByIdForStore(id, { location, angle })
			})
			this._entities.panels.updateManyPanels(storeUpdates as UpdateStr<PanelModel>[])
			this._positioningStore.dispatch.stopRotating()
			// this._app.sendEvent({ type: 'StopMultipleRotate' })
		}

		this.multipleToRotateIds = []
		this.multipleToRotatePivotPoint = undefined
		this.multipleToRotateStartToPivotAngle = undefined
		this.multipleToRotateLocationDictionary = {}
		this.multipleToRotateAngleDictionary = {}

		this._render.renderCanvasApp()
		// this._render.drawCanvas()
	}

	clearEntityToRotate() {
		const singleToRotateId = this.singleToRotateId
		if (singleToRotateId) {
			const angle = this.singleToRotateRecentAngle
			assertNotNull(angle)
			this._entities.panels.updatePanel({
				id: singleToRotateId,
				changes: { angle },
			})
			this._positioningStore.dispatch.stopRotating()
			// this._app.sendEvent({ type: 'StopSingleRotate' })
		}

		const multipleToRotateIds = this.multipleToRotateIds
		if (multipleToRotateIds.length) {
			const storeUpdates = multipleToRotateIds.map((id) => {
				const location = this.multipleToRotateLocationDictionary[id]
				const angle = this.multipleToRotateAngleDictionary[id]
				assertNotNull(location)
				assertNotNull(angle)

				return updateObjectByIdForStore(id, { location, angle })
			})
			this._entities.panels.updateManyPanels(storeUpdates as UpdateStr<PanelModel>[])
			this._positioningStore.dispatch.stopRotating()
			// this._app.sendEvent({ type: 'StopMultipleRotate' })
		}

		this.singleToRotateId = undefined
		this.singleToRotateStartAngle = undefined
		this.singleToRotateStartPoint = undefined
		this.singleToRotateRecentAngle = undefined

		this.multipleToRotateIds = []
		this.multipleToRotatePivotPoint = undefined
		this.multipleToRotateStartToPivotAngle = undefined
		this.multipleToRotateLocationDictionary = {}
		this.multipleToRotateAngleDictionary = {}

		this.initialSelectionBoxBounds = undefined

		this._render.renderCanvasApp()
		// this._render.drawCanvas()
	}
}
