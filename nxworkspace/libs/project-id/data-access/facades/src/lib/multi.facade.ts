import { firstValueFrom } from 'rxjs'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { BlockType, PanelModel } from '@shared/data-access/models'
import {
  MultiSelectors,
  MultiActions,
  SelectedActions,
  PanelsActions,
} from '@project-id/data-access/store'

@Injectable({
  providedIn: 'root',
})
export class MultiFacade {
  private readonly store = inject(Store)

  state$ = this.store.select(MultiSelectors.selectMultiState)
  type$ = this.store.select(MultiSelectors.selectMultiType)
  start$ = this.store.select(MultiSelectors.selectMultiCreateStartLocation)
  finish$ = this.store.select(MultiSelectors.selectMultiCreateFinishLocation)

  get state() {
    return firstValueFrom(this.state$)
  }

  startMultiSelect(location: string) {
    this.store.dispatch(MultiActions.startMultiSelect({ location }))
  }

  finishMultiSelect(location: string, ids: string[]) {
    this.store.dispatch(MultiActions.finishMultiSelect({ location }))
    this.store.dispatch(SelectedActions.selectMultiIds({ ids }))
  }

  startMultiCreate(location: string, type: BlockType) {
    switch (type) {
      case BlockType.PANEL:
        this.store.dispatch(MultiActions.startMultiCreatePanel({ location }))
    }
  }

  finishMultiCreate(location: string, type: BlockType, panels: PanelModel[]) {
    switch (type) {
      case BlockType.PANEL:
        this.store.dispatch(MultiActions.finishMultiCreatePanel({ location }))
        this.store.dispatch(PanelsActions.addManyPanels({ panels }))
    }
  }

  startMultiDelete(location: string) {
    this.store.dispatch(MultiActions.startMultiDelete({ location }))
  }

  finishMultiDelete(location: string) {
    this.store.dispatch(MultiActions.finishMultiDelete({ location }))
  }

  clearMultiState() {
    this.store.dispatch(MultiActions.clearMultiState())
  }
}