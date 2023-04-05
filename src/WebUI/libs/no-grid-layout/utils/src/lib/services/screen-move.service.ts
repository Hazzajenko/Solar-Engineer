import { inject, Injectable, RendererFactory2 } from '@angular/core'
import { GridConfig } from '@no-grid-layout/shared'
import { MousePositionService } from './mouse-position.service'
import { XyLocation } from '@shared/data-access/models'
import { BehaviorSubject } from 'rxjs'
import { ComponentElementsService } from './component-elements.service'

@Injectable({
  providedIn: 'root',
})
export class ScreenMoveService {

  private _gridLayoutElement: HTMLDivElement | undefined
  private _scrollElement: HTMLDivElement | undefined
  private _mousePositionService = inject(MousePositionService)
  private _componentElementsService = inject(ComponentElementsService)
  // private _scale$
  private _scale = new BehaviorSubject(1)
  private _renderer = inject(RendererFactory2)
    .createRenderer(null, null)

  private _ctrlMouseDownStartPoint: XyLocation | undefined
  private _screenPosition: XyLocation = { x: 0, y: 0 }
  private _modifiedScreenPosition: XyLocation = { x: 1000, y: 1000 }

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

  get screenPosition() {
    return this._screenPosition
  }

  set screenPosition(value: XyLocation) {
    this._screenPosition = value
    this._mousePositionService.screenPosition = value
    console.log('set this._screenPosition', value)
  }

  set gridLayoutElement(value: HTMLDivElement) {
    this._gridLayoutElement = value
  }

  get gridLayoutElement(): HTMLDivElement {
    if (!this._gridLayoutElement) throw new Error('gridLayoutElementRef is undefined')
    return this._gridLayoutElement
  }

  set scrollElement(value: HTMLDivElement) {
    this._scrollElement = value
  }

  get scrollElement(): HTMLDivElement {
    if (!this._scrollElement) throw new Error('scrollElement is undefined')
    return this._scrollElement
  }

  onScrollHandler(
    event: WheelEvent,
  ) {
    const speed = GridConfig.Speed
    const minScale = 0.5
    // const minScale = GridConfig.MinScale
    const maxScale = GridConfig.MaxScale
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
    const targetX = (pointerX - this.screenPosition.x) / this.scale
    const targetY = (pointerY - this.screenPosition.y) / this.scale

    this.scale += -1 * Math.max(-1, Math.min(1, event.deltaY)) * speed * this.scale
    this.scale = Math.max(minScale, Math.min(maxScale, this.scale))
    this.screenPosition = {
      x: -targetX * this.scale + pointerX,
      y: -targetY * this.scale + pointerY,
    }
    // this.screenPosition.x = -targetX * this.scale + pointerX
    // this.screenPosition.y = -targetY * this.scale + pointerY

    if (this.screenPosition.x > 0) this.screenPosition.x = 0
    if (this.screenPosition.x + sizeW * this.scale < sizeW) this.screenPosition.x = -sizeW * (this.scale - 1)
    if (this.screenPosition.y > 0) this.screenPosition.y = 0
    if (this.screenPosition.y + sizeH * this.scale < sizeH) this.screenPosition.y = -sizeH * (this.scale - 1)
    this._renderer.setStyle(
      this.scrollElement,
      'transform',
      `translate(${this.screenPosition.x}px,${this.screenPosition.y}px) scale(${this.scale})`,
    )
    // console.log('this._componentElementsService.canvasElement', this._componentElementsService.canvasElement)
    /*    this._renderer.setStyle(
     this._componentElementsService.canvasElement,
     'transform',
     `translate(${this.screenPosition.x}px,${this.screenPosition.y}px) scale(${this.scale})`,
     )*/
    /*    this._renderer.setStyle(
     this._element,
     'transform',
     `translate(${this.this._screenPosition.x}px,${this.this._screenPosition.y}px) scale(${this.scale})`,
     )*/
    // return { this._screenPosition, scale: this.scale }
  }

  resetScreenPosition() {
    this.screenPosition = { x: 0, y: 0 }
    this.scale = 1
    this._renderer.setStyle(
      this.scrollElement,
      'transform',
      `translate(${this.screenPosition.x}px,${this.screenPosition.y}px) scale(${this.scale})`,
    )
  }

  onMouseDownHelper(event: MouseEvent) {
    const rect = this.gridLayoutElement.getBoundingClientRect()
    const parentRect = this._componentElementsService.parentElement.getBoundingClientRect()

    const x =
            event.pageX -
            (parentRect.width - rect.width) / 2
            - this.gridLayoutElement.offsetLeft

    const y =
            event.pageY -
            (parentRect.height - rect.height) / 2
            - this.gridLayoutElement.offsetTop

    this._ctrlMouseDownStartPoint = { x, y }
  }

  onCtrlMouseMoveHelper(event: MouseEvent) {
    if (!this._ctrlMouseDownStartPoint) return
    const rect = this.gridLayoutElement.getBoundingClientRect()
    const parentRect = this._componentElementsService.parentElement.getBoundingClientRect()
    const x =
            event.pageX -
            (parentRect.width - rect.width) / 2

    const y =
            event.pageY -
            (parentRect.height - rect.height) / 2

    const top = y - this._ctrlMouseDownStartPoint.y
    const left = x - this._ctrlMouseDownStartPoint.x

    this._renderer.setStyle(this.gridLayoutElement, 'top', top + 'px')
    this._renderer.setStyle(this.gridLayoutElement, 'left', left + 'px')

    const canvasTop = top + this._componentElementsService.canvasElement.offsetTop
    const canvasLeft = left + this._componentElementsService.canvasElement.offsetLeft

    console.log('canvasTop', canvasTop)
    console.log('canvasLeft', canvasLeft)

    // this._renderer.setStyle(this._componentElementsService.canvasElement, 'top', canvasTop + 'px')
    // this._renderer.setStyle(this._componentElementsService.canvasElement, 'left', canvasLeft + 'px')
    /*    this._renderer.setStyle(this._componentElementsService.canvasElement, 'top', '50%')
     this._renderer.setStyle(this._componentElementsService.canvasElement, 'left', '50%')
     this._renderer.setStyle(this._componentElementsService.canvasElement, 'transform', `translate(-50%, -50%)`)*/
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