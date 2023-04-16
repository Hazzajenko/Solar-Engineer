import { Injectable } from '@angular/core'
import { CanvasMode } from '../types'

@Injectable({
  providedIn: 'root',
})
export class CanvasModeService {
  private _mode: CanvasMode = 'select'

  get mode() {
    return this._mode
  }

  setMode(mode: CanvasMode) {
    console.log('CanvasModeService.setMode', mode)
    this._mode = mode
  }

}
