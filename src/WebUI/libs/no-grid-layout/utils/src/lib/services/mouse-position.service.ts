import { inject, Injectable, RendererFactory2 } from '@angular/core'
import { Point } from '@angular/cdk/drag-drop'

@Injectable({
  providedIn: 'root',
})
export class MousePositionService {
  get gridLayoutElement(): HTMLDivElement {
    return this._gridLayoutElement
  }

  set gridLayoutElement(value: HTMLDivElement) {
    this._gridLayoutElement = value
  }

  get scrollElement(): HTMLDivElement {
    return this._scrollElement
  }

  set scrollElement(value: HTMLDivElement) {
    this._scrollElement = value
  }

  private renderer = inject(RendererFactory2)
    .createRenderer(null, null)
  private _mousePosition = { x: 0, y: 0 }
  private _mousePositionOnDragStart = { x: 0, y: 0 }
  private _gridLayoutElement!: HTMLDivElement
  private _scrollElement!: HTMLDivElement
  private _scale = 1

  get scale() {
    return this._scale
  }

  set scale(value: number) {
    this._scale = value
  }

  getMousePositionFromPageXYWithSize(event: MouseEvent, size?: {
    height: number,
    width: number
  }): Point {
    /*    this._mousePosition = {
     x: event.pageX - this._gridLayoutElementRef.offsetLeft,
     y: event.pageY - this._gridLayoutElementRef.offsetTop,
     }
     this._mousePosition$.next(this._mousePosition)*/
    /*    const rect = this._gridLayoutElementRef.getBoundingClientRect()
     const childRect = this._gridLayoutElementRef.children[0].getBoundingClientRect()
     console.log('childRect', childRect)
     console.log('rect', rect)
     console.log('event.pageX', event.pageX)
     console.log('event.pageY', event.pageY)*/
    // const scrollRect = this.gridLayoutElement.getBoundingClientRect()
    const scrollRect = this._scrollElement.getBoundingClientRect()
    console.log('scrollRect', scrollRect)
    let x = (event.pageX - scrollRect.left) / this.scale
    let y = (event.pageY - scrollRect.top) / this.scale
    /*    let x = (event.pageX - rect.left) / this._scale
     let y = (event.pageY - rect.top) / this._scale*/
    if (size) {
      x = x - size.width / 2
      y = y - size.height / 2
    }
    return { x, y }
  }

  getMousePositionFromPageXY(event: MouseEvent): Point {
    /*    this._mousePosition = {
     x: event.pageX - this._gridLayoutElementRef.offsetLeft,
     y: event.pageY - this._gridLayoutElementRef.offsetTop,
     }
     this._mousePosition$.next(this._mousePosition)*/
    /*    const rect = this._gridLayoutElementRef.getBoundingClientRect()
     const childRect = this._gridLayoutElementRef.children[0].getBoundingClientRect()
     console.log('childRect', childRect)
     console.log('rect', rect)
     console.log('event.pageX', event.pageX)
     console.log('event.pageY', event.pageY)*/
    // const scrollRect = this.gridLayoutElement.getBoundingClientRect()
    const scrollRect = this._scrollElement.getBoundingClientRect()
    console.log('scrollRect', scrollRect)
    const x = (event.pageX - scrollRect.left) / this.scale
    const y = (event.pageY - scrollRect.top) / this.scale
    /*    let x = (event.pageX - rect.left) / this._scale
     let y = (event.pageY - rect.top) / this._scale*/

    return { x, y }
  }

  getMousePositionFromPageXYV2(event: MouseEvent): Point {
    /*    this._mousePosition = {
     x: event.pageX - this._gridLayoutElementRef.offsetLeft,
     y: event.pageY - this._gridLayoutElementRef.offsetTop,
     }
     this._mousePosition$.next(this._mousePosition)*/
    // const rect = this._gridLayoutElementRef.getBoundingClientRect()
    const childRect = this._gridLayoutElement.children[0].getBoundingClientRect()
    console.log('childRect', childRect)
    /*    const widthDifference = (window.innerWidth - childRect.width) / 2
     console.log('widthDifference', widthDifference)
     const heightDifference = (window.innerHeight - childRect.height) / 2
     console.log('heightDifference', heightDifference)*/
    const screenDiffX = window.innerWidth - childRect.right
    const screenDiffY = window.innerHeight - childRect.bottom
    console.log('screenDiffX', screenDiffX)
    console.log('screenDiffY', screenDiffY)

    const x = (event.pageX - childRect.left) / this.scale
    const y = (event.pageY - childRect.top) / this.scale

    return { x, y }
  }

  getMousePositionFromClientXY(event: MouseEvent): Point {
    const rect = this._gridLayoutElement.getBoundingClientRect()
    const x = (event.clientX - rect.left) / this._scale
    const y = (event.clientY - rect.top) / this._scale
    return { x, y }
  }

  applyScaleToPoint(point: Point): Point {
    const x = point.x / this._scale
    const y = point.y / this._scale
    return { x, y }
  }

}