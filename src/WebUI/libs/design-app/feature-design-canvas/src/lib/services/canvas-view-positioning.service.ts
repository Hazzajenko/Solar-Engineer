import { inject, Injectable } from '@angular/core'
import { TransformedPoint } from '../types'
import { DomPointService } from './dom-point.service'
// import { CanvasEntitiesStore } from './canvas-entities'
import { CanvasElementService } from './canvas-element.service'
import { CURSOR_TYPE } from '@shared/data-access/models'
import { assertNotNull } from '@shared/utils'
import { draggingScreenKeysDown } from '../utils'
import { CanvasClientStateService } from './canvas-client-state'
import { CanvasRenderService } from './canvas-render/canvas-render.service'

@Injectable({
  providedIn: 'root',
})
export class CanvasViewPositioningService {
  // private _entitiesStore = inject(CanvasEntitiesStore)
  private _domPointService = inject(DomPointService)
  private _canvasElementsService = inject(CanvasElementService)
  private _state = inject(CanvasClientStateService)
  private _render = inject(CanvasRenderService)

  screenDragStartPoint?: TransformedPoint

  get ctx() {
    return this._canvasElementsService.ctx
  }

  get canvas() {
    return this._canvasElementsService.canvas
  }

  handleDragScreenMouseDown(event: MouseEvent) {
    this._state.updateState({
      view: {
        dragStart: this._domPointService.getTransformedPointFromEvent(event),
      },
    })
    this.screenDragStartPoint = this._domPointService.getTransformedPointFromEvent(event)
  }

  handleDragScreenMouseMove(event: MouseEvent) {
    if (!draggingScreenKeysDown(event)) {
      this._state.updateState({
        view: {
          dragStart: undefined,
        },
      })
      this.screenDragStartPoint = undefined
      return
    }
    assertNotNull(this.screenDragStartPoint)
    this.canvas.style.cursor = CURSOR_TYPE.MOVE
    const currentTransformedCursor = this._domPointService.getTransformedPointFromEvent(event)
    const transformX = currentTransformedCursor.x - this.screenDragStartPoint.x
    const transformY = currentTransformedCursor.y - this.screenDragStartPoint.y
    this.ctx.translate(transformX, transformY)
    this._render.drawCanvas()
    // this.drawPanels()
  }

  handleDragScreenMouseUp(event: MouseEvent) {
    this.screenDragStartPoint = undefined
    this._state.updateState({
      view: {
        dragStart: undefined,
      },
    })
  }
}