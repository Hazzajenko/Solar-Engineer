import { Update } from '@ngrx/entity'
import { StringModel } from '@shared/data-access/models'
import { inject, Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { StringsActions, StringsSelectors } from '@project-id/data-access/store'

@Injectable({ providedIn: 'root' })
export class StringsFacade {
  private readonly store = inject(Store)
  loaded$ = this.store.pipe(select(StringsSelectors.selectStringsLoaded))
  allStrings$ = this.store.pipe(select(StringsSelectors.selectAllStrings))
  stringsFromRoute$ = this.store.pipe(select(StringsSelectors.selectStringsByRouteParams))

  initSelectProject(projectId: number) {
    this.store.dispatch(StringsActions.initStrings({ projectId }))
  }

  createString(string: StringModel) {
    this.store.dispatch(StringsActions.addString({ string }))
  }

  stringById$(id: string) {
    return this.store.pipe(select(StringsSelectors.selectStringById({ id })))
  }

  update(update: Update<StringModel>) {
    this.store.dispatch(StringsActions.updateString({ update }))
  }

  delete(stringId: string) {
    this.store.dispatch(StringsActions.deleteString({ stringId }))
  }
}
