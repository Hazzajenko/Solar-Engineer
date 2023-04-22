import { inject, Injectable } from '@angular/core'
import { CanvasElementService } from '../canvas-element.service'
import { CANVAS_COLORS, CanvasEntity, EntityLocation, isPanel, SizeByType } from '../../types'
import { DomPointService } from '../dom-point.service'
import { CanvasAppStateStore } from '../canvas-app-state'
// import { CanvasEntitiesStore } from './canvas-entities'
import { assertNotNull } from '@shared/utils'
import { CanvasClientStateService, MultipleToMove, SingleToMove } from '../canvas-client-state'
import { CANVAS_MODE } from '../canvas-client-state/types/mode'
import { getAllAvailableEntitySpotsBetweenTwoPoints } from '../../utils'

@Injectable({
  providedIn: 'root',
})
export class CanvasRenderService {
  private _canvasElementService = inject(CanvasElementService)
  private _domPointService = inject(DomPointService)
  private _appState = inject(CanvasAppStateStore)
  // private _entitiesStore = inject(CanvasEntitiesStore)
  private _state = inject(CanvasClientStateService)

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
    return this._state.entities.canvasEntities.getEntities()
  }

  drawCanvas() {
    this.ctx.save()
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.restore()
    this.ctx.save()
    this.ctx.beginPath()
    const entities = this._state.entities.canvasEntities.getEntities()
    entities.forEach((entity) => {
      this.drawEntity(entity)
    })
    this.ctx.restore()
  }

  drawCanvasWithFunction(fn: (ctx: CanvasRenderingContext2D) => void) {
    this.drawCanvas()
    this.ctx.save()
    fn(this.ctx)
    this.ctx.restore()
  }

  drawDragBox(event: MouseEvent) {
    const start = this._state.state.dragBox.start
    if (!start) {
      console.log('drawDragBox', 'no start')
      return
    }

    const { mode } = this._state.mode
    // console.log('drawDragBox MODE', mode)
    const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
    // const { start } = dragBox
    // const { x: startX, y: startY } = start
    // const { x: endX, y: endY } = end
    const width = currentPoint.x - start.x
    const height = currentPoint.y - start.y
    this.drawCanvas()
    this.ctx.save()
    this.ctx.beginPath()
    // this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    // this.ctx.strokeStyle = CANVAS_COLORS.DragBoxStrokeStyle
    this.ctx.globalAlpha = 0.4
    this.ctx.strokeStyle = mode === CANVAS_MODE.SELECT
      ? CANVAS_COLORS.SelectionBoxFillStyle
      : CANVAS_COLORS.CreationBoxFillStyle
    /*      ? CANVAS_COLORS.PreviewPanelFillStyle
     : CANVAS_COLORS.TakenSpotFillStyle*/
    this.ctx.lineWidth = 1
    this.ctx.rect(start.x, start.y, width, height)
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.closePath()
    this.ctx.restore()

    if (mode !== CANVAS_MODE.CREATE) return
    const spots = getAllAvailableEntitySpotsBetweenTwoPoints(start, currentPoint, this.entities)
    // const spots = this._objectPositioning.getAllAvailableEntitySpotsBetweenTwoPoints(start, currentPoint)
    if (!spots) return

    const { type } = this._state.mode
    const entitySize = SizeByType[type]

    this.ctx.save()
    spots.forEach(spot => {
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.globalAlpha = 0.4
      this.ctx.fillStyle = spot.vacant
        ? CANVAS_COLORS.PreviewPanelFillStyle
        : CANVAS_COLORS.TakenSpotFillStyle
      this.ctx.rect(spot.x, spot.y, entitySize.width, entitySize.height)
      this.ctx.fill()
      this.ctx.stroke()
      this.ctx.restore()
    })
    this.ctx.restore()
    /*    this.ctx.save()
     this.ctx.beginPath()
     this.ctx.globalAlpha = 0.4
     this.ctx.fillStyle = CANVAS_COLORS.SelectionBoxFillStyle
     this.ctx.rect(this.selectionBoxStartPoint.x, this.selectionBoxStartPoint.y, width, height)
     this.ctx.fill()
     this.ctx.stroke()
     this.ctx.restore()*/
  }

  private drawEntity(entity: CanvasEntity) {
    // console.log('drawEntity', entity)
    let fillStyle: string = CANVAS_COLORS.DefaultPanelFillStyle
    // const { hoveringEntityId, selectedId, selectedIds } = this.appState
    // const { singleToRotateId, multipleToRotateIds } = this.rotateState
    // const { hoveringEntityId, singleSelectedId, multiSelectedIds, multiToRotateEntities, singleToRotateEntity } = this._clientState.state
    const { toMove, toRotate, selected, hover } = this._state.state
    const isBeingHovered = !!hover.hoveringEntityId && hover.hoveringEntityId === entity.id
    // const isBeingHovered = hoveringEntityId === entity.id
    if (isBeingHovered) {
      fillStyle = '#17fff3'
    }

    const isSingleSelected = !!selected.singleSelectedId && selected.singleSelectedId === entity.id

    if (isSingleSelected) {
      // fillStyle = '#ff6e78'
      fillStyle = CANVAS_COLORS.SelectedPanelFillStyle
    }

    const isMultiSelected = selected.multipleSelectedIds.includes(entity.id)
    // const isMultiSelected = selected.ids.includes(entity.id)
    // const isMultiSelected = multiSelectedIds && multiSelectedIds.find((id) => id === entity.id)

    /*
     const isSingleSelected = singleSelectedId === entity.id
     const isMultiSelected = multiSelectedIds && multiSelectedIds.find((id) => id === entity.id)
     */

    if (isMultiSelected) {
      fillStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
      // fillStyle = '#ff6e78'
    }

    if (isPanel(entity)) {
      const isStringSelected = selected.selectedStringId === entity.stringId
      if (isStringSelected && selected.selectedStringId && entity.stringId) {
        fillStyle = CANVAS_COLORS.StringSelectedPanelFillStyle
        // fillStyle = '#d323ff'
        // console.log('drawEntity', 'isStringSelected', entity, selected.selectedStringId, entity.stringId)
      }
    }

    // const isInMultiRotate = toRotate.ids.includes(entity.id)

    // const isInMultiRotate = multiToRotateEntities.find((e) => e.id === entity.id)
    // const isInMultiRotate = multiToRotateEntities.includes(entity.id)
    // const isInSingleRotate = !!singleToRotateEntity && singleToRotateEntity.id === entity.id
    // const isInSingleRotate = singleToRotateId === entity.id
    const multipleToRotate = toRotate.multipleToRotate
    const isInMultiRotate = !!multipleToRotate && multipleToRotate.ids.includes(entity.id)
    if (isInMultiRotate) {
      this.handleMultipleRotationDraw(entity)
      return
    }

    const isInSingleRotate = !!toRotate.singleToRotate && toRotate.singleToRotate.id === entity.id
    if (isInSingleRotate) {
      this.handleSingleRotationDraw(entity)
      return
    }

    /*    const isDragging =
     this._objectPositioning.singleToMoveId === entity.id &&
     !!this._objectPositioning.singleToMoveLocation*/
    /*    const isDragging2 =
     !!this._clientState.singleToMoveEntity &&
     this._clientState.singleToMoveEntity.id === entity.id*/
    // console.log('toMove', toMove)

    if (isSingleDragging(entity, toMove.singleToMove)) {
      // console.log('isDragging')
      // assertNotNull(toMove.singleToMove)
      this.handleDraggingEntityDraw(entity, toMove.singleToMove)
      return
    }

    /*    const isDragging2 = !!toMove.singleToMove && toMove.singleToMove.id === entity.id
     if (isDragging2) {
     // console.log('isDragging2')
     assertNotNull(toMove.singleToMove)
     this.handleDraggingEntityDraw(entity, toMove.singleToMove)
     return
     }*/

    if (isMultipleDragging(entity, toMove.multipleToMove)) {
      // console.log('isDragging')
      // assertNotNull(toMove.singleToMove)
      this.handleMultipleMoveDraw(entity, toMove.multipleToMove)
      return
    }

    const nearbyEntityIds = this._state.nearby.ids
    const isNearby = nearbyEntityIds.includes(entity.id)
    // const findNearby = nearbyEntityIds.find((id) => id === entity.id)
    // console.log('isNearby', entity.id, nearbyEntityIds)
    if (isNearby) {
      // console.log('isNearby', entity.id)
      fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
    }

    /*    const isInMultiMove = !!toMove.multipleToMove && toMove.multipleToMove.ids.includes(entity.id)
     if (isInMultiMove) {
     this.handleMultipleMoveDraw(entity)
     return
     }*/
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
    // console.log('handleDraggingEntityDraw', singleToMove)
    this.ctx.save()
    this.ctx.fillStyle = CANVAS_COLORS.HoveredPanelFillStyle
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

  private handleMultipleMoveDraw(entity: CanvasEntity, multipleToMove: MultipleToMove) {
    // const { singleToMoveId, singleToMoveLocation } = this._objectPositioning
    // assertNotNull(singleToMoveLocation)
    // if (singleToMoveId !== entity.id) return
    // console.log('handleDraggingEntityDraw', singleToMove)
    // const multipleToMove = this._state.toMove.multipleToMove
    // assertNotNull(multipleToMove)
    // const multiType = typeof mult/**/ipleToMove
    // const entityToMove = multipleToMove.entities.find((e) => e.id === entity.id)
    // assertNotNull(entityToMove)
    const offset = multipleToMove.offset
    // entityToMove.
    this.ctx.save()
    this.ctx.translate(
      entity.location.x + entity.width / 2 + offset.x,
      entity.location.y + entity.height / 2 + offset.y,
    )
    /*    this.ctx.translate(
     singleToMove.location.x + entity.width / 2,
     singleToMove.location.y + entity.height / 2,
     )*/
    this.ctx.rotate(entity.angle)

    this.ctx.beginPath()
    this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.restore()
  }

  private handleSingleRotationDraw(entity: CanvasEntity) {
    const singleToRotate = this._state.toRotate.singleToRotate
    assertNotNull(singleToRotate)
    const angle = singleToRotate.adjustedAngle

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
    // const rotateState = this.rotateState
    const multipleToRotate = this._state.toRotate.multipleToRotate
    assertNotNull(multipleToRotate)
    const angle = multipleToRotate.adjustedAngle
    const location = multipleToRotate.entities.find((e) => e.id === entity.id)?.adjustedLocation
    /*    const multipleToRotateAngleMap = this._state.toRotate.multipleToRotate
     assertNotNull(multipleToRotateAngleMap)
     const angle = multipleToRotateAngleMap.adjustedAngle
     const location = multipleToRotateAngleMap.entities.find((e) => e.id === entity.id)?.adjustedLocation*/
    // const angle = rotateState.multipleToRotateAngleMap.get(entity.id)
    // const location = rotateState.multipleToRotateLocationMap.get(entity.id)
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

// const isDragging2 = !!toMove.singleToMove && toMove.singleToMove.id === entity.id
const isSingleDragging = (entity: CanvasEntity, singleToMove: SingleToMove | undefined): singleToMove is SingleToMove => {
  return !!singleToMove && singleToMove.id === entity.id
}

const isMultipleDragging = (entity: CanvasEntity, multipleToMove: MultipleToMove | undefined): multipleToMove is MultipleToMove => {
  return !!multipleToMove && multipleToMove.entities.find((e) => e.id === entity.id) !== undefined
}

/*
 export function isPanel(entity: CanvasEntity): entity is CanvasPanel {
 return entity.type === ENTITY_TYPE.Panel
 }

 export function assertIsPanel(entity: CanvasEntity): asserts entity is CanvasPanel {
 if (!isPanel(entity)) {
 throw new Error(`Expected entity to be a panel, but was ${entity.type}`)
 }
 }
 */