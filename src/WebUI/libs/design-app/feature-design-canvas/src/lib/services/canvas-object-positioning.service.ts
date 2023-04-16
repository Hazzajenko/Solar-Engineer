import { inject, Injectable } from '@angular/core'
import { CanvasEntity, TransformedPoint, updateObjectByIdForStore } from '../types'
import { DomPointService } from './dom-point.service'
import { CanvasEntitiesStore } from './canvas-entities'
import { roundToTwoDecimals } from 'design-app/utils'
import { CanvasElementService } from './canvas-element.service'
import { Point } from '@shared/data-access/models'
import { assertNotNull } from '@shared/utils'
import { getAngleInRadiansBetweenTwoPoints, Radian, rotatePointOffPivot } from '../utils'

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
  multipleToRotateAdjustedAngle: Map<string, number> = new Map()
  multipleToRotateAdjustedLocation: Map<string, Point> = new Map()

  pivotPoint: Point | undefined = undefined
  currentCenterPoint!: Point
  currentMousePoint!: Point

  private _startPoint: Point | undefined = undefined
  private _startRotateAngleToMouse: number | undefined = undefined
  private _startRotateRadiansToMouse: number | undefined = undefined

  startPointToCurrentPointAngleInRadians: Radian | undefined = undefined
  startPointToPivotPointAngleInRadians: Radian | undefined = undefined

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
    this.multipleToRotateIds = entities.map(entity => entity.id)
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
    const radians = Math.atan2(currentPoint.y - entityLocation.y, currentPoint.x - entityLocation.x)
    const degrees = radians * 180 / Math.PI
    this.entityToRotateAngle = degrees - this._startRotateAngleToMouse
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
    const adjustedAngleRadians = angleInRadians - this.startPointToPivotPointAngleInRadians as Radian
    canvasEntities.forEach(entity => {
      /*      const correctLocation = {
       x: entity.location.x + entity.width / 2,
       y: entity.location.y + entity.height / 2,
       }*/
      const getPos = rotatePointOffPivot(entity.location, pivotPoint, adjustedAngleRadians as Radian)
      // const getPos = rotatePointOffPivot(correctLocation, pivotPoint, adjustedAngleRadians as Radian)
      this.multipleToRotateAdjustedAngle.set(entity.id, adjustedAngleRadians)
      this.multipleToRotateAdjustedLocation.set(entity.id, getPos)
    })
  }

  /* drawWithUpdated(entities: CanvasEntity[]) {
   // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
   this.ctx.save()
   // this._
   entities.forEach(entity => {

   this.ctx.save()
   const angle = this.multipleToRotateAdjustedAngle.get(entity.id)
   const location = this.multipleToRotateAdjustedLocation.get(entity.id)
   assertNotNull(angle)
   assertNotNull(location)
   /!*  location = {
   x: location.x - entity.width / 2,
   y: location.y - entity.height / 2,
   }*!/

   // const panelX = location.x + entity.
   this.ctx.translate(location.x, location.y)
   // this.ctx.rotate(entity.radians)
   // console.log('angle', angle)
   this.ctx.rotate(angle)

   this.ctx.beginPath()
   if (entity.id === entities[0].id) {
   this.ctx.fillStyle = '#17fff3'
   }
   this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
   this.ctx.fill()
   this.dotsToPush.push(location)
   // this.ctx.arc(location.x, location.y, 3, 0, Math.PI * 2, true)
   this.ctx.stroke()
   this.ctx.restore()
   })

   this.ctx.restore()
   // this.ctx.closePath()
   }*/

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

        return updateObjectByIdForStore(id, { location, angle, radians: angle as Radian })
      })
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