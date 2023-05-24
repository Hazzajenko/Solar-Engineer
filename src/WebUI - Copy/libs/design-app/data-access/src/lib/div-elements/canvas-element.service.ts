import { Injectable } from '@angular/core'
import { CursorType } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class CanvasElementService {
  private _canvas!: HTMLCanvasElement
  private _ctx!: CanvasRenderingContext2D

  get canvas() {
    return this._canvas
  }

  get rect() {
    return this._canvas.getBoundingClientRect()
  }

  get ctx() {
    return this._ctx
  }

  init(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this._canvas = canvas
    this._ctx = ctx
    console.log('CanvasElementService.init', this._canvas, this._ctx)
  }

  changeCursor(cursor: CursorType) {
    this._canvas.style.cursor = cursor
  }
}