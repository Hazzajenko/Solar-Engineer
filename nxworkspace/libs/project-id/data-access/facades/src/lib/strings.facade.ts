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

  stringById(id: string) {
    return this.store.pipe(select(StringsSelectors.selectStringById({ id })))
  }
}
