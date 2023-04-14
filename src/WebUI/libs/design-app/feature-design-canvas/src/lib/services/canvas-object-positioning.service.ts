import { inject, Injectable } from '@angular/core'
import { CanvasEntity, TransformedPoint, updateObjectByIdForStore } from '../types'
import { DomPointService } from './dom-point.service'
import { CanvasEntitiesStore } from './canvas-entities'
import { roundToTwoDecimals } from 'design-app/utils'
import { CanvasElementService } from './canvas-element.service'
import { XyLocation } from '@shared/data-access/models'
import { assertNotNull } from '@shared/utils'

@Injectable({
  providedIn: 'root',
})
export class CanvasObjectPositioningService {
  private _entitiesStore = inject(CanvasEntitiesStore)
  private _domPointService = inject(DomPointService)
  private _canvasElementsService = inject(CanvasElementService)

  entityToRotateId: string | undefined = undefined
  entityToRotateAngle: number | undefined = undefined

  multipleToRotateIds: string[] = []
  multipleToRotateAngle: number | undefined = undefined
  multipleToRotateMap: Map<string, number> = new Map()

  pivotPoint: XyLocation | undefined = undefined

  entityToMove: CanvasEntity | null = null
  entityToResize: CanvasEntity | null = null

  private _startPoint: DOMPoint | undefined = undefined
  private _startRotateAngleToMouse: number | undefined = undefined

  get ctx() {
    return this._canvasElementsService.ctx
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
    this._startRotateAngleToMouse = roundToTwoDecimals(
      Math.atan2(startPoint.y - entities[0].location.y, startPoint.x - entities[0].location.x) * (180 / Math.PI),
    )
    console.log('setMultipleToRotate', this._startRotateAngleToMouse)
    console.log('multipleToRotateIds', this.multipleToRotateIds)
    console.log('_startPoint', this._startPoint)
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

  rotateMultipleEntitiesViaMouse(event: MouseEvent, entityLocations: TransformedPoint[]) {
    if (!this.multipleToRotateIds.length) return
    if (!this._startPoint) return
    if (!this._startRotateAngleToMouse) return

    this.pivotPoint = this.calculatePivotPointPosition()
    console.log('rotateMultipleEntitiesViaMouse', this.pivotPoint)
    // const pivot = this.calculatePivotPointPosition()
    // console.log('rotateMultipleEntitiesViaMouse')
    const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
    // assertNotNull(this._startRotateAngleToMouse)
    const radians = Math.atan2(currentPoint.y - this.pivotPoint.y, currentPoint.x - this.pivotPoint.x)
    /*    const radians = Math.atan2(currentPoint.y - pivot.y, currentPoint.x - pivot.x)
     this.multipleToRotateIds.forEach((id, index) => {
     // this.rotateEntityViaMouse(event, entityLocations[index], pivotPoint, id)
     const entity = this._entitiesStore.select.entityById(id)
     assertNotNull(entity)
     const angleToPivot = Math.atan2(entity.location.y - pivot.y, entity.location.x - pivot.x)
     const newAngle = angleToPivot + radians
     const newDegrees = newAngle * 180 / Math.PI
     this.multipleToRotateMap.set(this.multipleToRotateIds[index], newDegrees)
     // this._entitiesStore.dispatch.rotateCanvasEntity(id, newDegrees)
     })*/

    entityLocations.forEach((entityLocation, index) => {
      assertNotNull(this.pivotPoint)
      const angleToPivot = Math.atan2(entityLocation.y - this.pivotPoint.y, entityLocation.x - this.pivotPoint.x)
      const newAngle = angleToPivot + radians
      const newDegrees = newAngle * 180 / Math.PI
      this.multipleToRotateMap.set(this.multipleToRotateIds[index], newDegrees)
      /*     const entity = this.getEntityById(id);
       const angleToPivot = Math.atan2(entity.y - pivot.y, entity.x - pivot.x);
       const newAngle = angleToPivot + radians;
       const newDegrees = newAngle * 180 / Math.PI;
       this._entitiesStore.dispatch.rotateCanvasEntity(id, newDegrees);*/
      /*      assertNotNull(this._startRotateAngleToMouse)
       const radians = Math.atan2(currentPoint.y - entityLocation.y, currentPoint.x - entityLocation.x)
       const degrees = radians * 180 / Math.PI
       this.multipleToRotateAngle = degrees - this._startRotateAngleToMouse
       this.multipleToRotateMap.set(this.multipleToRotateIds[index], this.multipleToRotateAngle)*/
    })
    // assertNotNull(this._startRotateAngleToMouse)
    // const radians = Math.atan2(currentPoint.y - entityLocations[0].y, currentPoint.x - entityLocations[0].x)
    const degrees = radians * 180 / Math.PI
    this.multipleToRotateAngle = degrees - this._startRotateAngleToMouse
    this._startPoint = currentPoint
  }

  calculatePivotPointPosition() {
    // Calculate average position of all entities to be rotated
    const entities = this.multipleToRotateIds.map(id => this._entitiesStore.select.entityById(id))

    /*    const totalX = entities.reduce((acc, entity) => acc + entity.location.x, 0)
     const totalY = entities.reduce((acc, entity) => acc + entity.location.y, 0)
     const pivotX = totalX / entities.length
     const pivotY = totalY / entities.length*/

    const transformedPoint = this._domPointService.getTransformedPointFromXy(entities[0].location)
    // const transformedPoints = entities.map(entity => this._domPointService.getTransformedPointFromEntity(entity))
    const pivotX = transformedPoint.x - 100
    const pivotY = transformedPoint.y - 100

    return { x: pivotX, y: pivotY }
  }

  clearEntityToRotate() {
    if (this.entityToRotateId && this.entityToRotateAngle) {
      const storeUpdate = updateObjectByIdForStore(this.entityToRotateId, { angle: this.entityToRotateAngle })
      this._entitiesStore.dispatch.updateCanvasEntity(storeUpdate)
    }
    if (this.multipleToRotateIds.length && this.multipleToRotateAngle) {
      const storeUpdates = this.multipleToRotateIds.map(id => updateObjectByIdForStore(id, { angle: this.multipleToRotateAngle }))
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