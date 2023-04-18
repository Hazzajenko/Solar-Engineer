import { inject, Injectable } from '@angular/core'
import { CanvasElementService } from './canvas-element.service'
import { createPanel, TransformedPoint } from '../types'
import { CURSOR_TYPE } from '@shared/data-access/models'
import { DomPointService } from './dom-point.service'
import { CanvasObjectPositioningService } from './canvas-object-positioning.service'
import { assertNotNull, mapToObject } from '@shared/utils'
import { CanvasSelectedService } from './canvas-selected.service'
import { CanvasEntitiesStore } from './canvas-entities'
import { changeCanvasCursor, dragBoxKeysDown } from '../utils'
import { CanvasClientStateService } from './canvas-client-state'
import { CANVAS_MODE } from './canvas-client-state/types/mode'
import { CanvasRenderService } from './canvas-render.service'

@Injectable({
  providedIn: 'root',
})
export class DragBoxService {
  private _canvasElementService = inject(CanvasElementService)
  private _domPointService = inject(DomPointService)
  private _objectPositioning = inject(CanvasObjectPositioningService)
  private _state = inject(CanvasClientStateService)
  private _selected = inject(CanvasSelectedService)
  private _entities = inject(CanvasEntitiesStore)
  private _render = inject(CanvasRenderService)
  selectionBoxStartPoint?: TransformedPoint
  creationBoxStartPoint?: TransformedPoint
  dragBoxStartPoint?: TransformedPoint

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

  handleDragBoxMouseDown(event: MouseEvent) {
    this._state.updateState({
      dragBox: {
        start: this._domPointService.getTransformedPointFromEvent(event),
      },
    })
    this.dragBoxStartPoint = this._domPointService.getTransformedPointFromEvent(event)
    /*    switch (mode) {
     case 'create':
     this.creationBoxStartPoint = this._domPointService.getTransformedPointFromEvent(event)
     break
     case 'select':
     this.selectionBoxStartPoint = this._domPointService.getTransformedPointFromEvent(event)
     break
     }*/
    // this.selectionBoxStartPoint = this._domPointService.getTransformedPointFromEvent(event)
  }

  /*  selectionBoxMouseMove(event: MouseEvent, draw: () => void) {
   if (event.altKey) {
   // this.canvas.style.cursor = CURSOR_TYPE.CROSSHAIR
   changeCanvasCursor(this.canvas, CURSOR_TYPE.CROSSHAIR)
   this.animateSelectionBox(event)
   return
   }
   this.selectionBoxStartPoint = undefined
   changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
   // this.canvas.style.cursor = CURSOR_TYPE.AUTO
   return
   }*/

  selectionBoxMouseUp(event: MouseEvent) {
    const start = this._state.select.dragBox().start
    assertNotNull(start)
    const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
    const panelsInArea = this._objectPositioning.getAllElementsBetweenTwoPoints(
      start,
      currentPoint,
    )

    // const { dragBox } = this._state.getState()
    /*    assertNotNull(this.selectionBoxStartPoint)
     const panelsInArea = this._objectPositioning.getAllElementsBetweenTwoPoints(
     this.selectionBoxStartPoint,
     this._domPointService.getTransformedPointFromEvent(event),
     )*/
    if (panelsInArea) {
      const entitiesInAreaIds = panelsInArea.map(panel => panel.id)
      /*     this._state.updateState({
       dragBox:  {

       }
       }*/
      // this._selected.setMultiSelected(entitiesInAreaIds)
      const entities = mapToObject(panelsInArea)

      // const entities = toEntities(panelsInArea)
      this._state.updateState({
        /*     dragBox:  {
         start: undefined,
         },*/
        selected: {
          ids: entitiesInAreaIds,
          entities,
        },
      })
    }
  }

  creationBoxMouseUp(event: MouseEvent) {
    // assertNotNull(this.creationBoxStartPoint)
    const { start } = this._state.select.dragBox()
    assertNotNull(start)
    const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
    const spots = this._objectPositioning.getAllAvailableEntitySpotsBetweenTwoPoints(start, currentPoint)
    // const spots = this._objectPositioning.getAllAvailableEntitySpotsBetweenTwoPoints(this.creationBoxStartPoint, this._domPointService.getTransformedPointFromEvent(event))
    if (!spots || !spots.length) return
    const takenSpots = spots.filter(spot => !spot.vacant)
    if (takenSpots.length) {
      console.log('taken spots', takenSpots)
      return
    }
    const newPanels = spots.map(spot =>
      createPanel({ x: spot.x, y: spot.y }),
    )
    this._entities.dispatch.addManyCanvasEntities(newPanels)
    /*    this._state.updateState({
     dragBox: {
     start: undefined,
     },
     })*/
  }

  /*  creationBoxMouseMove(event: MouseEvent, draw: () => void) {
   if (event.altKey) {
   this.canvas.style.cursor = CURSOR_TYPE.CROSSHAIR
   this.animateCreationBox(event, draw)
   return
   }
   this.creationBoxStartPoint = undefined
   this.canvas.style.cursor = CURSOR_TYPE.AUTO
   return
   }*/

  /*  creationBoxMouseDown(event: MouseEvent) {

   }*/

  dragBoxMouseMove(event: MouseEvent) {
    if (!dragBoxKeysDown(event)) {
      this._state.updateState({
        dragBox: {
          start: undefined,
        },
      })
      this.dragBoxStartPoint = undefined
      changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
      this._render.drawCanvas()
      return
    }
    const { start } = this._state.select.dragBox()
    if (!start) {
      // console.log('drag box mouse move', start, event.altKey)
      // throw new Error('drag box not started')
      return
    }
    // console.log('drag box mouse move', dragBox.start, event.altKey)
    /*    if (!event.altKey) {
     console.log('drag box mouse move ALT KEY LIFTED', start, event.altKey)
     this._state.updateState({
     dragBox: {
     start: undefined,
     },
     })
     this.dragBoxStartPoint = undefined
     changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
     this._render.drawCanvas()
     return
     }*/
    /*    if (!this.dragBoxStartPoint || !event.altKey) {
     this.dragBoxStartPoint = undefined
     changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
     return
     }*/
    changeCanvasCursor(this.canvas, CURSOR_TYPE.CROSSHAIR)
    /*    if (!event.altKey) {
     // this.selectionBoxStartPoint = undefined
     this._state.updateState({
     dragBox: {
     start: undefined,
     },
     })
     return
     }*/
    this._render.drawDragBox(event)
    /*    const { mode } = this._state.select.mode()
     switch (mode) {
     case CANVAS_MODE.CREATE:
     this.animateCreationBox(event)
     break
     case CANVAS_MODE.SELECT:
     this.animateSelectionBox(event)
     break
     }*/
  }

  dragBoxMouseUp(event: MouseEvent) {
    /*    const { dragBox } = this._state.state
     if (!dragBox.start) {
     throw new Error('drag box not started')
     }*/
    // console.log('drag box mouse up', dragBox.start, event.altKey)
    /*    this._state.updateState({
     dragBox: {
     start: undefined,
     },
     })*/
    /*    if (!event.altKey) {
     this._state.updateState({
     dragBox: {
     start: undefined,
     },
     })
     this.dragBoxStartPoint = undefined
     this._render.drawCanvas()
     return
     }*/
    const { mode } = this._state.select.mode()
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
    // this._render.drawCanvas()
  }

  private animateSelectionBox(event: MouseEvent) {
    /*    if (!this.selectionBoxStartPoint || !event.altKey) {
     throw new Error('selection box not started')
     }*/
    if (!event.altKey) {
      // this.selectionBoxStartPoint = undefined
      this._state.updateState({
        dragBox: {
          start: undefined,
        },
      })
      return
    }
    // const mousePointToScale = this._domPointService.getTransformedPointFromEvent(event)
    // const width = mousePointToScale.x - this.selectionBoxStartPoint.x
    // const height = mousePointToScale.y - this.selectionBoxStartPoint.y

    // this.drawPanels()
    // draw()
    this._render.drawDragBox(event)
    /*    this._render.drawCanvas()
     this.ctx.save()
     this.ctx.beginPath()
     this.ctx.globalAlpha = 0.4
     this.ctx.fillStyle = CANVAS_COLORS.SelectionBoxFillStyle
     this.ctx.rect(this.selectionBoxStartPoint.x, this.selectionBoxStartPoint.y, width, height)
     this.ctx.fill()
     this.ctx.stroke()
     this.ctx.restore()*/
    // this.ctx.closePath()
    // this.ctx.globalAlpha = 1.0
    // this.ctx.fillStyle = this.defaultPanelFillStyle
  }

  private animateCreationBox(event: MouseEvent) {
    /*    if (!this.selectionBoxStartPoint || !event.altKey) {
     throw new Error('selection box not started')
     }*/
    if (!event.altKey) {
      // this.selectionBoxStartPoint = undefined
      this._state.updateState({
        dragBox: {
          start: undefined,
        },
      })
      return
    }
    /*    const mousePointToScale = this._domPointService.getTransformedPointFromEvent(event)
     const spots = this._objectPositioning.getAllAvailableEntitySpotsBetweenTwoPoints(this.selectionBoxStartPoint, mousePointToScale)
     if (!spots) return
     const diagonalDirection = getDiagonalDirectionFromTwoPoints(this.selectionBoxStartPoint, mousePointToScale)
     if (!diagonalDirection) return
     const entitySize = SizeByType[ENTITY_TYPE.Panel]

     const width = mousePointToScale.x - this.selectionBoxStartPoint.x
     const height = mousePointToScale.y - this.selectionBoxStartPoint.y

     // draw()*/
    this._render.drawDragBox(event)
    /* this.ctx.save()
     this.ctx.beginPath()
     this.ctx.globalAlpha = 0.4

     this.ctx.fillStyle = CANVAS_COLORS.CreationBoxFillStyle
     // this.ctx.fillStyle = this.creationBoxFillStyle
     this.ctx.rect(this.selectionBoxStartPoint.x, this.selectionBoxStartPoint.y, width, height)
     // this._ctx.rect(this.creationBoxStartPoint.x, this.creationBoxStartPoint.y, width, height)
     this.ctx.fill()
     this.ctx.stroke()
     this.ctx.restore()
     this.ctx.save()

     spots.forEach(spot => {
     this.ctx.beginPath()
     this.ctx.save()
     this.ctx.beginPath()
     this.ctx.globalAlpha = 0.4
     /!*      this.ctx.fillStyle = spot.vacant
     ? this.previewPanelFillStyle
     : this.takenSpotFillStyle*!/
     this.ctx.fillStyle = spot.vacant
     ? CANVAS_COLORS.PreviewPanelFillStyle
     : CANVAS_COLORS.TakenSpotFillStyle
     this.ctx.rect(spot.x, spot.y, entitySize.width, entitySize.height)
     this.ctx.fill()
     this.ctx.stroke()
     this.ctx.restore()
     })
     this.ctx.restore()*/
  }

}