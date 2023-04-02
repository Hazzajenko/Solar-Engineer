import { ElementRef, Renderer2 } from '@angular/core'
import { GridConfig } from '@no-grid-layout/shared'

export const handleScrollFunc = (
  event: WheelEvent,
  _elementRef: ElementRef<HTMLDivElement>,
  renderer: Renderer2,
  posX: number,
  posY: number,
  scale: number,
) => {
  const speed = GridConfig.Speed
  const sizeH = _elementRef.nativeElement.offsetHeight
  const sizeW = _elementRef.nativeElement.offsetWidth

  const pointerX = event.pageX - _elementRef.nativeElement.offsetLeft
  const pointerY = event.pageY - _elementRef.nativeElement.offsetTop
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