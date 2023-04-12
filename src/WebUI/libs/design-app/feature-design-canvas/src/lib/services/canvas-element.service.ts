import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class CanvasElementService {
  private _canvas!: HTMLCanvasElement
  private _ctx!: CanvasRenderingContext2D

  get ctx() {
    return this._ctx
  }

  init(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this._canvas = canvas
    this._ctx = ctx
    console.log('CanvasElementService.init', this._canvas, this._ctx)
  }
}
