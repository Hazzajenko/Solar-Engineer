import { inject, Injectable } from '@angular/core'
import { GridConfig } from '@no-grid-layout/shared'
import { MousePositionService } from './mouse-position.service'
import { Point, Size } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class ScreenMoveService {
  private _gridLayoutElement: HTMLDivElement | undefined
  private _mousePositionService = inject(MousePositionService)

  set gridLayoutElement(value: HTMLDivElement) {
    this._gridLayoutElement = value
  }

  get gridLayoutElement(): HTMLDivElement {
    if (!this._gridLayoutElement) throw new Error('gridLayoutElementRef is undefined')
    return this._gridLayoutElement
  }

  onScrollHelper(
    event: WheelEvent,
    posX: number,
    posY: number,
    scale: number,
  ) {
    const speed = GridConfig.Speed
    const sizeH = this.gridLayoutElement.offsetHeight
    const sizeW = this.gridLayoutElement.offsetWidth

    const pointerX = event.pageX - this.gridLayoutElement.offsetLeft
    const pointerY = event.pageY - this.gridLayoutElement.offsetTop
    const targetX = (pointerX - posX) / scale
    const targetY = (pointerY - posY) / scale

    scale += -1 * Math.max(-1, Math.min(1, event.deltaY)) * speed * scale
    scale = Math.max(1, Math.min(2, scale))

    posX = -targetX * scale + pointerX
    posY = -targetY * scale + pointerY

    if (posX > 0) posX = 0
    if (posX + sizeW * scale < sizeW) posX = -sizeW * (scale - 1)
    if (posY > 0) posY = 0
    if (posY + sizeH * scale < sizeH) posY = -sizeH * (scale - 1)
    return { posX, posY, scale }
  }

  handleCtrlMouseMove(event: MouseEvent, startPoint: Point, scale: number, size: Size) {
    const { x, y } = this._mousePositionService.getMousePositionFromPageXY(event)

    const newStartY = startPoint.y
    const newStartX = startPoint.x

    const top = y - newStartY
    const left = x - newStartX

    const negativeHeight = size.height * -1
    const negativeWidth = size.width * -1

    if (
      top > (size.height * scale) / 2 ||
      top < negativeHeight / 2 - scale * 200 + size.height / 4.485
    ) {
      return undefined
    }

    if (
      left > (size.width * scale) / 2 ||
      left < negativeWidth / 2 - scale * 200 + size.width / 5.925
    ) {
      return undefined
    }

    return { top, left }
  }
}