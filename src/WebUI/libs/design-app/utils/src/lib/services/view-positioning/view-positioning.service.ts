import { inject, Injectable, RendererFactory2 } from '@angular/core'
import { MousePositioningService } from '../mouse-positioning'
import { XyLocation } from '@shared/data-access/models'
import { BehaviorSubject } from 'rxjs'
import { ComponentElementsService } from '../component-elements'
import { GridConfig } from './grid.config'

@Injectable({
  providedIn: 'root',
})
export class ViewPositioningService {

  private _gridLayoutElement: HTMLDivElement | undefined
  private _scrollElement: HTMLDivElement | undefined
  private _mousePositionService = inject(MousePositioningService)
  private _componentElementsService = inject(ComponentElementsService)
  // private _scale$
  private _scale = new BehaviorSubject(1)
  private _screenPosition = new BehaviorSubject({ x: 0, y: 0 })
  private _renderer = inject(RendererFactory2)
    .createRenderer(null, null)

  private _ctrlMouseDownStartPoint: XyLocation | undefined
  // private _screenPosition: XyLocation = { x: 0, y: 0 }
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
    const scale = Math.round((value + Number.EPSILON) * 100) / 100
    this._scale.next(scale)
    this._mousePositionService.scale = scale
    console.log('set scale', scale)
  }

  get screenPosition$() {
    return this._screenPosition.asObservable()
  }

  get screenPosition() {
    return this._screenPosition.value
  }

  set screenPosition(value: XyLocation) {
    const screenPosition: XyLocation = {
      x: Math.round((value.x + Number.EPSILON) * 100) / 100,
      y: Math.round((value.y + Number.EPSILON) * 100) / 100,
    }
    // this._screenPosition = value
    this._screenPosition.next(screenPosition)
    this._mousePositionService.screenPosition = screenPosition
    console.log('set this._screenPosition', screenPosition)
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
    this.scale = 1
    this.screenPosition = { x: 0, y: 0 }
    this.initScroll()

  }

  get scrollElement(): HTMLDivElement {
    if (!this._scrollElement) throw new Error('scrollElement is undefined')
    return this._scrollElement
  }

  initScroll() {
    this.scale = 0.9
    this.screenPosition = { x: 50, y: 50 }
    this._renderer.setStyle(
      this.scrollElement,
      'transform',
      `translate(${this.screenPosition.x}px,${this.screenPosition.y}px) scale(${this.scale})`,
    )
    this.scale = 1
    this.screenPosition = { x: 0, y: 0 }
    this._renderer.setStyle(
      this.scrollElement,
      'transform',
      `translate(${this.screenPosition.x}px,${this.screenPosition.y}px) scale(${this.scale})`,
    )
  }

  onScrollHandler(
    event: WheelEvent,
  ) {
    const speed = GridConfig.Speed
    const minScale = 0.5
    // const minScale = GridConfig.MinScale
    const maxScale = GridConfig.MaxScale
    // const childRect = this.gridLayoutElement.children[0].getBoundingClientRect()
    const childRect = this.scrollElement.getBoundingClientRect()
    console.log('childRect', childRect)
    const sizeH = childRect.height
    const sizeW = childRect.width

    const pointerX = event.pageX - childRect.left
    const pointerY = event.pageY - childRect.top

    console.log('event.pageX', event.pageX)
    console.log('event.pageY', event.pageY)
    console.log('pointerX', pointerX)
    console.log('pointerY', pointerY)
    const targetX = (pointerX - this.screenPosition.x) / this.scale
    const targetY = (pointerY - this.screenPosition.y) / this.scale

    this.scale += -1 * Math.max(-1, Math.min(1, event.deltaY)) * speed * this.scale
    this.scale = Math.max(minScale, Math.min(maxScale, this.scale))
    this.screenPosition = {
      x: -targetX * this.scale + pointerX,
      y: -targetY * this.scale + pointerY,
    }

    if (this.screenPosition.x > 0) this.screenPosition.x = 0
    if (this.screenPosition.x + sizeW * this.scale < sizeW) this.screenPosition.x = -sizeW * (this.scale - 1)
    if (this.screenPosition.y > 0) this.screenPosition.y = 0
    if (this.screenPosition.y + sizeH * this.scale < sizeH) this.screenPosition.y = -sizeH * (this.scale - 1)
    this._renderer.setStyle(
      this.scrollElement,
      'transform',
      `translate(${this.screenPosition.x}px,${this.screenPosition.y}px) scale(${this.scale})`,
    )
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