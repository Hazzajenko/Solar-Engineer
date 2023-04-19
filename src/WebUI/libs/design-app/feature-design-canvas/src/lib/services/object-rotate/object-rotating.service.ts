import { inject, Injectable } from '@angular/core'
import { AngleRadians, CanvasClientStateService, CanvasRenderService, DomPointService, getAngleInRadiansBetweenTwoPoints, MultipleToRotateEntity, rotatePointOffPivot, rotatingKeysDown, SingleToRotate, TransformedPoint, updateObjectByIdForStore } from '@design-app/feature-design-canvas'
import { assertNotNull } from '@shared/utils'

@Injectable({
  providedIn: 'root',
})
export class ObjectRotatingService {
  private _state = inject(CanvasClientStateService)
  private _render = inject(CanvasRenderService)
  private _domPoint = inject(DomPointService)

  get isInSingleRotateMode() {
    const { singleToRotate, singleRotateMode } = this._state.toRotate
    return !!singleToRotate && singleRotateMode
    // return !!this.entityToRotateId && this.singleRotateMode
  }

  get areAnyEntitiesInRotate() {
    const { singleToRotate, ids } = this._state.toRotate
    return !!singleToRotate || !!ids.length
    // return !!this.entityToRotateId || !!this.multipleToRotateIds.length
  }

  handleSetEntitiesToRotate(event: MouseEvent) {
    const selectedId = this._state.selected.singleSelectedId
    if (selectedId) {
      const transformedPoint = this._domPoint.getTransformedPointFromEvent(event)
      this.setEntityToRotate(selectedId, transformedPoint)
      return
    }
    const multiSelectIds = this._state.selected.multipleSelectedIds
    if (multiSelectIds.length > 1) {
      const transformedPoint = this._domPoint.getTransformedPointFromEvent(event)
      this.setMultipleToRotate(multiSelectIds, transformedPoint)
      return
    }
  }

  setEntityToRotate(entityId: string, startPoint: TransformedPoint) {
    const location = this._state.entity.getEntity(entityId)?.location
    assertNotNull(location)
    const startAngle = getAngleInRadiansBetweenTwoPoints(startPoint, location)
    this._state.updateState({
      toRotate: {
        singleToRotate: {
          id: entityId,
          startPoint,
          startAngle,
        },
      },
    })
  }

  setMultipleToRotate(multipleToRotateIds: string[], startPoint: TransformedPoint) {
    const pivotPoint = this.calculatePivotPointPosition(multipleToRotateIds)
    const startToPivotAngle = getAngleInRadiansBetweenTwoPoints(startPoint, pivotPoint)
    this._state.updateState({
      toRotate: {
        multipleToRotate: {
          ids:      multipleToRotateIds,
          entities: [],
          pivotPoint,
          startToPivotAngle,
        },
      },
    })
  }

  rotateEntityViaMouse(event: MouseEvent, singleToRotate: SingleToRotate) {
    const currentPoint = this._domPoint.getTransformedPointFromEvent(event)
    const entityLocation = this._state.entity.getEntity(singleToRotate.id)?.location
    assertNotNull(entityLocation)
    const previousAngle = singleToRotate.startAngle
    const radians = getAngleInRadiansBetweenTwoPoints(currentPoint, entityLocation)
    const angle = radians - previousAngle as AngleRadians

    this._state.updateState({
      toRotate: {
        singleToRotate: {
          ...singleToRotate,
          startPoint:    currentPoint,
          adjustedAngle: angle,
        },
      },
    })
    this._render.drawCanvas()
  }

  rotateMultipleEntitiesViaMouse(event: MouseEvent, multipleToRotateIds: string[]) {
    if (!multipleToRotateIds.length) return
    if (!rotatingKeysDown(event)) {
      this.clearEntityToRotate()
      return
    }

    const multipleToRotate = this._state.toRotate.multipleToRotate
    assertNotNull(multipleToRotate)
    const pivotPoint = multipleToRotate.pivotPoint
    assertNotNull(pivotPoint)

    const currentPoint = this._domPoint.getTransformedPointFromEvent(event)
    const angleInRadians = getAngleInRadiansBetweenTwoPoints(currentPoint, pivotPoint)
    const canvasEntities = this._state.entity.getEntitiesByIds(multipleToRotateIds)
    const startToPivotAngle = multipleToRotate.startToPivotAngle
    assertNotNull(startToPivotAngle)
    const adjustedAngle = angleInRadians - startToPivotAngle as AngleRadians
    const entities = canvasEntities.map(entity => {
      const getPos = rotatePointOffPivot(entity.location, pivotPoint, adjustedAngle)
      return {
        id:               entity.id,
        adjustedLocation: getPos,
      } as MultipleToRotateEntity
    })
    this._state.updateState({
      toRotate: {
        multipleToRotate: {
          ...multipleToRotate,
          adjustedAngle,
          entities,
        },
      },
    })

    this._render.drawCanvas()
  }

  calculatePivotPointPosition(multipleToRotateIds: string[]) {
    const entities = this._state.entity.getEntitiesByIds(multipleToRotateIds)
    assertNotNull(entities)
    const totalX = entities.reduce((acc, entity) => acc + entity.location.x, 0)
    const totalY = entities.reduce((acc, entity) => acc + entity.location.y, 0)
    const pivotX = totalX / entities.length
    const pivotY = totalY / entities.length
    return { x: pivotX, y: pivotY }
  }

  clearEntityToRotate() {
    const multipleToRotate = this._state.toRotate.multipleToRotate
    // assertNotNull(multipleToRotate)
    if (multipleToRotate && multipleToRotate.ids.length) {
      const storeUpdates = multipleToRotate.ids.map(id => {
        const entity = this._state.entity.getEntity(id)
        assertNotNull(entity)
        const angle = multipleToRotate.adjustedAngle
        const location = multipleToRotate.entities.find(e => e.id === id)?.adjustedLocation
        assertNotNull(angle)
        assertNotNull(location)

        return updateObjectByIdForStore(id, { location, angle })
      })
      this._state.entity.updateManyEntities(storeUpdates)
      this._state.updateState({
        toRotate: {
          ids:              [],
          multipleToRotate: undefined,
        },
      })
    }
    const singleToRotate = this._state.toRotate.singleToRotate
    if (singleToRotate) {
      this._state.entity.updateEntity(singleToRotate.id, { angle: singleToRotate.adjustedAngle })
      this._state.updateState({
        toRotate: {
          singleToRotate:   undefined,
          singleRotateMode: false,
        },
      })
    }

    this._render.drawCanvas()
  }

}