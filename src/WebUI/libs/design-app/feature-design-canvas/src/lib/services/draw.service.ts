import { inject, Injectable } from '@angular/core'
import { CanvasElementService } from './canvas-element.service'
import { CANVAS_COLORS, CanvasEntity } from '../types'
import { DomPointService } from './dom-point.service'
import { RotateState } from '../utils/draw'
import { CanvasAppStateStore } from './canvas-app-state'
import { CanvasObjectPositioningService } from './canvas-object-positioning.service'
import { CanvasEntitiesStore } from './canvas-entities'
import { assertNotNull } from '@shared/utils'

@Injectable({
  providedIn: 'root',
})
export class DrawService {
  private _canvasElementService = inject(CanvasElementService)
  private _domPointService = inject(DomPointService)
  private _appState = inject(CanvasAppStateStore)
  private _entitiesStore = inject(CanvasEntitiesStore)
  private _objectPositioning = inject(CanvasObjectPositioningService)

  get ctx() {
    return this._canvasElementService.ctx
  }

  get canvas() {
    return this._canvasElementService.canvas
  }

  get appState() {
    return this._appState.select.state
  }

  get rotateState() {
    return {
      singleToRotateId:            this._objectPositioning.entityToRotateId,
      singleToRotateAngle:         this._objectPositioning.entityToRotateAngle,
      multipleToRotateIds:         this._objectPositioning.multipleToRotateIds,
      multipleToRotateAngleMap:    this._objectPositioning.multipleToRotateAdjustedAngle,
      multipleToRotateLocationMap: this._objectPositioning.multipleToRotateAdjustedLocation,
    } as RotateState
  }

  get entities() {
    return this._entitiesStore.select.entities
  }

  drawEntities() {
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
    const appState = this.appState
    const rotateState = this.rotateState

    let fillStyle: string = CANVAS_COLORS.DefaultPanelFillStyle

    const isBeingHovered = appState.hoveringEntityId === entity.id
    if (isBeingHovered) {
      fillStyle = '#17fff3'
    }

    const isSingleSelected = appState.selectedId === entity.id
    const isMultiSelected =
            appState.selectedIds && appState.selectedIds.find((id) => id === entity.id)

    if (isSingleSelected) {
      fillStyle = '#ff6e78'
    }

    if (isMultiSelected) {
      fillStyle = '#ff6e78'
    }

    const isInMultiRotate = rotateState.multipleToRotateIds.includes(entity.id)
    const isInSingleRotate = rotateState.singleToRotateId === entity.id

    if (isInMultiRotate) {
      this.handleMultipleRotationDraw(entity)
      return
    }
    if (isInSingleRotate) {
      this.handleSingleRotationDraw(entity)
      return
    }

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

  private handleSingleRotationDraw(entity: CanvasEntity) {
    const rotateState = this.rotateState
    const angle = rotateState.singleToRotateAngle
    assertNotNull(angle, 'angle should not be null')

    this.ctx.save()
    this.ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
    this.ctx.rotate(angle)
    this.ctx.beginPath()
    this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.restore()
  }

  private handleMultipleRotationDraw(entity: CanvasEntity) {
    const rotateState = this.rotateState
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
    this.ctx.restore()
  }

}