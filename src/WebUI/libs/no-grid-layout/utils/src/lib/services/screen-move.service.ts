import { inject, Injectable, RendererFactory2 } from '@angular/core'
import { GridConfig } from '@no-grid-layout/shared'
import { MousePositionService } from './mouse-position.service'
import { XyLocation } from '@shared/data-access/models'
import { BehaviorSubject } from 'rxjs'
import { ComponentElementService } from './component-element.service'

@Injectable({
  providedIn: 'root',
})
export class ScreenMoveService {

  private _gridLayoutElement: HTMLDivElement | undefined
  private _scrollElement: HTMLDivElement | undefined
  private _mousePositionService = inject(MousePositionService)
  private _componentElementsService = inject(ComponentElementService)
  // private _scale$
  private _scale = new BehaviorSubject(1)
  private _renderer = inject(RendererFactory2)
    .createRenderer(null, null)

  private _ctrlMouseDownStartPoint: XyLocation | undefined

  get ctrlMouseDownStartPoint(): XyLocation | undefined {
    return this._ctrlMouseDownStartPoint
  }

  set ctrlMouseDownStartPoint(value: XyLocation | undefined) {
    this._ctrlMouseDownStartPoint = value
    console.log('set ctrlMouseDownStartPoint', value)
  }

  get scale$() {
    return this._scale.asObservable()
  }

  get scale() {
    return this._scale.getValue()
  }

  set scale(value: number) {
    this._scale.next(value)
    this._mousePositionService.scale = value
    console.log('set scale', value)
  }

  set gridLayoutElement(value: HTMLDivElement) {
    this._gridLayoutElement = value
  }

  get gridLayoutElement(): HTMLDivElement {
    if (!this._gridLayoutElement) throw new Error('gridLayoutElementRef is undefined')
    return this._gridLayoutElement as HTMLDivElement
  }

  set scrollElement(value: HTMLDivElement) {
    this._scrollElement = value
  }

  get scrollElement(): HTMLDivElement {
    if (!this._scrollElement) throw new Error('scrollElement is undefined')
    return this._scrollElement as HTMLDivElement
  }

  /*  onScrollHelper(
   event: WheelEvent,
   screenPosition: XyLocation,
   /!*    posX: number,
   posY: number,*!/
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

   /!*    const pointerX = event.pageX - this.gridLayoutElement.offsetLeft
   const pointerY = event.pageY - this.gridLayoutElement.offsetTop*!/
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
   }*/

  onScrollHelper(
    event: WheelEvent,
    screenPosition: XyLocation,
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
    const targetX = (pointerX - screenPosition.x) / this.scale
    const targetY = (pointerY - screenPosition.y) / this.scale

    this.scale += -1 * Math.max(-1, Math.min(1, event.deltaY)) * speed * this.scale
    this.scale = Math.max(1, Math.min(2, this.scale))

    screenPosition.x = -targetX * this.scale + pointerX
    screenPosition.y = -targetY * this.scale + pointerY

    if (screenPosition.x > 0) screenPosition.x = 0
    if (screenPosition.x + sizeW * this.scale < sizeW) screenPosition.x = -sizeW * (this.scale - 1)
    if (screenPosition.y > 0) screenPosition.y = 0
    if (screenPosition.y + sizeH * this.scale < sizeH) screenPosition.y = -sizeH * (this.scale - 1)
    return { screenPosition, scale: this.scale }
  }

  onMouseDownHelper(event: MouseEvent) {
    /*    const rect = this.gridLayoutElement.getBoundingClientRect()
     const x = (event.pageX - rect.left) / this.scale
     const y = (event.pageY - rect.top) / this.scale
     this.ctrlMouseDownStartPoint = { x, y }*/
    /*    const rect = this.gridLayoutElement.getBoundingClientRect()
     console.log('rect', rect)
     const parentNode = this.gridLayoutElement.parentNode as HTMLDivElement
     const parentRect = parentNode.getBoundingClientRect()
     console.log('parentRect', parentRect)*/
    /*    const scrollRect = this.scrollElement.getBoundingClientRect()
     console.log('scrollRect', scrollRect)
     /!*    const offsets = this.getOffsetV2(this.gridLayoutElement)
     console.log('offsets', offsets)
     const x = event.pageX - offsets.left
     const y = event.pageY - offsets.top*!/
     /!*    const x = event.pageX -
     (parentRect.width - rect.width) / 2 -
     parentNode.offsetLeft

     const y = event.pageY -
     (parentRect.height - rect.height) / 2 -
     parentNode.offsetTop*!/
     // const x = event.pageX - scrollRect.left
     // const y = event.pageY - scrollRect.top
     const x = event.pageX - this.gridLayoutElement.offsetLeft
     const y = event.pageY - this.gridLayoutElement.offsetTop


     this.ctrlMouseDownStartPoint = { x, y }*/
    // this.ctrlMouseDownStartPoint = this._mousePositionService.getMousePositionFromPageXYWithSize(event)
    const rect = this.gridLayoutElement.getBoundingClientRect()
    const parentRect = this._componentElementsService.parentElement.getBoundingClientRect()
    const parentNode = this._componentElementsService.parentElement
    /*    console.log('rect', rect)
     console.log('parentRect', parentRect)
     console.log('parentNode', parentNode)*/
    // const { x, y } = this._mousePositionService.getMousePositionFromPageXYWithSize(event)

    /*    const x = event.pageX
     const y = event.pageY*/
    const widthDiff = parentRect.width - rect.width
    const widthOffset = widthDiff / 2
    const widthOffset2 = this.gridLayoutElement.offsetWidth
    const gridLayoutOffset = this.gridLayoutElement.offsetLeft
    console.log('widthDiff', widthDiff)
    console.log('widthOffset', widthOffset)
    console.log('widthOffset2', widthOffset2)
    console.log('gridLayoutOffset', gridLayoutOffset)
    const heightDiff = parentRect.height - rect.height
    const x =
            event.pageX -
            (parentRect.width - rect.width) / 2 -
            parentNode.offsetLeft - this.gridLayoutElement.offsetLeft

    const y =
            event.pageY -
            (parentRect.height - rect.height) / 2 -
            parentNode.offsetTop - this.gridLayoutElement.offsetTop
    /*   const x =
     event.pageX -
     (parentRect.width - rect.width) / 2

     const y =
     event.pageY -
     (parentRect.height - rect.height) / 2*/
    console.log('rect', rect)
    console.log('parentRect', parentRect)
    console.log('parentNode', parentNode)
    console.log('x', x)
    console.log('y', y)

    this._ctrlMouseDownStartPoint = { x, y }
  }

  onCtrlMouseMoveHelper(event: MouseEvent) {
    if (!this._ctrlMouseDownStartPoint) return
    const rect = this.gridLayoutElement.getBoundingClientRect()
    const parentRect = this._componentElementsService.parentElement.getBoundingClientRect()
    const parentNode = this._componentElementsService.parentElement
    /*    console.log('rect', rect)
     console.log('parentRect', parentRect)
     console.log('parentNode', parentNode)*/
    // const { x, y } = this._mousePositionService.getMousePositionFromPageXYWithSize(event)
    /*    const widthDiff = parentRect.width - rect.width
     const widthOffset = widthDiff / 2
     const widthOffset2 = this.gridLayoutElement.offsetWidth
     console.log('widthDiff', widthDiff)
     console.log('widthOffset', widthOffset)
     console.log('widthOffset2', widthOffset2)
     const heightDiff = parentRect.height - rect.height*/

    /*    const x = event.pageX
     const y = event.pageY*/
    // const gridLayoutElementOffset = this._componentElementsService.initialGridLayoutElementOffset
    const x =
            event.pageX -
            (parentRect.width - rect.width) / 2 -
            parentNode.offsetLeft

    const y =
            event.pageY -
            (parentRect.height - rect.height) / 2 -
            parentNode.offsetTop
    /*    const x =
     event.pageX -
     (parentRect.width - rect.width) / 2

     const y =
     event.pageY -
     (parentRect.height - rect.height) / 2*/
    // const dx = x - this._ctrlMouseDownStartPoint.x
    // const dy = y - this._ctrlMouseDownStartPoint.y
    // const gridLayoutElementOffset = this._componentElementsService.getOffset(this.gridLayoutElement)
    const top = y - this._ctrlMouseDownStartPoint.y
    const left = x - this._ctrlMouseDownStartPoint.x

    this._renderer.setStyle(this.gridLayoutElement, 'top', top + 'px')
    this._renderer.setStyle(this.gridLayoutElement, 'left', left + 'px')
    // this._ctrlMouseDownStartPoint = { x, y }
    console.log(top, left)
    return { top, left }
    // this._screenPosition.x -= dx
    // this._screenPosition.y -= dy
    // this._screenPosition.x -= dx / this.scale
    // this._screenPosition.y -= dy / this.scale

    // if (!this.gridLayoutElement) throw new Error('gridLayoutElementRef is undefined')
    // if (!this.gridLayoutElement.parentNode) throw new Error('gridLayoutElementRef.parentNode is undefined')
    // const parentRect = this.gridLayoutElement.parentNode.getBoundingClientRect()
    // const rect = this.gridLayoutElement.getBoundingClientRect()
    // const parentNode = this.gridLayoutElement.parentNode as HTMLDivElement
    // console.log('parentNode', parentNode)
    // const parentRect = parentNode.getBoundingClientRect()
    // console.log('parentRect', parentRect)
    /*    const parentRect = {
     width: parentNode.offsetWidth,
     height: parentNode.offsetHeight,
     }*/
    // const childRect = this.gridLayoutElement.children[0].getBoundingClientRect()
    // console.log(childRect)
    // const parentRect = {
    /*    const offsets = this.getOffsetV2(this.gridLayoutElement)
     console.log('offsets', offsets)
     const mouseX = event.pageX - offsets.left
     const mouseY = event.pageY - offsets.top*/
    /*    const mouseX =
     event.pageX -
     (parentRect.width - rect.width) / 2 -
     parentNode.offsetLeft

     const mouseY =
     event.pageY -
     (parentRect.height - rect.height) / 2 -
     parentNode.offsetTop*/
    // console.log(mouseX2, mouseY2)
    /*    const offsets = this.getOffset(this.gridLayoutElement)
     const offsets2 = this.getOffsetV2(this.gridLayoutElement)
     const mouseX = event.pageX - offsets2.left
     const mouseY = event.pageY - offsets2.top*/
    // console.log(mouseX, mouseY)
    // const newStartY = this.startPoint.y
    // const newStartX = this.startPoint.x
    // let top = mouseY - newStartY
    // let left = mouseX - newStartX

    /*    const size = {
     width:  Number(this.gridLayoutElement.style.width),
     height: Number(this.gridLayoutElement.style.height),
     }*/
    // const childRect = this.gridLayoutElement.children[0].getBoundingClientRect()
    /*    const size = {
     width:  childRect.width,
     height: childRect.height,
     }*/

    // const newStartY = this._ctrlMouseDownStartPoint.y
    // const newStartX = this._ctrlMouseDownStartPoint.x

    /*    const newStartY = startPoint.y
     const newStartX = startPoint.x*/

    // const top = mouseY - newStartY
    // const left = mouseX - newStartX

    // const negativeHeight = size.height * -1
    // const negativeWidth = size.width * -1

    /*    if (
     top > (size.height * this.scale) / 2 ||
     top < negativeHeight / 2 - this.scale * 200 + size.height / 4.485
     ) {
     return undefined
     }

     if (
     left > (size.width * this.scale) / 2 ||
     left < negativeWidth / 2 - this.scale * 200 + size.width / 5.925
     ) {
     return undefined
     }*/

  }

  getOffset(element: HTMLDivElement) {
    const rect = element.getBoundingClientRect()
    console.log('scrollX', window.scrollX)
    console.log('scrollY', window.scrollY)
    return {
      left: rect.left + window.scrollX,
      top:  rect.top + window.scrollY,
    }
  }

  getOffsetV2(element: HTMLDivElement) {
    let _x = 0
    let _y = 0
    while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
      _x += element.offsetLeft - element.scrollLeft
      _y += element.offsetTop - element.scrollTop
      // element = element.offsetParent
      element = element.offsetParent as HTMLDivElement
    }
    return { top: _y, left: _x }
  }
}