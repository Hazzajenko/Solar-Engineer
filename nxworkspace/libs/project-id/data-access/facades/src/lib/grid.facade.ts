import { GridMode } from '@shared/data-access/models'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { BlockType } from '@shared/data-access/models'
import { firstValueFrom } from 'rxjs'
import {
  GridSelectors,
  GridActions,
  SelectedActions,
  MultiActions,
  LinksActions,
} from '@project-id/data-access/store'
import { ClientXY } from '@grid-layout/shared/models'

@Injectable({
  providedIn: 'root',
})
export class GridFacade {
  private readonly store = inject(Store)

  gridState$ = this.store.select(GridSelectors.selectGridState)
  gridState = firstValueFrom(this.store.select(GridSelectors.selectGridState))
  gridMode$ = this.store.select(GridSelectors.selectGridMode)
  clientXY$ = this.store.select(GridSelectors.selectClientXY)
  // gridMode = firstValueFrom(this.store.select(GridSelectors.selectGridMode))
  createMode$ = this.store.select(GridSelectors.selectCreateMode)
  // createMode = firstValueFrom(this.store.select(GridSelectors.selectCreateMode))

  get createMode() {
    return firstValueFrom(this.createMode$)
  }

  get gridMode() {
    return firstValueFrom(this.gridMode$)
  }

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
