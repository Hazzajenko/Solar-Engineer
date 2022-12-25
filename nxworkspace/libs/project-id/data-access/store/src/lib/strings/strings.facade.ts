import { inject, Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { StringsActions } from './strings.actions'
import * as StringsSelectors from './strings.selectors'

@Injectable({ providedIn: 'root' })
export class StringsFacade {
  private readonly store = inject(Store)
  loaded$ = this.store.pipe(select(StringsSelectors.selectStringsLoaded))
  allProjects$ = this.store.pipe(select(StringsSelectors.selectAllStrings))

  initSelectProject(projectId: number) {
    this.store.dispatch(StringsActions.initStrings({ projectId }))
  }
}
