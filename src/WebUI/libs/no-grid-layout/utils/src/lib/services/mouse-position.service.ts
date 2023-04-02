import { inject, Injectable, RendererFactory2 } from '@angular/core'
import { Point } from '@angular/cdk/drag-drop'

@Injectable({
  providedIn: 'root',
})
export class MousePositionService {
  get gridLayoutElementRef(): HTMLDivElement {
    return this._gridLayoutElementRef
  }

  set gridLayoutElementRef(value: HTMLDivElement) {
    this._gridLayoutElementRef = value
  }

  private renderer = inject(RendererFactory2)
    .createRenderer(null, null)
  private _mousePosition = { x: 0, y: 0 }
  private _mousePositionOnDragStart = { x: 0, y: 0 }
  private _gridLayoutElementRef!: HTMLDivElement
  private _scale = 1

  get scale() {
    return this._scale
  }

  set scale(value: number) {
    this._scale = value
  }

  /*  get scale() {
   return this._scale
   }

   set scale(scale: number) {
   this._scale = scale
   }*/

  /*  initGridLayoutElementRef(gridLayoutElementRef: HTMLElement) {
   this._gridLayoutElementRef = gridLayoutElementRef
   this._gridLayoutElementRef$.next(gridLayoutElementRef)
   }*/

  /*  setScale(scale: number) {
   this._scale = scale
   // this.renderer.setStyle(this._gridLayoutElementRef, 'transform', `scale(${scale})`)
   }*/

  getMousePositionFromPageXY(event: MouseEvent, size?: {
    height: number,
    width: number
  }): Point {
    /*    this._mousePosition = {
     x: event.pageX - this._gridLayoutElementRef.offsetLeft,
     y: event.pageY - this._gridLayoutElementRef.offsetTop,
     }
     this._mousePosition$.next(this._mousePosition)*/
    const rect = this._gridLayoutElementRef.getBoundingClientRect()
    let x = (event.pageX - rect.left) / this._scale
    let y = (event.pageY - rect.top) / this._scale
    if (size) {
      x = x - size.width / 2
      y = y - size.height / 2
    }
    return { x, y }
  }

  getMousePositionFromClientXY(event: MouseEvent): Point {
    const rect = this._gridLayoutElementRef.getBoundingClientRect()
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