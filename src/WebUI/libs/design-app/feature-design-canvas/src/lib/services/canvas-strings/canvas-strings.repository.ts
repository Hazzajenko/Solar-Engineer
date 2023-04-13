import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { CanvasStringsActions } from '../../store'
import { CanvasString } from '../../types/canvas-string'
import { UpdateStr } from '@ngrx/entity/src/models'

@Injectable({
  providedIn: 'root',
})
export class CanvasStringsRepository {
  private _store = inject(Store)

  public addCanvasString(string: CanvasString) {
    this._store.dispatch(CanvasStringsActions.addString({ string }))
  }

  public addManyCanvasStrings(strings: CanvasString[]) {
    this._store.dispatch(CanvasStringsActions.addManyStrings({ strings }))
  }

  public updateCanvasString(update: UpdateStr<CanvasString>) {
    this._store.dispatch(CanvasStringsActions.updateString({ update }))
  }

  public updateManyCanvasStrings(updates: UpdateStr<CanvasString>[]) {
    this._store.dispatch(CanvasStringsActions.updateManyStrings({ updates }))
  }

  public deleteCanvasString(stringId: string) {
    this._store.dispatch(CanvasStringsActions.deleteString({ stringId }))
  }

  public deleteManyCanvasStrings(stringIds: string[]) {
    this._store.dispatch(CanvasStringsActions.deleteManyStrings({ stringIds }))
  }
}
