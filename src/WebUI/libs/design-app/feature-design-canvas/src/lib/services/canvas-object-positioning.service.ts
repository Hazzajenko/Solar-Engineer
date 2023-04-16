import { inject, Injectable } from '@angular/core'
import { CanvasEntity, SizeByType, TransformedPoint, updateObjectByIdForStore } from '../types'
import { DomPointService } from './dom-point.service'
import { CanvasEntitiesStore } from './canvas-entities'
import { CanvasElementService } from './canvas-element.service'
import { Point } from '@shared/data-access/models'
import { assertNotNull } from '@shared/utils'
import { AngleRadians, DIAGONAL_DIRECTION, DiagonalDirection, filterEntitiesInsideBounds, getAngleInRadiansBetweenTwoPoints, getBoundsFromTwoPoints, getDiagonalDirectionFromTwoPoints, getEntityBounds, getStartingSpotForCreationBox, isEntityInsideTwoPoints, rotatePointOffPivot, SpotInBox } from '../utils'
import { getEntitySizeOffset } from '../functions/object-sizing'
import { ENTITY_TYPE } from '@design-app/shared'

@Injectable({
  providedIn: 'root',
})
export class CanvasObjectPositioningService {
  private _entitiesStore = inject(CanvasEntitiesStore)
  private _domPointService = inject(DomPointService)
  private _canvasElementsService = inject(CanvasElementService)

  rotateStats: HTMLDivElement | undefined = undefined

  entityToRotateId: string | undefined = undefined
  entityToRotateAngle: AngleRadians | undefined = undefined

  multipleToRotateIds: string[] = []
  multipleToRotateAngle: number | undefined = undefined
  multipleToRotateAdjustedAngle: Map<string, AngleRadians> = new Map()
  multipleToRotateAdjustedLocation: Map<string, Point> = new Map()

  pivotPoint: Point | undefined = undefined
  currentCenterPoint!: Point
  currentMousePoint!: Point

  private _startPoint: Point | undefined = undefined
  private _startRotateAngleToMouse: AngleRadians | undefined = undefined
  private _startRotateRadiansToMouse: number | undefined = undefined

  startPointToCurrentPointAngleInRadians: AngleRadians | undefined = undefined
  startPointToPivotPointAngleInRadians: AngleRadians | undefined = undefined

  singleRotateMode = false

  private get entities() {
    return this._entitiesStore.select.entities
  }

  get ctx() {
    return this._canvasElementsService.ctx
  }

  get canvas() {
    return this._canvasElementsService.canvas
  }

  get areAnyEntitiesInRotate() {
    return !!this.entityToRotateId || !!this.multipleToRotateIds.length
  }

  setEntityToRotate(entityId: string, startPoint: TransformedPoint) {
    this.entityToRotateId = entityId
    this._startPoint = startPoint
    const location = this._entitiesStore.select.entityById(entityId).location
    this._startRotateAngleToMouse = getAngleInRadiansBetweenTwoPoints(startPoint, location)
    this.singleRotateMode = true
    /*    this._startRotateAngleToMouse = roundToTwoDecimals(
     Math.atan2(startPoint.y - entity.location.y, startPoint.x - entity.location.x) * (180 / Math.PI),
     )*/
  }

  setMultipleToRotate(entityIds: string[], startPoint: TransformedPoint) {
    this.multipleToRotateIds = entityIds
    this._startPoint = startPoint
    this.multipleToRotateAdjustedAngle = new Map()
    this.multipleToRotateAdjustedLocation = new Map()

    this.pivotPoint = this.calculatePivotPointPosition()
    this.startPointToPivotPointAngleInRadians = getAngleInRadiansBetweenTwoPoints(startPoint, this.pivotPoint)
    console.log('pivotPoint', this.pivotPoint)
    console.log('startPointToPivotPointAngleInRadians', this.startPointToPivotPointAngleInRadians)
    // this.startPointToCurrentPointAngleInRadians = getAngleInRadiansBetweenTwoPoints(startPoint, this.currentCenterPoint)
  }

  rotateEntityViaMouse(event: MouseEvent) {
    if (!this.entityToRotateId) return
    if (!this._startPoint) return
    if (!this._startRotateAngleToMouse) return
    const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
    const entityLocation = this._entitiesStore.select.entityById(this.entityToRotateId).location
    const radians = getAngleInRadiansBetweenTwoPoints(currentPoint, entityLocation)
    // const radians = Math.atan2(currentPoint.y - entityLocation.y, currentPoint.x - entityLocation.x)
    // const degrees = radians * 180 / Math.PI
    this.entityToRotateAngle = radians - this._startRotateAngleToMouse as AngleRadians
    // this.entityToRotateAngle = degrees - this._startRotateAngleToMouse

    this._startPoint = currentPoint
  }

  rotateMultipleEntitiesViaMouse(event: MouseEvent) {
    if (!this.multipleToRotateIds.length) return
    if (!this.pivotPoint) return
    const pivotPoint = this.pivotPoint

    const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
    this.currentMousePoint = currentPoint
    const angleInRadians = getAngleInRadiansBetweenTwoPoints(currentPoint, pivotPoint)
    const canvasEntities = this.multipleToRotateIds.map(id => this._entitiesStore.select.entityById(id))
    assertNotNull(this.startPointToPivotPointAngleInRadians)
    const adjustedAngleRadians = angleInRadians - this.startPointToPivotPointAngleInRadians as AngleRadians
    canvasEntities.forEach(entity => {
      const getPos = rotatePointOffPivot(entity.location, pivotPoint, adjustedAngleRadians)
      this.multipleToRotateAdjustedAngle.set(entity.id, adjustedAngleRadians)
      this.multipleToRotateAdjustedLocation.set(entity.id, getPos)
    })
  }

  calculatePivotPointPosition() {
    const entities = this.multipleToRotateIds.map(id => this._entitiesStore.select.entityById(id))
    const totalX = entities.reduce((acc, entity) => acc + entity.location.x, 0)
    const totalY = entities.reduce((acc, entity) => acc + entity.location.y, 0)
    const pivotX = totalX / entities.length
    const pivotY = totalY / entities.length
    return { x: pivotX, y: pivotY }
  }

  clearEntityToRotate() {
    if (this.entityToRotateId && this.entityToRotateAngle) {
      const storeUpdate = updateObjectByIdForStore(this.entityToRotateId, { angle: this.entityToRotateAngle })
      this._entitiesStore.dispatch.updateCanvasEntity(storeUpdate)
    }
    if (this.multipleToRotateIds.length > 1) {
      const storeUpdates = this.multipleToRotateIds.map(id => {
        const entity = this._entitiesStore.select.entityById(id)
        const angle = this.multipleToRotateAdjustedAngle.get(entity.id)
        const location = this.multipleToRotateAdjustedLocation.get(entity.id)
        assertNotNull(angle)
        assertNotNull(location)

        return updateObjectByIdForStore(id, { location, angle })
      })
      this._entitiesStore.dispatch.updateManyCanvasEntities(storeUpdates)
    }
    this.entityToRotateId = undefined
    this._startPoint = undefined
    this._startRotateAngleToMouse = undefined
    this.entityToRotateAngle = undefined
    this.multipleToRotateIds = []
    this.singleRotateMode = false
    this.multipleToRotateAdjustedAngle = new Map()
    this.multipleToRotateAdjustedLocation = new Map()
    this.pivotPoint = undefined
    this.startPointToPivotPointAngleInRadians = undefined
  }

  getAllAvailableEntitySpotsBetweenTwoPoints(
    point1: TransformedPoint,
    point2: TransformedPoint,
  ) {
    const distanceX = point1.x - point2.x
    const distanceY = point1.y - point2.y
    const entitySize = SizeByType[ENTITY_TYPE.Panel]
    const widthWithMidSpacing = entitySize.width + 2
    const heightWithMidSpacing = entitySize.height + 2
    const entitiesInX = Math.floor(distanceX / widthWithMidSpacing)
    const entitiesInY = Math.floor(distanceY / heightWithMidSpacing)
    const diagonalDirection = getDiagonalDirectionFromTwoPoints(point1, point2)
    if (!diagonalDirection) return

    const startingPoint = getStartingSpotForCreationBox(diagonalDirection, entitySize)
    const twoPointBounds = getBoundsFromTwoPoints(point1, point2)

    const existingEntities = filterEntitiesInsideBounds(twoPointBounds, this.entities)
    const widthIsPositive = entitiesInX > 0
    const adjustedWidth = widthIsPositive
      ? -widthWithMidSpacing
      : widthWithMidSpacing

    const heightIsPositive = entitiesInY > 0
    const adjustedHeight = heightIsPositive
      ? -heightWithMidSpacing
      : heightWithMidSpacing
    const spots: SpotInBox[] = []
    for (let i = 0; i < Math.abs(entitiesInX); i++) {

      for (let a = 0; a < Math.abs(entitiesInY); a++) {
        const spot: SpotInBox = {
          vacant: true,
          x:      point1.x + startingPoint.x + i * adjustedWidth,
          y:      point1.y + startingPoint.y + a * adjustedHeight,
        }
        existingEntities.forEach((entity) => {
          const firstSpot = {
            x: spot.x - entity.width / 2,
            y: spot.y - entity.height / 2,
          }
          const secondSpot = {
            x: spot.x + entity.width + entity.width / 2,
            y: spot.y + entity.width + entity.height / 2,
          }
          if (isEntityInsideTwoPoints(entity, firstSpot, secondSpot)) {
            spot.vacant = false
          }
        })
        spots.push(spot)
      }
    }

    return spots
  }

  isEntityInsideByDirection(
    entity: CanvasEntity,
    direction: DiagonalDirection,
    point1: TransformedPoint,
    point2: TransformedPoint,
  ) {
    // const start

    switch (direction) {
      case DIAGONAL_DIRECTION.BottomLeftToTopRight:
        return entity.location.x > point1.x && entity.location.x < point2.x && entity.location.y < point1.y && entity.location.y > point2.y
      case DIAGONAL_DIRECTION.TopLeftToBottomRight:
        return entity.location.x > point1.x && entity.location.x < point2.x && entity.location.y > point1.y && entity.location.y < point2.y
      case DIAGONAL_DIRECTION.TopRightToBottomLeft:
        return entity.location.x < point1.x && entity.location.x > point2.x && entity.location.y > point1.y && entity.location.y < point2.y
      case DIAGONAL_DIRECTION.BottomRightToTopLeft:
        return entity.location.x < point1.x && entity.location.x > point2.x && entity.location.y < point1.y && entity.location.y > point2.y
    }

  }

  isEntityInsideTwoPoints(
    entity: CanvasEntity,
    point1: Point,
    point2: Point,
  ) {
    const bounds = getEntityBounds(entity)
    const box = getBoundsFromTwoPoints(point1, point2)

    return !(
      box.right < bounds.left ||
      box.left > bounds.right ||
      box.bottom < bounds.top ||
      box.top > bounds.bottom
    )
  }

  getInsideCheckPointsByDirection(
    direction: DiagonalDirection,
  ) {
    switch (direction) {
      case DIAGONAL_DIRECTION.BottomLeftToTopRight:
        return {}
      case DIAGONAL_DIRECTION.TopLeftToBottomRight:
        return {}
      case DIAGONAL_DIRECTION.TopRightToBottomLeft:
        return {}
      case DIAGONAL_DIRECTION.BottomRightToTopLeft:
        return {}
    }
  }

  getAllElementsBetweenTwoPoints(
    point1: TransformedPoint,
    point2: TransformedPoint,
  ) {
    // const test = this._entitiesStore.select.entities.filter((entity) => filterAllEntityBetweenTwoPoints(point1, point2, entity, DIAGONAL_DIRECTION.BottomLeftToTopRight))
    return this._entitiesStore.select.entities.filter((objectRect) => {
      // const widthOffset
      const { widthOffset, heightOffset } = getEntitySizeOffset(objectRect)
      // Bottom Left To Top Right
      if (point1.x < point2.x && point1.y > point2.y) {
        // Left To Right
        if (point1.x < objectRect.location.x && point2.x > objectRect.location.x + widthOffset) {
          // Bottom To Top
          if (point2.y < objectRect.location.y && point1.y > objectRect.location.y + heightOffset) {
            console.log('Bottom Left To Top Right')
            return true
          }
        }
      }
      // Top Left To Bottom Right
      if (point1.x < point2.x && point1.y < point2.y) {
        // Left To Right
        if (point1.x < objectRect.location.x && point2.x > objectRect.location.x + widthOffset) {
          // Top To Bottom
          if (point1.y < objectRect.location.y && point2.y > objectRect.location.y + heightOffset) {
            console.log('Top Left To Bottom Right')
            return true
          }
        }
      }

      // Top Right To Bottom Left
      if (point1.x > point2.x && point1.y < point2.y) {
        // Right To Left
        if (point1.x > objectRect.location.x + widthOffset && point2.x < objectRect.location.x) {
          // Top To Bottom
          if (point1.y < objectRect.location.y + heightOffset && point2.y > objectRect.location.y) {
            console.log('Top Right To Bottom Left')
            return true
          }
        }
      }

      // Bottom Right To Top Left
      if (point1.x > point2.x && point1.y > point2.y) {
        // Right To Left
        if (point1.x > objectRect.location.x + widthOffset && point2.x < objectRect.location.x) {
          // Bottom To Top
          if (point2.y < objectRect.location.y + heightOffset && point1.y > objectRect.location.y) {
            console.log('Bottom Right To Top Left')
            return true
          }
        }
      }

      return false
    })
  }

}