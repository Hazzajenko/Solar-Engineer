import { inject, Injectable } from '@angular/core'
import { CanvasEntity, ObjectSize, TransformedPoint, updateObjectByIdForStore } from '../types'
import { DomPointService } from './dom-point.service'
import { CanvasEntitiesStore } from './canvas-entities'
import { roundToTwoDecimals } from 'design-app/utils'
import { CanvasElementService } from './canvas-element.service'

@Injectable({
  providedIn: 'root',
})
export class CanvasObjectPositioningService {
  private _entitiesStore = inject(CanvasEntitiesStore)
  private _domPointService = inject(DomPointService)
  private _canvasElementsService = inject(CanvasElementService)

  entityToRotate: CanvasEntity | null = null
  entityToRotateId: string | undefined = undefined
  entityToRotateAngle: number | undefined = undefined

  entityToMove: CanvasEntity | null = null
  entityToResize: CanvasEntity | null = null

  private _startPoint: DOMPoint | undefined = undefined
  private _startRotateAngleToMouse: number | undefined = undefined

  get ctx() {
    return this._canvasElementsService.ctx
  }

  setEntityToRotate(entity: CanvasEntity, startPoint: TransformedPoint) {
    this.entityToRotate = entity
    this.entityToRotateId = entity.id
    this._startPoint = startPoint
    const rotateAngleToMouse = roundToTwoDecimals(
      Math.atan2(startPoint.y - entity.location.y, startPoint.x - entity.location.x) * (180 / Math.PI),
    )
    this._startRotateAngleToMouse = rotateAngleToMouse
    console.log('_startRotateAngleToMouse', rotateAngleToMouse)
    console.log('setEntityToRotate', entity, startPoint)
  }

  rotateEntityViaWheel(event: WheelEvent) {
    if (!this.entityToRotateId) return
    const rotateBy = event.deltaY < 0
      ? 10
      : -10
    this._entitiesStore.dispatch.rotateCanvasEntity(this.entityToRotateId, rotateBy)
  }

  rotateEntityViaMouse(event: MouseEvent, entityLocation: TransformedPoint, size: ObjectSize) {
    // console.log('rotateEntityViaMouse', event, entityLocation)
    if (!this.entityToRotateId) return
    if (!this._startPoint) return
    if (!this._startRotateAngleToMouse) return
    const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
    /*    let rotateByX: number
     if (event.y < entityLocation.y) {
     rotateByX = currentPoint.x - this._startPoint.x
     } else {
     rotateByX = this._startPoint.x - currentPoint.x
     }
     let rotateByY: number
     if (event.x < entityLocation.x) {
     rotateByY = this._startPoint.y - currentPoint.y
     } else {
     rotateByY = currentPoint.y - this._startPoint.y
     }
     let rotateBy = rotateByX + rotateByY

     let distanceFromMouseToEntity = Math.sqrt(Math.pow(event.x - entityLocation.x, 2) + Math.pow(event.y - entityLocation.y, 2))
     distanceFromMouseToEntity = distanceFromMouseToEntity / 25
     // console.log('distanceFromMouseToEntity', distanceFromMouseToEntity)

     rotateBy = rotateBy / distanceFromMouseToEntity*/
    // rotateBy = roundToTwoDecimals(rotateBy)
    // console.log(this._domPointService.rect)

    // const radianY
    const radians = Math.atan2(currentPoint.y - entityLocation.y, currentPoint.x - entityLocation.x)
    // console.log('radians', radians)
    // const radians = Math.atan2(currentPoint.y, currentPoint.x)
    // const radians = Math.atan2(mouseY - entity.y, mouseX - entity.x);
    const degrees = radians * 180 / Math.PI
    // console.log('degrees', degrees)
    // const rotateByDegrees = this._startRotateAngleToMouse - degrees
    // console.log('rotateByDegrees', rotateByDegrees)
    this.entityToRotateAngle = degrees - this._startRotateAngleToMouse

    /*    this.ctx.beginPath()
     this.ctx.save()
     this.ctx.translate(entityLocation.x + size.width / 2, entityLocation.y + size.height / 2)
     this.ctx.rotate(rotateByDegrees * Math.PI / 180)
     this.ctx.rect(-size.width / 2, -size.height / 2, size.width, size.height)
     this.ctx.fill()
     this.ctx.stroke()
     this.ctx.restore()*/

    // rotateBy = rotateBy / 100

    // console.log('rotateBy', rotateBy)

    // this._entitiesStore.dispatch.setCanvasEntityRotation(this.entityToRotateId, rotateByDegrees)
    // this._entitiesStore.dispatch.rotateCanvasEntity(this.entityToRotateId, rotateBy)
    this._startPoint = currentPoint
    /*    const rotateBy = event.movementX
     this._entitiesStore.dispatch.rotateCanvasEntity(this.entityToRotateId, rotateBy)*/
  }

  clearEntityToRotate() {
    if (!this.entityToRotateId) return
    if (!this.entityToRotateAngle) return
    const storeUpdate = updateObjectByIdForStore(this.entityToRotateId, { angle: this.entityToRotateAngle })
    this._entitiesStore.dispatch.updateCanvasEntity(storeUpdate)
    this.entityToRotate = null
    this.entityToRotateId = undefined
    this._startPoint = undefined
    this._startRotateAngleToMouse = undefined
    this.entityToRotateAngle = undefined

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