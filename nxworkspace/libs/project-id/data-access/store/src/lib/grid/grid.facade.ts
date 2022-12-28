import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { BlockType } from '@shared/data-access/models'
import { LinksActions } from '../links'
import { MultiActions } from '../multi'
import { SelectedActions } from '../selected'
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

  changeCreateType(createType: BlockType) {
    this.store.dispatch(GridActions.changeCreateType({ createType }))
  }

  selectCreateMode() {
    console.log('this.selectCreateMode')
    return this.store.dispatch(GridActions.selectGridmodeCreate())
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

  clearEntireGridState() {
    this.store.dispatch(LinksActions.clearLinksState())
    this.store.dispatch(SelectedActions.clearSelectedState())
    this.store.dispatch(MultiActions.clearMultiState())
    this.store.dispatch(GridActions.selectGridmodeSelect())
  }
}
