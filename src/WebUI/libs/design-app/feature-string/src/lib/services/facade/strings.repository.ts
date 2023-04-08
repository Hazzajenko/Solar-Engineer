import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { StringsActions } from '../../../index'
import { UpdateStr } from '@ngrx/entity/src/models'
import { DesignStringModel } from '../../types'

@Injectable({ providedIn: 'root' })
export class StringsRepository {
  private _store = inject(Store)

  public createString(string: DesignStringModel) {
    this._store.dispatch(StringsActions.addString({ string }))
  }

  public createStringWithPanels(string: DesignStringModel, panelIds: string[]) {
    this._store.dispatch(StringsActions.createStringWithPanels({ string, panelIds }))
  }

  public updateString(update: UpdateStr<DesignStringModel>) {
    this._store.dispatch(StringsActions.updateString({ update }))
  }

  public loadStringsSuccess(strings: DesignStringModel[]) {
    this._store.dispatch(StringsActions.loadStringsSuccess({ strings }))
  }

  public deleteString(stringId: string) {
    this._store.dispatch(StringsActions.deleteString({ stringId }))
  }
}
