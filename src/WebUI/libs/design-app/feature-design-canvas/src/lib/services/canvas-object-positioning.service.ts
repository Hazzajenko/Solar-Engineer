import { inject, Injectable } from '@angular/core'
import { SizeByType, TransformedPoint, updateObjectByIdForStore } from '../types'
import { DomPointService } from './dom-point.service'
import { CanvasEntitiesStore } from './canvas-entities'
import { CanvasElementService } from './canvas-element.service'
import { Point } from '@shared/data-access/models'
import { assertNotNull } from '@shared/utils'
import { AngleRadians, getAngleInRadiansBetweenTwoPoints, rotatePointOffPivot } from '../utils'
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
    /*    const distanceX = Math.abs(point1.x - point2.x)
     const distanceY = Math.abs(point1.y - point2.y)*/
    const distanceX = point1.x - point2.x
    const distanceY = point1.y - point2.y
    // const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
    const { width, height } = SizeByType[ENTITY_TYPE.Panel]
    const widthWithMidSpacing = width + 2
    const heightWithMidSpacing = height + 2
    /*    const entitiesInX = Math.floor(distanceX / widthWithMidSpacing)
     const entitiesInY = Math.floor(distanceY / heightWithMidSpacing)*/
    const entitiesInX = Math.floor(distanceX / widthWithMidSpacing)
    const entitiesInY = Math.floor(distanceY / heightWithMidSpacing)
    const entitiesInXAndY = entitiesInX * entitiesInY
    /*    console.log('distanceX', distanceX)
     console.log('distanceY', distanceY)
     /!*    console.log('entitiesInX', entitiesInX)
     console.log('entitiesInY', entitiesInY)*!/
     console.log('entitiesInXAndY', entitiesInXAndY)*/
    /*    const entitiesBetweenPoints = this.getAllElementsBetweenTwoPoints(point1, point2)
     if (entitiesBetweenPoints.length) {
     console.log('entitiesBetweenPoints', entitiesBetweenPoints)
     }*/
    return {
      entitiesInX,
      entitiesInY,
    }

    // const entities = this._entitiesStore.select.entities
    // const entitiesBetweenPoints = this.getAllElementsBetweenTwoPoints(point1, point2)
    // const entityWidth = entitySize.width
    // const entityHeight = entitySize.height

    /*    const angle = Math.atan2(distanceY, distanceX)
     const angleInDegrees = angle * 180 / Math.PI
     const angleInRadians = angleInDegrees * (Math.PI / 180)*/

  }

  getAllElementsBetweenTwoPoints(
    point1: TransformedPoint,
    point2: TransformedPoint,
  ) {
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