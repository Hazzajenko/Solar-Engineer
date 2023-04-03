import { inject, Injectable } from '@angular/core'
import { GridConfig } from '@no-grid-layout/shared'
import { MousePositionService } from './mouse-position.service'
import { XyLocation } from '@shared/data-access/models'

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
    screenPosition: XyLocation,
    /*    posX: number,
     posY: number,*/
    scale: number,
  ) {
    const speed = GridConfig.Speed
    const childRect = this.gridLayoutElement.children[0].getBoundingClientRect()
    console.log('childRect', childRect)
    // childRect.

    const sizeH = childRect.height
    const sizeW = childRect.width
    // const sizeH = this.gridLayoutElement.offsetHeight
    // const sizeW = this.gridLayoutElement.offsetWidth
    // console.log(this.gridLayoutElement.offsetLeft)
    // console.log(this.gridLayoutElement.offsetTop)

    /*    const pointerX = event.pageX - this.gridLayoutElement.offsetLeft
     const pointerY = event.pageY - this.gridLayoutElement.offsetTop*/
    const pointerX = event.pageX - childRect.left
    const pointerY = event.pageY - childRect.top
    const targetX = (pointerX - screenPosition.x) / scale
    const targetY = (pointerY - screenPosition.y) / scale

    scale += -1 * Math.max(-1, Math.min(1, event.deltaY)) * speed * scale
    scale = Math.max(1, Math.min(2, scale))

    screenPosition.x = -targetX * scale + pointerX
    screenPosition.y = -targetY * scale + pointerY

    if (screenPosition.x > 0) screenPosition.x = 0
    if (screenPosition.x + sizeW * scale < sizeW) screenPosition.x = -sizeW * (scale - 1)
    if (screenPosition.y > 0) screenPosition.y = 0
    if (screenPosition.y + sizeH * scale < sizeH) screenPosition.y = -sizeH * (scale - 1)
    return { screenPosition, scale }
  }

  onCtrlMouseMoveHelper(event: MouseEvent, startPoint: XyLocation, scale: number) {
    const { x, y } = this._mousePositionService.getMousePositionFromPageXY(event)

    const size = {
      width:  Number(this.gridLayoutElement.style.width),
      height: Number(this.gridLayoutElement.style.height),
    }

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