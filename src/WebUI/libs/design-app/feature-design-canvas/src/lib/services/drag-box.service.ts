import { inject, Injectable } from '@angular/core'
import { CanvasElementService } from './canvas-element.service'
import { CANVAS_COLORS, TransformedPoint } from '../types'
import { CURSOR_TYPE } from '@shared/data-access/models'
import { DomPointService } from './dom-point.service'

@Injectable({
  providedIn: 'root',
})
export class DragBoxService {
  private _canvasElementService = inject(CanvasElementService)
  private _domPointService = inject(DomPointService)
  selectionBoxStartPoint?: TransformedPoint
  creationBoxStartPoint?: TransformedPoint

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

  selectionBoxMouseMove(event: MouseEvent) {
    if (event.altKey) {
      this.canvas.style.cursor = CURSOR_TYPE.CROSSHAIR
      this.animateSelectionBox(event)
      return
    }
    this.selectionBoxStartPoint = undefined
    this.canvas.style.cursor = CURSOR_TYPE.AUTO
    return
  }

  private animateSelectionBox(event: MouseEvent) {
    if (!this.selectionBoxStartPoint || !event.altKey) {
      throw new Error('selection box not started')
    }
    const mousePointToScale = this._domPointService.getTransformedPointFromEvent(event)
    const width = mousePointToScale.x - this.selectionBoxStartPoint.x
    const height = mousePointToScale.y - this.selectionBoxStartPoint.y

    // this.drawPanels()
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.globalAlpha = 0.4
    this.ctx.fillStyle = CANVAS_COLORS.SelectionBoxFillStyle
    this.ctx.rect(this.selectionBoxStartPoint.x, this.selectionBoxStartPoint.y, width, height)
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.restore()
    // this.ctx.closePath()
    // this.ctx.globalAlpha = 1.0
    // this.ctx.fillStyle = this.defaultPanelFillStyle
  }
}