import { inject, Injectable } from '@angular/core'
import { CanvasElementService } from './canvas-element.service'
import { CANVAS_COLORS, CanvasEntity, EntityLocation } from '../types'
import { DomPointService } from './dom-point.service'
import { CanvasAppStateStore } from './canvas-app-state'
import { CanvasEntitiesStore } from './canvas-entities'
import { assertNotNull } from '@shared/utils'
import { CanvasClientStateService } from './canvas-client-state/canvas-client-state.service'

@Injectable({
  providedIn: 'root',
})
export class CanvasRenderService {
  private _canvasElementService = inject(CanvasElementService)
  private _domPointService = inject(DomPointService)
  private _appState = inject(CanvasAppStateStore)
  private _entitiesStore = inject(CanvasEntitiesStore)
  private _clientState = inject(CanvasClientStateService)

  get ctx() {
    return this._canvasElementService.ctx
  }

  get canvas() {
    return this._canvasElementService.canvas
  }

  get appState() {
    return this._appState.select.state
  }

  get entities() {
    return this._entitiesStore.select.entities
  }

  drawCanvas() {
    this.ctx.save()
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.restore()
    this.ctx.beginPath()
    this.entities.forEach((entity) => {
      this.drawEntity(entity)
    })
    this.ctx.closePath()
    // this.ctx.restore()
  }

  private drawEntity(entity: CanvasEntity) {
    let fillStyle: string = CANVAS_COLORS.DefaultPanelFillStyle
    // const { hoveringEntityId, selectedId, selectedIds } = this.appState
    // const { singleToRotateId, multipleToRotateIds } = this.rotateState
    const { hoveringEntityId, singleSelectedId, multiSelectedIds, multiToRotateEntities, singleToRotateEntity } = this._clientState.state

    const isBeingHovered = hoveringEntityId === entity.id
    if (isBeingHovered) {
      fillStyle = '#17fff3'
    }

    const isSingleSelected = singleSelectedId === entity.id
    const isMultiSelected = multiSelectedIds && multiSelectedIds.find((id) => id === entity.id)

    if (isSingleSelected) {
      fillStyle = '#ff6e78'
    }

    if (isMultiSelected) {
      fillStyle = '#ff6e78'
    }

    const isInMultiRotate = multiToRotateEntities.find((e) => e.id === entity.id)
    // const isInMultiRotate = multiToRotateEntities.includes(entity.id)
    const isInSingleRotate = !!singleToRotateEntity && singleToRotateEntity.id === entity.id
    // const isInSingleRotate = singleToRotateId === entity.id

    if (isInMultiRotate) {
      this.handleMultipleRotationDraw(entity)
      return
    }
    if (isInSingleRotate) {
      this.handleSingleRotationDraw(entity)
      return
    }

    /*    const isDragging =
     this._objectPositioning.singleToMoveId === entity.id &&
     !!this._objectPositioning.singleToMoveLocation*/
    const isDragging2 =
            !!this._clientState.singleToMoveEntity &&
            this._clientState.singleToMoveEntity.id === entity.id
    if (isDragging2) {
      assertNotNull(this._clientState.singleToMoveEntity)
      this.handleDraggingEntityDraw(entity, this._clientState.singleToMoveEntity)
      return
    }
    /*    const isDragging =
     !!this._objectPositioning.singleToMove &&
     this._objectPositioning.singleToMove.id === entity.id
     if (isDragging) {
     assertNotNull(this._objectPositioning.singleToMove)
     this.handleDraggingEntityDraw(entity, this._objectPositioning.singleToMove)
     return
     }*/

    this.ctx.save()
    this.ctx.fillStyle = fillStyle
    this.ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
    this.ctx.rotate(entity.angle)
    this.ctx.beginPath()
    this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.restore()
  }

  private handleDraggingEntityDraw(entity: CanvasEntity, singleToMove: EntityLocation) {
    // const { singleToMoveId, singleToMoveLocation } = this._objectPositioning
    // assertNotNull(singleToMoveLocation)
    // if (singleToMoveId !== entity.id) return
    this.ctx.save()
    this.ctx.translate(
      singleToMove.location.x + entity.width / 2,
      singleToMove.location.y + entity.height / 2,
    )
    this.ctx.rotate(entity.angle)

    this.ctx.beginPath()
    this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.restore()
  }

  private handleSingleRotationDraw(entity: CanvasEntity) {
    /*    const rotateState = this.rotateState
     const angle = rotateState.singleToRotateAngle
     assertNotNull(angle, 'angle should not be null')

     this.ctx.save()
     this.ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
     this.ctx.rotate(angle)
     this.ctx.beginPath()
     this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
     this.ctx.fill()
     this.ctx.stroke()
     this.ctx.restore()*/
  }

  private handleMultipleRotationDraw(entity: CanvasEntity) {
    /*    // const rotateState = this.rotateState
     const angle = rotateState.multipleToRotateAngleMap.get(entity.id)
     const location = rotateState.multipleToRotateLocationMap.get(entity.id)
     assertNotNull(angle)
     assertNotNull(location)

     this.ctx.save()
     this.ctx.translate(location.x + entity.width / 2, location.y + entity.height / 2)
     this.ctx.rotate(angle)

     this.ctx.beginPath()
     this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
     this.ctx.fill()
     this.ctx.stroke()
     this.ctx.restore()*/
  }

}