import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { StringsActions } from '../../store'
import { UpdateStr } from '@ngrx/entity/src/models'
import { StringModel } from '../../types'

@Injectable({ providedIn: 'root' })
export class StringsRepository {
  private _store = inject(Store)

  public createString(string: StringModel) {
    this._store.dispatch(StringsActions.addString({ string }))
  }

  public createStringWithPanels(string: StringModel, panelIds: string[]) {
    this._store.dispatch(StringsActions.createStringWithPanels({ string, panelIds }))
  }

  public updateString(update: UpdateStr<StringModel>) {
    this._store.dispatch(StringsActions.updateString({ update }))
  }

  public loadStringsSuccess(strings: StringModel[]) {
    this._store.dispatch(StringsActions.loadStringsSuccess({ strings }))
  }

  public deleteString(stringId: string) {
    this._store.dispatch(StringsActions.deleteString({ stringId }))
  }
}
