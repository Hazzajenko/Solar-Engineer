import { Injectable } from '@angular/core'
import { BaseService } from '@shared/logger'

@Injectable({
  providedIn: 'root',
})
export class GridLayoutService extends BaseService {
  private _blockComponentsLoaded = 0
  amountOfInitialBlocks?: number

  /*
    get blockComponentsLoaded() {
      return this._blockComponentsLoaded
    }

    set blockComponentsLoaded(value: number) {
      this._blockComponentsLoaded = value
      if (this.amountOfInitialBlocks === undefined) return
      this.logDebug('blockComponentsLoaded', this._blockComponentsLoaded)
      if (this._blockComponentsLoaded === this.amountOfInitialBlocks) {
        // console.log('All blocks loaded')
        this.logDebug('All blocks loaded')
      }
    }*/

  increaseByOne() {
    this._blockComponentsLoaded++
    if (this._blockComponentsLoaded === this.amountOfInitialBlocks) {
      // console.log('All blocks loaded')
      this.logDebug('All blocks loaded')
    }
    // this.logDebug('increaseByOne', this._blockComponentsLoaded)
  }
}
