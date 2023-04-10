import { inject, Injectable, RendererFactory2 } from '@angular/core'
import { MousePositioningService } from '../mouse-positioning'
import { XyLocation } from '@shared/data-access/models'
import { BehaviorSubject } from 'rxjs'
import { ComponentElementsService } from '../component-elements'
import { GridConfig } from './grid.config'
import { EntityElement } from '@design-app/shared'
import { calculateLeftRightPositionForScene } from '../../functions/scene/scene-size'
import { ObjectPositioningService } from '../object-positioning'
import { extractEntityRectFromTarget } from '../../functions'

@Injectable({
  providedIn: 'root',
})
export class ViewPositioningService {

  private _gridLayoutElement: HTMLDivElement | undefined
  private _scrollElement: HTMLDivElement | undefined
  private _mousePositionService = inject(MousePositioningService)
  private _componentElementsService = inject(ComponentElementsService)
  private _objectPositioningService = inject(ObjectPositioningService)
  // private _scale$
  private _scale = new BehaviorSubject(1)
  private _screenPosition = new BehaviorSubject({ x: 0, y: 0 })
  private _renderer = inject(RendererFactory2)
    .createRenderer(null, null)

  private _ctrlMouseDownStartPoint: XyLocation | undefined
  // private _screenPosition: XyLocation = { x: 0, y: 0 }
  private _modifiedScreenPosition: XyLocation = { x: 1000, y: 1000 }
  matrix = [1, 0, 0, 1, 0, 0]
  dirty = false
  pos: XyLocation = { x: 0, y: 0 }

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
    if (event.target) {
      // const isEntity = this._objectPositioningService.getElementRectPositionOffScroll(event.target as HTMLDivElement)
      const isEntity = extractEntityRectFromTarget(event.target as HTMLDivElement)
      if (isEntity) {
        this.handleScrollOnElement(event, isEntity)
        return
      }
    }
    const childRect = this.scrollElement.getBoundingClientRect()
    const speed = GridConfig.Speed // 0.05
    const minScale = 0.5
    const maxScale = GridConfig.MaxScale // 2

    console.log('childRect', childRect)
    const sizeH = childRect.height
    const sizeW = childRect.width
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

    if (this.screenPosition.x > 0) this.screenPosition.x = 0
    if (this.screenPosition.x + sizeW * this.scale < sizeW) this.screenPosition.x = -sizeW * (this.scale - 1)
    if (this.screenPosition.y > 0) this.screenPosition.y = 0
    if (this.screenPosition.y + sizeH * this.scale < sizeH) this.screenPosition.y = -sizeH * (this.scale - 1)

    console.log('this.screenPosition.x', this.screenPosition.x)
    console.log('this.screenPosition.y', this.screenPosition.y)

    this._renderer.setStyle(
      this.scrollElement,
      'translate',
      `${this.screenPosition.x}px,${this.screenPosition.y}px`,
    )
    this._renderer.setStyle(
      this.scrollElement,
      'scale',
      this.scale,
    )

    /*    this._renderer.setStyle(
     this.scrollElement,
     'transform',
     `translate(${this.screenPosition.x}px,${this.screenPosition.y}px) scale(${this.scale})`,
     )*/
  }

  handleScrollOnElement(event: WheelEvent, element: EntityElement) {
    console.log('handleScrollOnElement', element)
    const scrollRect = this.scrollElement.getBoundingClientRect()
    console.log('scrollRect', scrollRect)
    // const ele = this._componentElementsService.getElementRectById(isEntity.id)
    // const ele = this._objectPositioningService.getElementRectPositionOffScrollById(isEntity.id)
    console.log('ele', element)
    // if (!ele) return
    const differenceX = element.x - scrollRect.x
    const differenceY = element.y - scrollRect.y
    console.log('differenceX', differenceX)
    console.log('differenceY', differenceY)
    const differenceOffScrollMiddleX = differenceX - scrollRect.width / 2
    const differenceOffScrollMiddleY = differenceY - scrollRect.height / 2
    console.log('differenceOffScrollMiddleX', differenceOffScrollMiddleX)
    console.log('differenceOffScrollMiddleY', differenceOffScrollMiddleY)

    const scrollTopStyle = this.scrollElement.style.top
    const scrollLeftStyle = this.scrollElement.style.left
    console.log('scrollTopStyle', scrollTopStyle)
    console.log('scrollLeftStyle', scrollLeftStyle)
    const differenceOffScreenMiddleX = differenceX - window.innerWidth / 2 - parseInt(scrollLeftStyle, 10)
    const differenceOffScreenMiddleY = differenceY - window.innerHeight / 2 - parseInt(scrollTopStyle, 10)
    console.log('differenceOffScreenMiddleX', differenceOffScreenMiddleX)
    console.log('differenceOffScreenMiddleY', differenceOffScreenMiddleY)
    // const speed = GridConfig.Speed // 0.05
  }

  resetScreenPosition() {
    // this.screenPosition = { x: 0, y: 0 }
    // this.scale = 1
    const scrollRect = this.scrollElement.getBoundingClientRect()
    const sizeH = scrollRect.height
    const sizeW = scrollRect.width
    console.log('rectWidth', scrollRect.width)
    console.log('rectHeight', scrollRect.height)
    console.log('elementStyleWidth', this.scrollElement.style.width)
    console.log('elementStyleHeight', this.scrollElement.style.height)
    console.log('elementOffsetWidth', this.scrollElement.offsetWidth)
    console.log('elementOffsetHeight', this.scrollElement.offsetHeight)
    console.log(`
    scrollRect.width: ${scrollRect.width} * this.scale: ${this.scale}
    = ${scrollRect.width * this.scale}
    / 2 = ${(scrollRect.width * this.scale) / 2}`)
    console.log(`
    scrollRect.height: ${scrollRect.height} * this.scale: ${this.scale}
    = ${scrollRect.height * this.scale}
     / 2 = ${(scrollRect.height * this.scale) / 2}`)

    console.log(`
    elementOffsetWidth: ${this.scrollElement.offsetWidth} * this.scale: ${this.scale}
    = ${this.scrollElement.offsetWidth * this.scale}
    / 2 = ${(this.scrollElement.offsetWidth * this.scale) / 2}`)

    console.log(`
    elementOffsetHeight: ${this.scrollElement.offsetHeight} * this.scale: ${this.scale}
    = ${this.scrollElement.offsetHeight * this.scale}
    / 2 = ${this.scrollElement.offsetHeight * this.scale / 2}`)

    this.screenPosition = {
      x: (scrollRect.width * this.scale) * this.scale,
      y: (scrollRect.height * this.scale) * this.scale,
    }
    this.screenPosition.x = -sizeW * (this.scale - 1)
    this.screenPosition.y = -sizeH * (this.scale - 1)
    /*    const centerX = (window.innerWidth - scrollRect.width * this.scale) / 2
     const centerY = (window.innerHeight - scrollRect.height * this.scale) / 2
     this.screenPosition = { x: centerX, y: centerY }*/
    this.scale = 0.75

    const scrollRectWidth = scrollRect.width / this.scale
    const scrollRectHeight = scrollRect.height / this.scale

    const centerX = (scrollRectWidth * this.scale - scrollRectWidth * this.scale) / 2
    const centerY = (scrollRectHeight * this.scale - scrollRectHeight * this.scale) / 2

    /*    const screenPosition = {
     x: this.screenPosition.x + centerX,
     y: this.screenPosition.y + centerY
     };*/
    // this.screenPosition = { x: centerX, y: centerY }
    // const screenPosition = { x: centerX, y: centerY };
    this.screenPosition = { x: 0, y: 0 }
    this.scale = 1
    this._renderer.setStyle(
      this.scrollElement,
      'transform',
      `translate(${this.screenPosition.x}px,${this.screenPosition.y}px) scale(${this.scale})`,
    )
    // const {sceneWidth, sceneHeight} = calculateSceneLayoutSize()
    const { top, left } = calculateLeftRightPositionForScene()
    this._renderer.setStyle(
      this.scrollElement,
      'top',
      `${top}px`,
    )
    this._renderer.setStyle(
      this.scrollElement,
      'left',
      `${left}px`,
    )
    /*    this._renderer.setStyle(
     this.scrollElement,
     'transform-origin',
     '0 0',
     )*/
  }

  onMouseDownHelper(event: MouseEvent) {
    /*    const rect = this.gridLayoutElement.getBoundingClientRect()
     const parentRect = this._componentElementsService.parentElement.getBoundingClientRect()*/
    const rect = this.scrollElement.getBoundingClientRect()
    const parentRect = this.gridLayoutElement.getBoundingClientRect()
    // const parentRect = this._componentElementsService.parentElement.getBoundingClientRect()
    const offsetLeft = this.scrollElement.offsetLeft
    const offsetTop = this.scrollElement.offsetTop

    const x =
            event.pageX -
            (parentRect.width - rect.width) / 2
            - offsetLeft

    const y =
            event.pageY -
            (parentRect.height - rect.height) / 2
            - offsetTop

    this._ctrlMouseDownStartPoint = { x, y }
  }

  onCtrlMouseMoveHelper(event: MouseEvent) {
    if (!this._ctrlMouseDownStartPoint) return
    // const rect = this.gridLayoutElement.getBoundingClientRect()
    /*    const rect = this._componentElementsService.gridLayoutElement.getBoundingClientRect()
     const parentRect = this._componentElementsService.parentElement.getBoundingClientRect()*/
    const rect = this.scrollElement.getBoundingClientRect()
    const parentRect = this.gridLayoutElement.getBoundingClientRect()
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
    /*    this.screenPosition = {
     x: this.screenPosition.x + left,
     y: this.screenPosition.y + top,
     }
     // this.screenPosition = { x: left, y: top }
     this._renderer.setStyle(
     this.scrollElement,
     'transform',
     `translate(${this.screenPosition.x}px,${this.screenPosition.y}px) scale(${this.scale})`,
     )*/
    this._renderer.setStyle(this.scrollElement, 'top', top + 'px')
    this._renderer.setStyle(this.scrollElement, 'left', left + 'px')
    console.log('top', top)
    console.log('left', left)

    /*    this._renderer.setStyle(this._componentElementsService.gridLayoutElement, 'top', top + 'px')
     this._renderer.setStyle(this._componentElementsService.gridLayoutElement, 'left', left + 'px')*/
    // console.log('top', top)
    // console.log('left', left)
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