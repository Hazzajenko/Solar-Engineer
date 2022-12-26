import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { TypeModel } from '@shared/data-access/models'
import { GridActions } from './grid.actions'
import * as GridSelectors from './grid.selectors'

@Injectable({
  providedIn: 'root',
})
export class GridFacade {
  private readonly store = inject(Store)

  gridState$ = this.store.select(GridSelectors.selectGridState)
  gridMode$ = this.store.select(GridSelectors.selectGridMode)
  createMode$ = this.store.select(GridSelectors.selectCreateMode)

  changeCreateType(createType: TypeModel) {
    this.store.dispatch(GridActions.changeCreateType({ createType }))
  }

  selectCreateMode() {
    this.store.dispatch(GridActions.selectGridmodeCreate())
  }

  selectSelectMode() {
    this.store.dispatch(GridActions.selectGridmodeSelect())
  }

  selectLinkMode() {
    this.store.dispatch(GridActions.selectGridmodeLink())
  }

  selectDeleteMode() {
    this.store.dispatch(GridActions.selectGridmodeDelete())
  }
}
