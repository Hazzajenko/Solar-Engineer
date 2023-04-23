import { inject, Injectable } from '@angular/core'
import { CanvasElementService } from '../canvas-element.service'
import { AXIS, Axis, CANVAS_COLORS, createPanel, SizeByType, TransformedPoint } from '../../types'
import { CURSOR_TYPE } from '@shared/data-access/models'
import { DomPointService } from '../dom-point.service'
import { CanvasObjectPositioningService } from '../canvas-object-positioning.service'
import { assertNotNull } from '@shared/utils'
// import { CanvasEntitiesStore } from './canvas-entities'
import { changeCanvasCursor, dragBoxKeysDown, EntityBounds, getAllAvailableEntitySpotsBetweenTwoPoints, getAllEntitiesBetweenTwoPoints } from '../../utils'
import { CANVAS_MODE, CanvasClientStateService } from '../canvas-client-state'
import { CanvasRenderService } from '../canvas-render'
import { ENTITY_TYPE } from '@design-app/shared'

@Injectable({
  providedIn: 'root',
})
export class DragBoxService {
  private _canvasElementService = inject(CanvasElementService)
  private _domPointService = inject(DomPointService)
  private _objectPositioning = inject(CanvasObjectPositioningService)
  private _state = inject(CanvasClientStateService)
  private _render = inject(CanvasRenderService)

  get ctx() {
    return this._canvasElementService.ctx
  }

  get canvas() {
    return this._canvasElementService.canvas
  }

  get scale() {
    return this.ctx.getTransform().a
  }

  get rect() {
    return this._canvasElementService.rect
  }

  handleDragBoxMouseDown(event: PointerEvent) {
    this._state.updateState({
      dragBox: {
        start: this._domPointService.getTransformedPointFromEvent(event),
      },
    })
  }

  selectionBoxMouseUp(event: PointerEvent) {
    const start = this._state.dragBox.start
    assertNotNull(start)
    const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
    const panelsInArea = getAllEntitiesBetweenTwoPoints(start, currentPoint, this._state.entities.canvasEntities.getEntities())

    if (panelsInArea) {
      const entitiesInAreaIds = panelsInArea.map(panel => panel.id)
      // const entities = mapToObject(panelsInArea)

      this._state.updateState({
        selected: {
          multipleSelectedIds: entitiesInAreaIds,
          singleSelectedId:    undefined,
        },
      })
    }
  }

  creationBoxMouseUp(event: PointerEvent) {
    const { start } = this._state.dragBox
    assertNotNull(start)
    const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
    const spots = this._objectPositioning.getAllAvailableEntitySpotsBetweenTwoPoints(start, currentPoint)
    if (!spots || !spots.length) return
    const takenSpots = spots.filter(spot => !spot.vacant)
    if (takenSpots.length) {
      console.log('taken spots', takenSpots)
      return
    }
    const newPanels = spots.map(spot =>
      createPanel({ x: spot.x, y: spot.y }),
    )
    this._state.updateState({
      dragBox: {
        start: undefined,
      },
    })
    this._state.entities.canvasEntities.addManyEntities(newPanels)
  }

  dragBoxMouseMove(event: PointerEvent) {
    console.log('drag box mouse move', event.altKey)
    if (!dragBoxKeysDown(event)) {
      console.log('drag box mouse move ALT KEY LIFTED')
      this._state.updateState({
        dragBox: {
          start: undefined,
        },
      })
      changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
      this._render.drawCanvas()
      return
    }
    const { start } = this._state.dragBox
    if (!start) {
      return
    }
    this._render.drawDragBox(event)
  }

  dragBoxMouseUp(event: PointerEvent) {
    const { mode } = this._state.mode
    switch (mode) {
      case CANVAS_MODE.CREATE:
        this.creationBoxMouseUp(event)
        break
      case CANVAS_MODE.SELECT:
        this.selectionBoxMouseUp(event)
        break
    }
    this._state.updateState({
      dragBox: {
        start: undefined,
      },
    })
    this._render.drawCanvas()
  }

  dragAxisLineMouseMove(event: PointerEvent, currentPoint: TransformedPoint, dragBoxAxisLineStart: TransformedPoint) {
    if (!dragBoxKeysDown(event)) {
      console.log('drag box mouse move ALT KEY LIFTED')
      this._state.updateState({
        grid:    {
          currentAxis: undefined,
        },
        dragBox: {
          axisLineStart: undefined,
        },
      })
      changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
      this._render.drawCanvas()
      return
    }
    const currentAxis = this._state.grid.currentAxis
    if (!currentAxis) {
      throw new Error('dragAxisLineMouseMove: currentAxis is undefined')
    }

    /*    const xAxisLineBounds = this._state.grid.xAxisLineBounds
     const yAxisLineBounds = this._state.grid.yAxisLineBounds
     if (xAxisLineBounds && yAxisLineBounds) {
     throw new Error('dragAxisLineMouseMove: both xAxisLineBounds and yAxisLineBounds are defined')
     }*/

    const axisLineBounds = currentAxis === AXIS.X
      ? this._state.grid.xAxisLineBounds
      : this._state.grid.yAxisLineBounds
    if (!axisLineBounds) {
      throw new Error('dragAxisLineMouseMove: axisLineBounds is undefined')
    }
    const start = adjustPointToGridByAxisLine(dragBoxAxisLineStart, currentAxis, axisLineBounds) as TransformedPoint
    const end = adjustPointToGridByAxisLine(currentPoint, currentAxis, axisLineBounds) as TransformedPoint
    const entitySize = SizeByType[ENTITY_TYPE.Panel]
    const sizeByAxis = currentAxis === AXIS.X
      ? entitySize.width
      : entitySize.height
    start[currentAxis] = start[currentAxis] - sizeByAxis
    end[currentAxis] = end[currentAxis] + (sizeByAxis * 2)

    // const { mode } = this._state.mode
    const spots = getAllAvailableEntitySpotsBetweenTwoPoints(start, end, this._state.entities.canvasEntities.getEntities())
    console.log('spots', spots)
    if (!spots || !spots.length) return

    const axisLineDragBoxCtxFn = (ctx: CanvasRenderingContext2D) => {
      ctx.save()
      spots.forEach(spot => {
        ctx.save()
        ctx.beginPath()
        ctx.globalAlpha = 0.4
        ctx.fillStyle = spot.vacant
          ? CANVAS_COLORS.PreviewPanelFillStyle
          : CANVAS_COLORS.TakenSpotFillStyle
        ctx.rect(spot.x, spot.y, entitySize.width, entitySize.height)
        ctx.fill()
        ctx.stroke()
        ctx.restore()
      })
      ctx.restore()
      console.log('axisLineDragBoxCtxFn')
    }
    console.log('axisLineDragBoxCtxFn')

    this._render.drawCanvasWithFunction(axisLineDragBoxCtxFn)

    /*    this.ctx.save()
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
     this.ctx.restore()*/
    // const takenSpots = spots.filter(spot => !spot.vacant)
    /*    if (takenSpots.length) {

     }*/

  }
}

export const adjustPointToGridByAxisLine = (point: TransformedPoint, axis: Axis, axisLineBounds: EntityBounds) => {
  switch (axis) {
    case AXIS.X:
      return {
        x: point.x,
        y: axisLineBounds.centerY,
      }
    case AXIS.Y:
      return {
        x: axisLineBounds.centerX,
        y: point.y,
      }
  }
}