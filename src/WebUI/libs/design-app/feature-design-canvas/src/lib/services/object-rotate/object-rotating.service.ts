import { inject, Injectable } from '@angular/core'
import {
	AngleRadians,
	CANVAS_COLORS,
	CanvasClientStateService,
	CanvasRenderService,
	DomPointService,
	drawSelectionBoxBoundsCtxFnWithTranslateRotate,
	getAngleInRadiansBetweenTwoPoints,
	getCommonEntityTrigonometricBounds,
	MachineService,
	rotatePointOffPivot,
	rotatingKeysDown,
	SizeByType,
	StartMultipleRotate,
	StartSingleRotate,
	StopMultipleRotate,
	StopSingleRotate,
	TransformedPoint,
	TrigonometricBounds,
	updateObjectByIdForStore,
} from '@design-app/feature-design-canvas'
import { Dictionary } from '@ngrx/entity'
import { Point } from '@shared/data-access/models'
import { assertNotNull } from '@shared/utils'


@Injectable({
	providedIn: 'root',
})
export class ObjectRotatingService {
	private _state = inject(CanvasClientStateService)
	private _render = inject(CanvasRenderService)
	private _domPoint = inject(DomPointService)
	private _machine = inject(MachineService)

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

	initialDistanceFromCenter:
		| {
				x: number
				y: number
		  }
		| undefined = undefined

	handleSetEntitiesToRotate(event: PointerEvent, currentPoint: TransformedPoint) {
		const multiSelectIds = this._machine.selectedCtx.multipleSelectedIds
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
		const location = this._state.entities.canvasEntities.getEntityById(entityId)?.location
		assertNotNull(location)
		const startAngle = getAngleInRadiansBetweenTwoPoints(startPoint, location)
		this.singleToRotateId = entityId
		this.singleToRotateStartPoint = startPoint
		this.singleToRotateStartAngle = startAngle
		this._machine.sendEvent(new StartSingleRotate())
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
		const entityLocation =
			this._state.entities.canvasEntities.getEntityById(singleToRotateId)?.location
		assertNotNull(entityLocation)
		const previousAngle = singleToRotateStartAngle
		const radians = getAngleInRadiansBetweenTwoPoints(currentPoint, entityLocation)
		const angle = (radians - previousAngle) as AngleRadians
		this.singleToRotateRecentAngle = angle

		const entity = this._state.entities.canvasEntities.getEntityById(singleToRotateId)
		assertNotNull(entity)

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
		}

		this._render.drawCanvasExcludeIdsWithFn([singleToRotateId], singleRotateDrawFn)
	}

	setMultipleToRotate(multipleToRotateIds: string[], startPoint: TransformedPoint) {
		const entities = this._state.entities.canvasEntities.getEntitiesByIds(multipleToRotateIds)
		const entityLocations = entities.map((e) => e.location)
		const [minX, minY, maxX, maxY] = getCommonEntityTrigonometricBounds(entities)
		const centerX = (minX + maxX) / 2
		const centerY = (minY + maxY) / 2
		const centerPoint = { x: centerX, y: centerY }
		this.centerPoint = centerPoint

		this.multipleToRotateIds = multipleToRotateIds
		// const centerAngle =
		// 	(5 * Math.PI) / 2 + Math.atan2(startPoint.y - centerY, startPoint.x - centerX)

		// const pivotPoint = calculatePivotPointPositionFromPoints(entityLocations)
		const startToPivotAngle = getAngleInRadiansBetweenTwoPoints(startPoint, centerPoint)
		this.multipleToRotateIds = multipleToRotateIds
		this.multipleToRotatePivotPoint = centerPoint
		console.log('this.multipleToRotatePivotPoint', this.multipleToRotatePivotPoint)
		this.multipleToRotateStartToPivotAngle = startToPivotAngle
		this._machine.sendEvent(new StartMultipleRotate())
	}

	rotateMultipleEntitiesViaMouse(event: PointerEvent, currentPoint: TransformedPoint) {
		/*		assertNotNull(this.multipleToRotateIds)
		 assertNotNull(this.multipleToRotatePivotPoint)
		 assertNotNull(this.multipleToRotateStartToPivotAngle)
		 assertNotNull(this.initialSelectionBoxBounds)

		 const ctxFn = rotateMultipleEntitiesViaMouseViaRotatingPivot2(
		 this._state.entities.canvasEntities.getEntities(),
		 this.multipleToRotatePivotPoint,
		 this.multipleToRotateStartToPivotAngle,
		 currentPoint,
		 this.initialSelectionBoxBounds,
		 )

		 this._render.drawCanvasExcludeIdsWithFnEditSelectBox(this.multipleToRotateIds, ctxFn)*/
		// this.rotateMultipleEntitiesViaMouseViaRotatingPivot(event, currentPoint)
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
		// const { x: centerX, y: centerY } = this.centerPoint
		// const { x: pointerX, y: pointerY } = currentPoint
		// const centerAngle = (5 * Math.PI) / 2 + Math.atan2(pointerY - centerY, pointerX - centerX)
		const multipleToRotateIds = this.multipleToRotateIds
		if (!multipleToRotateIds.length) throw new Error('No entities to rotate')

		const pivotPoint = this.multipleToRotatePivotPoint
		const startToPivotAngle = this.multipleToRotateStartToPivotAngle

		if (!pivotPoint || !startToPivotAngle) throw new Error('No pivot point or start to pivot angle')

		const angleInRadians = getAngleInRadiansBetweenTwoPoints(currentPoint, pivotPoint)
		const canvasEntities = this._state.entities.canvasEntities.getEntitiesByIds(multipleToRotateIds)
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

			// const boxBounds = getCommonEntityTrigonometricBounds(entities)

			/*		const selectionBoxBounds = getCompleteBoundsFromMultipleEntitiesWithPaddingWithAngle(
			 entities,
			 10,
			 adjustedAngle,
			 )*/
			// drawSelectionBoxBoundsFromTupleCtxFnWithAngle(boxBounds, adjustedAngle)(ctx)
			// drawSelectionBoxBoundsCtxFnWithTranslateRotate(selectionBoxBounds)(ctx)
			/*
			 const corners = entities.map((entity) => {
			 const angle = entity.angle
			 const location = entity.location
			 assertNotNull(angle)
			 assertNotNull(location)
			 const { width, height } = SizeByType[entity.type]
			 return getCornersOfRectWhenRotated(location.x, location.y, width, height, angle)
			 })

			 corners.forEach((corner) => {
			 corner.forEach((cornerPoint) => {
			 const [x, y] = cornerPoint
			 ctx.beginPath()
			 ctx.arc(x, y, 5, 0, 2 * Math.PI)
			 ctx.fill()
			 })
			 })

			 const points = corners.flat().map((c) => ({ x: c[0], y: c[1] }))

			 const boundsFromPoints = getCommonEntityTrigonometricBounds(entities)
			 const [x, y] = boundsFromPoints
			 const distanceFromCenter = getXAndYDistanceBetweenPoints({ x, y }, pivotPoint)
			 // const distanceFromCenter = getDistanceBetweenTwoPoints({ x, y }, pivotPoint)
			 console.log('distanceFromCenter', distanceFromCenter)
			 // this.initialDistanceFromCenter = distanceFromCenter

			 // const boundsFromPoints = getCommonTrigonometricBoundsFromPoints(points)
			 // const boundsFromPoints = getBoundsFromPoints(points)
			 // drawSelectionBoxBoundsByDrawingLines(boundsFromPoints, adjustedAngle)(ctx)
			 drawSelectionBoxBoundsFromTupleCtxFnWithAngle(boundsFromPoints, adjustedAngle)(ctx)*/
			/*			drawSelectionBoxBoundsCtxFnWithTranslateRotateFromEntityBoundsWithAngle(
			 boundsFromPoints,
			 adjustedAngle,
			 )(ctx)*/
			// drawSelectionBoxBoundsCtxFnWithTranslateRotate(boundsFromPoints)(ctx)
			// const corners = getCornersOfRectWhenRotated()

			ctx.restore()
		}

		this._render.drawCanvasExcludeIdsWithFnEditSelectBox(multipleToRotateIds, multipleRotateDrawFn)
	}

	rotateMultipleEntitiesViaMouseViaRotatingPivot(
		event: PointerEvent,
		currentPoint: TransformedPoint,
	) {
		if (!rotatingKeysDown(event)) {
			this.clearEntityToRotate()
			return
		}
		assertNotNull(this.centerPoint)
		const { x: centerX, y: centerY } = this.centerPoint
		const { x: pointerX, y: pointerY } = currentPoint
		const centerAngle = (5 * Math.PI) / 2 + Math.atan2(pointerY - centerY, pointerX - centerX)
		const multipleToRotateIds = this.multipleToRotateIds
		if (!multipleToRotateIds.length) throw new Error('No entities to rotate')

		const pivotPoint = this.multipleToRotatePivotPoint
		const startToPivotAngle = this.multipleToRotateStartToPivotAngle

		if (!pivotPoint || !startToPivotAngle) throw new Error('No pivot point or start to pivot angle')

		// const currentPoint = this._domPoint.getTransformedPointFromEvent(event)
		const angleInRadians = getAngleInRadiansBetweenTwoPoints(currentPoint, pivotPoint)
		const canvasEntities = this._state.entities.canvasEntities.getEntitiesByIds(multipleToRotateIds)
		assertNotNull(startToPivotAngle)
		const adjustedAngle = (angleInRadians - startToPivotAngle) as AngleRadians
		const entities = canvasEntities.map((entity) => {
			/*			const bounds = getEntityBounds(entity)
			 const [rotatedCX, rotatedCY] = rotate(
			 bounds.centerX,
			 bounds.centerY,
			 centerX,
			 centerY,
			 centerAngle, // centerAngle + origAngle - element.angle,
			 )
			 const adjustedLocationV2 = {
			 x: entity.location.x + (rotatedCX - centerX),
			 y: entity.location.y + (rotatedCY - centerY),
			 }

			 const adjustedAngleV2 = normalizeAngle(centerAngle + entity.angle)*/

			// const entityCenter = getCenterPointFromBounds(entityBounds)
			// const entityAdjustedAngle = (angleInRadians - entity.angle) as AngleRadians
			// const entityAdjustedAngle = (entity.angle - adjustedAngle) as AngleRadians
			const entityAdjustedAngle = adjustedAngle as AngleRadians
			// const entityAdjustedAngle = (entity.angle + adjustedAngle) as AngleRadians
			// const getPos = rotatePointOffPivot(entity.location, pivotPoint, entityAdjustedAngle)
			const getPos = rotatePointOffPivot(entity.location, pivotPoint, adjustedAngle)
			// const getPos = rotatePointOffPivot(entity.location, pivotPoint, adjustedAngle)
			this.multipleToRotateLocationDictionary[entity.id] = getPos
			this.multipleToRotateAngleDictionary[entity.id] = entityAdjustedAngle
			// this.multipleToRotateAngleDictionary[entity.id] = adjustedAngle
			const { width, height } = SizeByType[entity.type]
			return {
				...entity,
				id: entity.id, // location: adjustedLocationV2,
				// angle: adjustedAngleV2 as AngleRadians, // angle: adjustedAngle,
				location: getPos,
				angle: entityAdjustedAngle, // angle: adjustedAngle,
				width,
				height,
			}
			/*			return {
			 id: entity.id,
			 adjustedLocation: getPos,
			 adjustedAngle,
			 width,
			 height,
			 }*/
		})
		/*		const selectionBoxBounds = getTrigonometricBoundsFromMultipleEntitiesMakeCentrePivotPoint(
		 entities,
		 pivotPoint,
		 )*/
		/*		const selectionBoxBounds = getCompleteBoundsFromMultipleEntitiesWithPaddingWithAngle(
		 entities,
		 50, // 10,
		 // 10, // 10,
		 // 0, // 10,
		 adjustedAngle,
		 )*/
		/*		// const selectionBoxBounds = getCompleteBoundsFromMultipleEntitiesWithPadding(entities, 10)
		 if (!this.initialSelectionBoxBounds) {
		 this.initialSelectionBoxBounds = selectionBoxBounds
		 }*/

		/*		const multipleRotateDrawFn = (ctx: CanvasRenderingContext2D) => {
		 ctx.save()

		 entities.forEach((entity) => {
		 const angle = entity.angle
		 const location = entity.location
		 assertNotNull(angle)
		 assertNotNull(location)

		 ctx.save()
		 ctx.translate(location.x + entity.width / 2, location.y + entity.height / 2)
		 ctx.rotate(angle)

		 ctx.beginPath()
		 ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
		 ctx.fill()
		 ctx.stroke()
		 ctx.restore()
		 })
		 ctx.restore()
		 }*/

		const multipleRotateDrawFn = (ctx: CanvasRenderingContext2D) => {
			ctx.save()
			ctx.translate(centerX, centerY)
			ctx.rotate(centerAngle)
			entities.forEach((entity) => {
				const angle = entity.angle
				const location = entity.location
				assertNotNull(angle)
				assertNotNull(location)

				const proper = this._state.entities.canvasEntities.getEntityById(entity.id)
				if (!proper) throw new Error('No proper entity')

				ctx.save()
				const adjustedLocation = {
					x: proper.location.x - centerX,
					y: proper.location.y - centerY,
				}
				// ctx.translate(location.x + entity.width / 2, location.y + entity.height / 2)
				// ctx.rotate(angle)

				ctx.beginPath()
				ctx.rect(adjustedLocation.x, adjustedLocation.y, proper.width, proper.height)
				// ctx.rect(proper.location.x, proper.location.y, proper.width, proper.height)
				// ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
				ctx.fill()
				ctx.stroke()
				ctx.restore()
			})
			ctx.restore()
			ctx.save()
			ctx.rect(pivotPoint.x - 5, pivotPoint.y - 5, 10, 10)
			ctx.fill()
			ctx.stroke()
			ctx.restore()
			if (this.initialSelectionBoxBounds) {
				this.initialSelectionBoxBounds.angle = adjustedAngle
				drawSelectionBoxBoundsCtxFnWithTranslateRotate(this.initialSelectionBoxBounds)(ctx)
			}
		}
		/*
		 if (this.initialSelectionBoxBounds) {
		 this.initialSelectionBoxBounds.angle = adjustedAngle
		 drawSelectionBoxBoundsCtxFnWithTranslateRotate(this.initialSelectionBoxBounds)(ctx)
		 } else {
		 drawSelectionBoxBoundsCtxFnWithTranslateRotate(selectionBoxBounds)(ctx)
		 }
		 }*/

		this._render.drawCanvasExcludeIdsWithFnEditSelectBox(multipleToRotateIds, multipleRotateDrawFn)
		// this._render.drawCanvasExcludeIdsWithFn(multipleToRotateIds, multipleRotateDrawFn)
	}

	calculatePivotPointPosition(multipleToRotateIds: string[]) {
		const entities = this._state.entities.canvasEntities.getEntitiesByIds(multipleToRotateIds)
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
			this._state.entities.canvasEntities.updateEntity(singleToRotateId, { angle })
			this._machine.sendEvent(new StopSingleRotate())
		}

		this.singleToRotateId = undefined
		this.singleToRotateStartAngle = undefined
		this.singleToRotateStartPoint = undefined
		this.singleToRotateRecentAngle = undefined

		this._render.drawCanvas()
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
			this._state.entities.canvasEntities.updateManyEntities(storeUpdates)
			this._machine.sendEvent(new StopMultipleRotate())
		}

		this.multipleToRotateIds = []
		this.multipleToRotatePivotPoint = undefined
		this.multipleToRotateStartToPivotAngle = undefined
		this.multipleToRotateLocationDictionary = {}
		this.multipleToRotateAngleDictionary = {}

		this._render.drawCanvas()
	}

	clearEntityToRotate() {
		const singleToRotateId = this.singleToRotateId
		if (singleToRotateId) {
			const angle = this.singleToRotateRecentAngle
			assertNotNull(angle)
			this._state.entities.canvasEntities.updateEntity(singleToRotateId, { angle })
			this._machine.sendEvent(new StopSingleRotate())
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
			this._state.entities.canvasEntities.updateManyEntities(storeUpdates)
			this._machine.sendEvent(new StopMultipleRotate())
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

		this._render.drawCanvas()
	}
}