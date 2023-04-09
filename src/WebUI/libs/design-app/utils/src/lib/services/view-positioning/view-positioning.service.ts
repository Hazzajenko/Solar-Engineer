import { inject, Injectable, RendererFactory2 } from '@angular/core'
import { MousePositioningService } from '../mouse-positioning'
import { XyLocation } from '@shared/data-access/models'
import { BehaviorSubject } from 'rxjs'
import { ComponentElementsService } from '../component-elements'
import { GridConfig } from './grid.config'
import { extractEntityDiv } from '@design-app/shared'

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
    this._renderer.listen(this._scrollElement, 'wheel', (event: WheelEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onScrollHandler(event)
    })

    /*    this._renderer.listen(this._scrollElement, 'mousedown', (event: MouseEvent) => {
     event.stopPropagation()
     event.preventDefault()
     console.log('mousedown', event)
     console.log('mousedown', event.clientX, event.clientY)
     },
     )*/
    /*    this._renderer.listen(this._scrollElement, 'mouseout', (event: MouseEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this.mouseOutHandler(event)
     })*/

  }

  get scrollElement(): HTMLDivElement {
    // return this._componentElementsService.scrollElement
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

    const speed = GridConfig.Speed // 0.05
    const minScale = 0.5
    const maxScale = GridConfig.MaxScale // 2

    const sizeH = childRect.height
    const sizeW = childRect.width
    // const delta = event.deltaY
    // const scale = this.scale
    const childRect = this.scrollElement.getBoundingClientRect()
    const pointerX = event.pageX - childRect.left
    const pointerY = event.pageY - childRect.top
    // const screenWidth = window.innerWidth
    // const screenHeight = window.innerHeight
    /*    const targetX = pointerX / this.scales
     const targetY = pointerY / this.scale*/
    /*    pointerX = screenWidth / 2 - targetX
     pointerY = screenHeight / 2 - targetY*/
    // const elementCenterX = pointerX - this.screenPosition.x
    // const elementCenterY = pointerY - this.screenPosition.y
    /*    const targetX = elementCenterX / this.scale
     const targetY = elementCenterY / this.scale
     const screenWidth = window.innerWidth
     const screenHeight = window.innerHeight
     const newScreenX = screenWidth / 2 - targetX
     const newScreenY = screenHeight / 2 - targetY*/

    if (event.target) {
      const target = event.target as HTMLElement
      console.log('target', target)
      const element = target.closest('.panel')
      // if (!element) return
      console.log('element', element)
      const extract = extractEntityDiv(event)
      console.log('extract', extract)

      const divElement = this._componentElementsService.getElementRectById(target.id)
      console.log('divElement', divElement)
      if (divElement) {
        const halfOfHeight = sizeH / 2
        const halfOfWidth = sizeW / 2
        /*        pointerX = event.pageX - divElement.x
         pointerY = event.pageY - divElement.y*/
        /*        pointerX = divElement.x
         pointerY = divElement.y
         // const targetX = elementCenterX / this.scale;
         // const targetY = elementCenterY / this.scale;
         const screenWidth = window.innerWidth
         const screenHeight = window.innerHeight
         const newScreenX = screenWidth / 2 - pointerX
         const newScreenY = screenHeight / 2 - pointerY
         this.screenPosition = { x: newScreenX, y: newScreenY }
         this.scale += -1 * Math.max(-1, Math.min(1, event.deltaY)) * speed * this.scale
         this.scale = Math.max(minScale, Math.min(maxScale, this.scale))
         this._renderer.setStyle(
         // this.gridLayoutElement,
         this.scrollElement,
         'transform',
         `translate(${this.screenPosition.x}px,${this.screenPosition.y}px) scale(${this.scale})`,
         )
         return*/
      }

    }

    console.log('childRect', childRect.left, childRect.top)
    console.log('offsets', this.scrollElement.offsetLeft, this.scrollElement.offsetTop)

    /*    const sizeH = this.scrollElement.offsetHeight
     const sizeW = this.scrollElement.offsetWidth*/

    /*    const pointerX = event.pageX - this.scrollElement.offsetLeft
     const pointerY = event.pageY - this.scrollElement.offsetTop*/
    // const pointerX = event.pageX - childRect.left
    // const pointerY = event.pageY - childRect.top
    /*    const pointerX = event.offsetX
     const pointerY = event.offsetY*/
    const targetX = (pointerX - this.screenPosition.x) / this.scale
    const targetY = (pointerY - this.screenPosition.y) / this.scale

    this.scale += -1 * Math.max(-1, Math.min(1, event.deltaY)) * speed * this.scale
    this.scale = Math.max(minScale, Math.min(maxScale, this.scale))
    this.screenPosition = {
      x: -targetX * this.scale + pointerX,
      y: -targetY * this.scale + pointerY,
    }

    console.log('this.screenPosition.x', this.screenPosition.x)
    console.log('this.screenPosition.y', this.screenPosition.y)

    if (this.screenPosition.x > 0) this.screenPosition.x = 0
    if (this.screenPosition.x + sizeW * this.scale < sizeW) this.screenPosition.x = -sizeW * (this.scale - 1)
    if (this.screenPosition.y > 0) this.screenPosition.y = 0
    if (this.screenPosition.y + sizeH * this.scale < sizeH) this.screenPosition.y = -sizeH * (this.scale - 1)
    // if (this.screenPosition.x )
    /*
     console.log('this.screenPosition.x', this.screenPosition.x)
     console.log('this.screenPosition.y', this.screenPosition.y)*/

    this._renderer.setStyle(
      // this.gridLayoutElement,
      this.scrollElement,
      'transform',
      `translate(${this.screenPosition.x}px,${this.screenPosition.y}px) scale(${this.scale})`,
    )
  }

  mouseOutHandler(event: MouseEvent) {
    console.log('mouseOutHandler')
    this._renderer.setStyle(
      this.scrollElement,
      'transform',
      `translate(-50%, -50%) scale(${this.scale}) translate(0, 0)`,
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
    // const rect = this.gridLayoutElement.getBoundingClientRect()
    const rect = this._componentElementsService.gridLayoutElement.getBoundingClientRect()
    const parentRect = this._componentElementsService.parentElement.getBoundingClientRect()
    const x =
            event.pageX -
            (parentRect.width - rect.width) / 2

    const y =
            event.pageY -
            (parentRect.height - rect.height) / 2

    let top = y - this._ctrlMouseDownStartPoint.y
    let left = x - this._ctrlMouseDownStartPoint.x

    // check if top is negative
    if (left < 0) {
      const positiveLeft = Math.abs(left)
      if (positiveLeft > window.innerWidth / 2) {
        console.log('top is negative and too big')
        left = -window.innerWidth / 2
      }
    }

    // check if top is positive
    if (left > 0) {
      if (left > window.innerWidth / 2) {
        console.log('top is positive and too big')
        left = window.innerWidth / 2
      }
    }

    // check if left is negative
    if (top < 0) {
      const positiveTop = Math.abs(top)
      if (positiveTop > window.innerHeight / 2) {
        console.log('left is negative and too big')
        top = -window.innerHeight / 2
      }
    }

    // check if left is positive
    if (top > 0) {
      if (top > window.innerHeight / 2) {
        console.log('left is positive and too big')
        top = window.innerHeight / 2
      }
    }

    this._renderer.setStyle(this._componentElementsService.gridLayoutElement, 'top', top + 'px')
    this._renderer.setStyle(this._componentElementsService.gridLayoutElement, 'left', left + 'px')
    console.log('top', top)
    console.log('left', left)
    /*
     const canvasTop = top + this._componentElementsService.canvasElement.offsetTop
     const canvasLeft = left + this._componentElementsService.canvasElement.offsetLeft

     console.log('canvasTop', canvasTop)
     console.log('canvasLeft', canvasLeft)*/

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