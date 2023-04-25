import { inject, Injectable } from '@angular/core'
import { AngleRadians, CanvasClientStateService, CanvasRenderService, DomPointService, getAngleInRadiansBetweenTwoPoints, MachineService, MultipleToRotateEntity, rotatePointOffPivot, rotatingKeysDown, SizeByType, StartMultipleRotate, StartSingleRotate, StopMultipleRotate, StopSingleRotate, TransformedPoint, updateObjectByIdForStore } from '@design-app/feature-design-canvas'
import { assertNotNull } from '@shared/utils'
import { Point } from '@shared/data-access/models'
import { Dictionary } from '@ngrx/entity'

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
	multipleToRotateEntities: MultipleToRotateEntity[] = []
	multipleToRotateLocationDictionary: Dictionary<Point> = {}
	multipleToRotateAngleDictionary: Dictionary<AngleRadians> = {}
	multipleToRotatePivotPoint: Point | undefined = undefined
	multipleToRotateStartToPivotAngle: AngleRadians | undefined = undefined

	handleSetEntitiesToRotate(event: PointerEvent, currentPoint: TransformedPoint) {
		const selectedId = this._machine.ctx.selected.singleSelectedId
		// const selectedId = this._state.selected.singleSelectedId
		if (selectedId) {
			// const transformedPoint = this._domPoint.getTransformedPointFromEvent(event)
			this.setEntityToRotate(selectedId, currentPoint)
			return
		}
		const multiSelectIds = this._machine.ctx.selected.multipleSelectedIds
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

	setMultipleToRotate(multipleToRotateIds: string[], startPoint: TransformedPoint) {
		const pivotPoint = this.calculatePivotPointPosition(multipleToRotateIds)
		const startToPivotAngle = getAngleInRadiansBetweenTwoPoints(startPoint, pivotPoint)
		this.multipleToRotateIds = multipleToRotateIds
		this.multipleToRotatePivotPoint = pivotPoint
		this.multipleToRotateStartToPivotAngle = startToPivotAngle
		this._machine.sendEvent(new StartMultipleRotate())
		/*		this._state.updateState({
		 toRotate: {
		 multipleToRotate: {
		 ids: multipleToRotateIds, entities: [], pivotPoint, startToPivotAngle,
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
		const entityLocation = this._state.entities.canvasEntities.getEntityById(singleToRotateId)?.location
		assertNotNull(entityLocation)
		const previousAngle = singleToRotateStartAngle
		const radians = getAngleInRadiansBetweenTwoPoints(currentPoint, entityLocation)
		const angle = radians - previousAngle as AngleRadians
		this.singleToRotateRecentAngle = angle

		const entity = this._state.entities.canvasEntities.getEntityById(singleToRotateId)
		assertNotNull(entity)

		const singleRotateDrawFn = (ctx: CanvasRenderingContext2D) => {
			ctx.save()
			ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
			ctx.rotate(angle)
			ctx.beginPath()
			ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
			ctx.fill()
			ctx.stroke()
			ctx.restore()
		}

		this._render.drawCanvasExcludeIdsWithFn([singleToRotateId], singleRotateDrawFn)
	}

	rotateMultipleEntitiesViaMouse(event: PointerEvent, currentPoint: TransformedPoint) {
		if (!rotatingKeysDown(event)) {
			this.clearEntityToRotate()
			return
		}
		const multipleToRotateIds = this.multipleToRotateIds
		if (!multipleToRotateIds.length) throw new Error('No entities to rotate')

		const pivotPoint = this.multipleToRotatePivotPoint
		const startToPivotAngle = this.multipleToRotateStartToPivotAngle

		if (!pivotPoint || !startToPivotAngle) throw new Error('No pivot point or start to pivot angle')

		// const currentPoint = this._domPoint.getTransformedPointFromEvent(event)
		const angleInRadians = getAngleInRadiansBetweenTwoPoints(currentPoint, pivotPoint)
		const canvasEntities = this._state.entities.canvasEntities.getEntitiesByIds(multipleToRotateIds)
		assertNotNull(startToPivotAngle)
		const adjustedAngle = angleInRadians - startToPivotAngle as AngleRadians
		const entities = canvasEntities.map(entity => {
			const getPos = rotatePointOffPivot(entity.location, pivotPoint, adjustedAngle)
			this.multipleToRotateLocationDictionary[entity.id] = getPos
			this.multipleToRotateAngleDictionary[entity.id] = adjustedAngle
			const { width, height } = SizeByType[entity.type]
			return {
				id: entity.id, adjustedLocation: getPos, adjustedAngle, width, height,
			}
		})

		const multipleRotateDrawFn = (ctx: CanvasRenderingContext2D) => {
			ctx.save()
			entities.forEach(entity => {
				const angle = entity.adjustedAngle
				const location = entity.adjustedLocation
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
		}

		this._render.drawCanvasExcludeIdsWithFn(multipleToRotateIds, multipleRotateDrawFn)
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
			const storeUpdates = multipleToRotateIds.map(id => {
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
			const storeUpdates = multipleToRotateIds.map(id => {
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

		this._render.drawCanvas()
	}

}