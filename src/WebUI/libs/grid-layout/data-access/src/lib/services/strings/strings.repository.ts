import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { StringsActions } from '../../store'
import { StringModel } from '@shared/data-access/models'
import { ProjectItemUpdate } from '@shared/utils'

@Injectable({ providedIn: 'root' })
export class StringsRepository {
  private store = inject(Store)

  initSelectProject(projectId: number) {
    this.store.dispatch(StringsActions.initStrings({ projectId }))
  }

  createString(string: StringModel) {
    this.store.dispatch(StringsActions.addString({ string }))
  }

  update(update: ProjectItemUpdate<StringModel>) {
    this.store.dispatch(StringsActions.updateString({ update }))
  }

  loadStringsSuccess(strings: StringModel[]) {
    this.store.dispatch(StringsActions.loadStringsSuccess({ strings }))
  }

  delete(stringId: string) {
    this.store.dispatch(StringsActions.deleteString({ stringId }))
  }
}
