import { inject, Injectable } from '@angular/core'
import { CanvasEntity, TransformedPoint, updateObjectByIdForStore } from '../types'
import { DomPointService } from './dom-point.service'
import { CanvasEntitiesStore } from './canvas-entities'
import { roundToTwoDecimals } from 'design-app/utils'
import { CanvasElementService } from './canvas-element.service'
import { Point } from '@shared/data-access/models'
import { assertNotNull } from '@shared/utils'
import { Angle, angleToRadians, getAngleBetweenTwoPoints, getAngleInRadiansBetweenTwoPoints, getCommonBounds, getElementAbsoluteCoords, Radian, radiansToAngle, radianToProperAngle, rotatePointOffPivot } from '../utils'

@Injectable({
  providedIn: 'root',
})
export class CanvasObjectPositioningService {
  private _entitiesStore = inject(CanvasEntitiesStore)
  private _domPointService = inject(DomPointService)
  private _canvasElementsService = inject(CanvasElementService)

  rotateStats: HTMLDivElement | undefined = undefined

  entityToRotateId: string | undefined = undefined
  entityToRotateAngle: number | undefined = undefined

  multipleToRotateIds: string[] = []
  multipleToRotateAngle: number | undefined = undefined
  multipleToRotateRadian: number | undefined = undefined

  multipleToRotatePreviousAngleInRadians = 0

  multipleToRotateAngleLocal = 0
  multipleToRotateRadianLocal = 0
  multipleToRotateAdjustedAngle: Map<string, number> = new Map()
  multipleToRotateAdjustedRadians: Map<string, Radian> = new Map()
  multipleToRotateAdjustedLocation: Map<string, Point> = new Map()
  multipleToRotateAdjustedLocationV2: Map<string, Point> = new Map()
  multipleToRotateAngleMap: Map<string, number> = new Map()
  multipleToRotateDistanceFromPivotMap: Map<string, Point> = new Map()
  multipleToRotateDistanceAndRadians: Map<string, {
    distance: number
    radians: number
  }> = new Map()

  pivotPoint: Point | undefined = undefined

  currentCenterPoint!: Point

  currentMousePoint!: Point

  entityToMove: CanvasEntity | null = null
  entityToResize: CanvasEntity | null = null

  private _startPoint: DOMPoint | undefined = undefined
  private _startRotateAngleToMouse: number | undefined = undefined
  private _startRotateRadiansToMouse: number | undefined = undefined

  get ctx() {
    return this._canvasElementsService.ctx
  }

  get canvas() {
    return this._canvasElementsService.canvas
  }

  get areAnyEntitiesInRotate() {
    return !!this.entityToRotateId || !!this.multipleToRotateIds.length
  }

  setEntityToRotate(entity: CanvasEntity, startPoint: TransformedPoint) {
    this.entityToRotateId = entity.id
    this._startPoint = startPoint
    this._startRotateAngleToMouse = roundToTwoDecimals(
      Math.atan2(startPoint.y - entity.location.y, startPoint.x - entity.location.x) * (180 / Math.PI),
    )
  }

  setMultipleToRotate(entities: CanvasEntity[], startPoint: TransformedPoint) {
    const [minX, minY, maxX, maxY] = getCommonBounds(entities)

    this.currentCenterPoint = {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
    }

    this.multipleToRotateIds = entities.map(entity => entity.id)
    this._startPoint = startPoint
    /*    this._startRotateAngleToMouse = roundToTwoDecimals(
     Math.atan2(startPoint.y - entities[0].location.y, startPoint.x - entities[0].location.x) * (180 / Math.PI),
     )*/
    this._startRotateAngleToMouse = getAngleBetweenTwoPoints(startPoint, entities[0].location)
    this._startRotateRadiansToMouse = getAngleInRadiansBetweenTwoPoints(startPoint, entities[0].location)

    this.multipleToRotatePreviousAngleInRadians = 0

    this.multipleToRotateAngleLocal = 0
    this.multipleToRotateRadianLocal = 0
    this.multipleToRotateAdjustedAngle = new Map()
    this.multipleToRotateAdjustedLocation = new Map()
    this.multipleToRotateAdjustedLocationV2 = new Map()
    this.multipleToRotateAngleMap = new Map()
    this.multipleToRotateDistanceFromPivotMap = new Map()
    this.multipleToRotateDistanceAndRadians = new Map()

    this.pivotPoint = this.calculatePivotPointPosition()
    // this._startRotateAngleToMouse = getAngleBetweenTwoPoints(startPoint, this.pivotPoint)
    // this._startRotateRadiansToMouse = getRadiansBetweenTwoPoints(startPoint, this.pivotPoint)
    entities.forEach(entity => {
      assertNotNull(this.pivotPoint)
      const dx = entity.location.x - this.pivotPoint.x
      const dy = entity.location.y - this.pivotPoint.y
      // const dx = entity.location.x - startPoint.x
      // const dy = entity.location.y - startPoint.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const radians = Math.atan2(dy, dx)

      this.multipleToRotateDistanceFromPivotMap.set(entity.id, { x: dx, y: dy })
      this.multipleToRotateDistanceAndRadians.set(entity.id, { distance, radians })
      this.multipleToRotateAdjustedAngle.set(entity.id, entity.angle)
      // const angleToPivot = this.getEntityRotation(entity)
      // radians to angle

      // console.log('angleToPivot', angleToPivot)
      // if (!angleToPivot) return
      this.multipleToRotateAngleMap.set(entity.id, radiansToAngle(radians))
    })

    console.log('setMultipleToRotate', this._startRotateAngleToMouse)
    console.log('multipleToRotateIds', this.multipleToRotateIds)
    console.log('_startPoint', this._startPoint)
  }

  rotateMultiple(
    entities: CanvasEntity[],
  ) {
    const pointer = this.currentMousePoint
    const centerX = this.currentCenterPoint.x
    const centerY = this.currentCenterPoint.y
    const pointerX = pointer.x
    const pointerY = pointer.y
    const centerAngle =
            (5 * Math.PI) / 2 + Math.atan2(pointerY - centerY, pointerX - centerX)
    return entities.map(entity => {
      const [x1, y1, x2, y2] = getElementAbsoluteCoords(entity)
      const cx = (x1 + x2) / 2
      const cy = (y1 + y2) / 2
      const origAngle = entity.angle
      /*      const [rotatedCX, rotatedCY] = rotate(
       cx,
       cy,
       centerX,
       centerY,
       centerAngle + origAngle - entity.angle,
       )*/
      /*    const location = {
       x: entity.location.x + (rotatedCX - cx),
       y: entity.location.y + (rotatedCY - cy),
       }*/
      return /*updateObjectByIdForStore(entity.id, {
       location,
       angle: normalizeAngle(centerAngle + origAngle),
       })*/
    })

  }

  rotateEntitiesViaMouse(event: MouseEvent, entityLocation: TransformedPoint) {
    console.log('rotateEntitiesViaMouse')
    if (this.entityToRotateId) {
      this.rotateEntityViaMouse(event, entityLocation)
    }/* else if (this.multipleToRotateIds.length) {
     this.rotateMultipleEntitiesViaMouse(event, entityLocation)
     }*/
  }

  rotateEntityViaMouse(event: MouseEvent, entityLocation: TransformedPoint) {
    if (!this.entityToRotateId) return
    if (!this._startPoint) return
    if (!this._startRotateAngleToMouse) return
    const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
    const radians = Math.atan2(currentPoint.y - entityLocation.y, currentPoint.x - entityLocation.x)
    const degrees = radians * 180 / Math.PI
    this.entityToRotateAngle = degrees - this._startRotateAngleToMouse
    this._startPoint = currentPoint
  }

  rotateMultipleEntitiesViaMouse(event: MouseEvent) {
    if (!this.multipleToRotateIds.length) return
    if (!this._startPoint) return
    if (!this._startRotateAngleToMouse) return
    if (!this._startRotateRadiansToMouse) return

    if (!this.pivotPoint) return
    if (!this.rotateStats) {
      this.rotateStats = document.getElementById('rotate-stats') as HTMLDivElement
    }

    const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
    this.currentMousePoint = currentPoint
    const angleInRadians = getAngleInRadiansBetweenTwoPoints(currentPoint, this.pivotPoint)
    let prevAngle = this.multipleToRotatePreviousAngleInRadians
    const diff = angleInRadians - prevAngle
    if (diff > Math.PI) {
      prevAngle += 2 * Math.PI
    } else if (diff < -Math.PI) {
      prevAngle -= 2 * Math.PI
    }
    const adjustedAngleInRadians = angleInRadians + prevAngle
    this.multipleToRotatePreviousAngleInRadians = angleInRadians
    // console.log('adjustedAngleInRadians', adjustedAngleInRadians)
    // const radians = Math.atan2(currentPoint.y - this.pivotPoint.y, currentPoint.x - this.pivotPoint.x)

    const rotateStatsArray: string[] = []
    const degrees = angleInRadians * 180 / Math.PI
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.save()
    this.ctx.translate(this.pivotPoint.x, this.pivotPoint.y)
    this.multipleToRotateAngle = degrees - this._startRotateAngleToMouse
    this.multipleToRotateRadian = angleInRadians - this._startRotateRadiansToMouse
    this.multipleToRotateRadianLocal = this.multipleToRotateRadianLocal + this.multipleToRotateRadian
    this.multipleToRotateAngleLocal = radianToProperAngle(this.multipleToRotateRadianLocal)
    const toRotate = this.multipleToRotateAngle
    this.ctx.rotate(toRotate * Math.PI / 180)
    const canvasEntities = this.multipleToRotateIds.map(id => this._entitiesStore.select.entityById(id))
    this.multipleToRotateIds.forEach((id, index) => {
      assertNotNull(this.pivotPoint)
      const panel = this._entitiesStore.select.entityById(id)
      // const angleToPivot = Math.atan2(entity.location.y - this.pivotPoint.y, entity.location.x - this.pivotPoint.x)
      const angleToPivot = getAngleInRadiansBetweenTwoPoints(panel.location, this.pivotPoint)
      const newAngle = angleToPivot + angleInRadians
      const newPanelRadians = panel.radians + adjustedAngleInRadians as Radian
      // const newPanelRadians = angleToPivot + adjustedAngleInRadians as Radian
      // const newPanelRadians = angleToPivot + angleInRadians as Radian
      const newDegrees = radiansToAngle(newAngle)
      const entityRadians = angleToRadians(panel.angle as Angle) + newAngle as Radian
      // const entityRadians = angleToRadians(entity.angle as Angle)
      // const updatedEntityAngle = radiansToAngle(newAngle + entityRadians)
      /*      const initialEntityAngle = entity.angle as Angle
       const updatedEntityAngle = addAngles(initialEntityAngle, newDegrees)*/

      // const newDegrees = newAngle * 180 / Math.PI
      // console.log(index)

      // const adjustedAngle = getAngleBetweenTwoPoints(getPos, this.pivotPoint)
      // const getAdjustedAngle = this.multipleToRotateAdjustedAngle.get(id)
      // assertNotNull(getAdjustedAngle)
      // console.log('multipleToRotateAngle', this.multipleToRotateAngle)
      // console.log('getAdjustedAngle', getAdjustedAngle)

      this.multipleToRotateAdjustedRadians.set(id, newPanelRadians)
      assertNotNull(this.multipleToRotateAngle)
      // const newAdjustedAngle = toProperAngle(addAngles(getAdjustedAngle, this.multipleToRotateAngle))
      // console.log('newAdjustedAngle', newAdjustedAngle)
      // console.log('newDegrees', newDegrees)
      // console.log('updatedEntityAngle', updatedEntityAngle)
      // const originalEntityAngle = entity.angle
      // const toRadians = angleToRadians(updatedEntityAngle)
      assertNotNull(this.multipleToRotateRadianLocal)
      // const entityRadiansLocal =
      // entityRadians
      // const getPos = rotateWithAngle(this.pivotPoint, panel.location, this.multipleToRotateAngleLocal as Angle)
      const correctLocation = {
        x: panel.location.x + panel.width / 2,
        y: panel.location.y + panel.height / 2,
      }
      const getPos = rotatePointOffPivot(correctLocation, this.pivotPoint, adjustedAngleInRadians as Radian)
      // const getPos = rotatePointOffPivot(this.pivotPoint, correctLocation, newPanelRadians as Radian)
      // const getPos = rotatePointOffPivot(this.pivotPoint, correctLocation, adjustedAngleInRadians as Radian)
      // const getPos = rotateRadian(this.pivotPoint, correctLocation, this.multipleToRotateRadianLocal as Radisan)
      // const getPos = rotatePointOffPivot(this.pivotPoint, panel.location, this.multipleToRotateRadianLocal as Radian)
      // const getPos = rotatePointOffPivot(this.pivotPoint, entity.location, toRadians)
      // const getPos = rotatePointOffPivot(entity.location, this.pivotPoint, toRadians)
      this.multipleToRotateAdjustedAngle.set(id, newPanelRadians)
      this.multipleToRotateAdjustedLocation.set(id, getPos)

      /*      const panel = this._entitiesStore.select.entityById(id)*/
      const panelLocationX = panel.location.x + panel.width / 2
      // const panelLocationX = entity.location.x + (getPos.x - entity.location.x)
      const panelLocationY = panel.location.y + panel.height / 2
      const panelX = panelLocationX - this.pivotPoint.x
      const panelY = panelLocationY - this.pivotPoint.y
      this.multipleToRotateAdjustedLocationV2.set(id, {
        x: panelX,
        y: panelY,
      })
      this.ctx.save()
      this.ctx.translate(panelX, panelY)
      const entityRotate = panel.radians
      this.ctx.rotate(entityRotate)
      this.ctx.beginPath()
      this.ctx.rect(-panel.width / 2, -panel.height / 2, panel.width, panel.height)
      this.ctx.fill()
      this.ctx.stroke()
      // this.ctx.closePath()
      // this.ctx.translate(-panelX, -panelY)
      // this.ctx.rotate(-entityRotate)
      this.ctx.restore()

      // this.ctx.save()

      rotateStatsArray.push(`${index}:
      x:${roundToTwoDecimals(getPos.x)},
      y:${roundToTwoDecimals(getPos.y)},
      panelX:${roundToTwoDecimals(panelX)},
      panelY:${roundToTwoDecimals(panelY)},
      angle:${roundToTwoDecimals(newDegrees)},
      radian:${roundToTwoDecimals(entityRadians)},`)
    })

    this.ctx.restore()

    this.drawWithUpdated(canvasEntities)

    /*    const rotatingEntities = entities.map(entity => {

     }*/
    // const rotatingEntitiesUpdate = this.rotateMultiple(e)

    // rotateStatsArray.push(`multipleToRotateAngleLocal:${this.multipleToRotateAngleLocal}`)
    // rotateStatsArray.push(`toRadian:${angleToRadians(this.multipleToRotateAngleLocal as Angle)}`)

    // rotateStatsArray.push(`multipleToRotateAngle:${roundToTwoDecimals(this.multipleToRotateAngle)}`)
    // rotateStatsArray.push(`multipleToRotateRadian:${roundToTwoDecimals(this.multipleToRotateRadian)}`)
    rotateStatsArray.push(`multipleToRotateRadianLocal:${this.multipleToRotateRadianLocal}`)
    rotateStatsArray.push(`toAngle:${this.multipleToRotateAngleLocal}`)
    rotateStatsArray.push(`adjustedAngleInRadians:${adjustedAngleInRadians}`)
    // rotateStatsArray.push(`multipleToRotateAdjustedAngle:${roundToTwoDecimals(this.multipleToRotateAdjustedAngle)}`)
    this.rotateStats.innerHTML = rotateStatsArray.join('<br>')

    // this.multipleToRotateAngleLocal = (this.multipleToRotateAngleLocal + this.multipleToRotateAngle + 360) % 360
    // console.log('multipleToRotateAngleLocal', this.multipleToRotateAngleLocal)
    this._startPoint = currentPoint
  }

  drawWithUpdated(entities: CanvasEntity[]) {
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.save()
    // this._
    entities.forEach(entity => {

      this.ctx.save()
      const angle = this.multipleToRotateAdjustedAngle.get(entity.id)
      const location = this.multipleToRotateAdjustedLocation.get(entity.id)
      assertNotNull(angle)
      assertNotNull(location)

      // const panelX = location.x + entity.
      this.ctx.translate(location.x, location.y)
      // this.ctx.rotate(entity.radians)
      this.ctx.rotate(angle)
      this.ctx.beginPath()
      this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
      this.ctx.fill()
      this.ctx.stroke()
      this.ctx.restore()
    })

    this.ctx.restore()
    // this.ctx.closePath()
  }

  calculateRotatedLocation(entity: CanvasEntity) {
    const pivotPoint = this.pivotPoint
    assertNotNull(pivotPoint)
    const angle = this.multipleToRotateAngleLocal
    const transformedLocation = this._domPointService.getTransformedPointFromXy(entity.location)

    // return rotatePointOffPivot(transformedLocation, pivotPoint, angle)
  }

  getEntityRotation(entity: CanvasEntity) {
    if (!this.pivotPoint) return
    const pivotPoint = this.pivotPoint
    // assertNotNull(pivotPoint)
    const dx = entity.location.x - pivotPoint.x
    const dy = entity.location.y - pivotPoint.y
    return (Math.atan2(dy, dx) * 180 / Math.PI) + 90 // add 90 to adjust for starting position
  }

  calculatePivotPointPosition() {
    // Calculate average position of all entities to be rotated
    const entities = this.multipleToRotateIds.map(id => this._entitiesStore.select.entityById(id))

    // const center = getCenterOfEntities(entities)

    const totalX = entities.reduce((acc, entity) => acc + entity.location.x, 0)
    const totalY = entities.reduce((acc, entity) => acc + entity.location.y, 0)
    const pivotX = totalX / entities.length
    const pivotY = totalY / entities.length

    /*    const transformedPoint = this._domPointService.getTransformedPointFromXy(entities[0].location)
     // const transformedPoints = entities.map(entity => this._domPointService.getTransformedPointFromEntity(entity))
     const pivotX = transformedPoint.x - 100
     const pivotY = transformedPoint.y - 100*/

    // return { x: 0, y: 0 }
    return { x: pivotX, y: pivotY }
  }

  clearEntityToRotate() {
    if (this.entityToRotateId && this.entityToRotateAngle) {
      const storeUpdate = updateObjectByIdForStore(this.entityToRotateId, { angle: this.entityToRotateAngle })
      this._entitiesStore.dispatch.updateCanvasEntity(storeUpdate)
    }
    if (this.multipleToRotateIds.length && this.multipleToRotateAngle) {
      const storeUpdates = this.multipleToRotateIds.map(id => {
        const entity = this._entitiesStore.select.entityById(id)
        // const rotatedLocation = this.calculateRotatedLocation(entity)
        const location = this.multipleToRotateAdjustedLocation.get(entity.id)
        assertNotNull(location)
        /*        const angleDiff = this.multipleToRotateAngleMap.get(entity.id)
         assertNotNull(angleDiff)
         const angle = toProperAngle(this.multipleToRotateAngleLocal - angleDiff)*/
        // const angle = this.multipleToRotateAngleLocal + angleDiff
        const angle = this.multipleToRotateAdjustedAngle.get(entity.id)
        assertNotNull(angle)
        const radians = this.multipleToRotateAdjustedRadians.get(entity.id)
        assertNotNull(radians)
        // const angle = this.multipleToRotateAngleLocal

        return updateObjectByIdForStore(id, { location, angle, radians })

        // return updateObjectByIdForStore(id, { location: rotatedLocation, angle: this.multipleToRotateAngle })
      })
      // const rotatingEntities = this.multipleToRotateIds.map(id => this._entitiesStore.select.entityById(id))
      // const storeUpdates2 = this.rotateMultiple(rotatingEntities)
      // const storeUpdates = this.multipleToRotateIds.map(id => updateObjectByIdForStore(id, { angle: this.multipleToRotateAngle }))
      this._entitiesStore.dispatch.updateManyCanvasEntities(storeUpdates)
    }
    this.entityToRotateId = undefined
    this._startPoint = undefined
    this._startRotateAngleToMouse = undefined
    this.entityToRotateAngle = undefined
    this.multipleToRotateIds = []
    this.multipleToRotateAngle = undefined
  }

  /*  constructor() {
   this._store.dispatch(CanvasActions['Start Rotate']({ x: 0, y: 0 }))
   }

   public startRotate(event: MouseEvent) {
   const { x, y } = eventToXyLocation(event)
   this._store.dispatch(CanvasActions['Start Rotate']({ x, y }))
   }

   public rotate(event: MouseEvent) {
   const { x, y } = eventToXyLocation(event)
   this._store.dispatch(CanvasActions['Rotate']({ x, y }))
   }

   public startMove(event: MouseEvent) {
   const { x, y } = eventToXyLocation(event)
   this._store.dispatch(CanvasActions['Start Move']({ x, y }))
   }

   public move(event: MouseEvent) {
   const { x, y } = eventToXyLocation(event)
   this._store.dispatch(CanvasActions['Move']({ x, y }))
   }

   public startResize(event: MouseEvent) {
   const { x, y } = eventToXyLocation(event)
   this._store.dispatch(CanvasActions['Start Resize']({ x, y }))
   }

   public resize(event: MouseEvent) {
   const { x, y } = eventToXyLocation(event)
   this._store.dispatch(CanvasActions['Resize']({ x, y }))
   }

   public startMoveText(event: MouseEvent) {
   const { x, y } = eventToXyLocation(event)
   this._store.dispatch(CanvasActions['Start Move Text']({ x, y }))
   }

   public moveText(event: MouseEvent) {
   const { x, y } = eventToXyLocation(event)
   this._store.dispatch(CanvasActions['Move Text']({ x, y }))
   }

   public startResizeText(event: MouseEvent) {
   const { x, y } = eventToXyLocation(event)
   this._store.dispatch(CanvasActions['Start Resize Text']({ x, y }))
   }

   public resizeText(event: MouseEvent) {
   const { x, y } = eventToXyLocation(event)
   this._store.dispatch(CanvasActions['Resize Text']({
   x,
   y,
   }))
   }*/

}