import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { StringsActions } from '@project-id/data-access/store'
import { StringModel } from '@shared/data-access/models'

@Injectable({ providedIn: 'root' })
export class StringsRepository {
  private store = inject(Store)


  initSelectProject(projectId: number) {
    this.store.dispatch(StringsActions.initStrings({ projectId }))
  }

  createString(string: StringModel) {
    this.store.dispatch(StringsActions.addString({ string }))
  }

  update(update: Update<StringModel>) {
    this.store.dispatch(StringsActions.updateString({ update }))

  }

  delete(stringId: string) {
    this.store.dispatch(StringsActions.deleteString({ stringId }))
  }
}
