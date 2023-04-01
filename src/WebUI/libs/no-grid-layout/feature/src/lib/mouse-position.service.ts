import { inject, Injectable, RendererFactory2 } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Point } from '@angular/cdk/drag-drop'

@Injectable({
  providedIn: 'root',
})
export class MousePositionService {
  private renderer = inject(RendererFactory2).createRenderer(null, null)
  private _mousePosition = { x: 0, y: 0 }
  private _mousePosition$ = new BehaviorSubject(this._mousePosition)
  private _mousePositionOnDragStart = { x: 0, y: 0 }
  private _mousePositionOnDragStart$ = new BehaviorSubject(this._mousePositionOnDragStart)
  private _gridLayoutElementRef!: HTMLElement
  private _gridLayoutElementRef$ = new BehaviorSubject(this._gridLayoutElementRef)
  private _scale = 1

  get scale() {
    return this._scale
  }

  /*  get scale() {
   return this._scale
   }

   set scale(scale: number) {
   this._scale = scale
   }*/

  initGridLayoutElementRef(gridLayoutElementRef: HTMLElement) {
    this._gridLayoutElementRef = gridLayoutElementRef
    this._gridLayoutElementRef$.next(gridLayoutElementRef)
  }

  setScale(scale: number) {
    this._scale = scale
    // this.renderer.setStyle(this._gridLayoutElementRef, 'transform', `scale(${scale})`)
  }

  getMousePosition(event: MouseEvent, size?: { height: number, width: number }): Point {
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

  applyScaleToPoint(point: Point): Point {
    const x = point.x / this._scale
    const y = point.y / this._scale
    return { x, y }
  }

}