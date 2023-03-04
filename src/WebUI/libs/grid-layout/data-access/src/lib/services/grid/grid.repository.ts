import { inject, Injectable } from '@angular/core'
import { ClientXY } from '../..'
import { Store } from '@ngrx/store'
import { GridActions, LinksActions, MultiActions, SelectedActions } from '../../store'
import { BlockType, GridMode } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class GridRepository {
  private readonly store = inject(Store)

  changeCreateType(createType: BlockType) {
    this.store.dispatch(GridActions.changeCreateType({ createType }))
  }

  selectGridMode(gridMode: GridMode) {
    switch (gridMode) {
      case GridMode.CREATE:
        return this.store.dispatch(GridActions.selectGridmodeCreate())
      case GridMode.LINK:
        return this.store.dispatch(GridActions.selectGridmodeLink())
      case GridMode.SELECT:
        return this.store.dispatch(GridActions.selectGridmodeSelect())
      case GridMode.DELETE:
        return this.store.dispatch(GridActions.selectGridmodeDelete())
      default:
        return undefined
    }
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

  updateClientXY(clientXY: ClientXY) {
    this.store.dispatch(GridActions.setClientxy({ clientXY }))
  }

  clearEntireGridState() {
    this.store.dispatch(LinksActions.clearLinksState())
    this.store.dispatch(SelectedActions.clearSelectedState())
    this.store.dispatch(MultiActions.clearMultiState())
    this.store.dispatch(GridActions.selectGridmodeSelect())
  }
}
