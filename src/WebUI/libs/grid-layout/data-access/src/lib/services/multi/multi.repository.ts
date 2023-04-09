import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { BLOCK_TYPE, BlockType, GridPanelModel } from '@shared/data-access/models'
import { GridPanelsActions, GridSelectedActions, MultiActions } from '../../store'

@Injectable({
  providedIn: 'root',
})
export class MultiRepository {
  private readonly store = inject(Store)

  startMultiSelect(location: string) {
    this.store.dispatch(MultiActions.startMultiSelect({ location }))
  }

  finishMultiSelect(location: string, ids: string[]) {
    this.store.dispatch(MultiActions.finishMultiSelect({ location }))
    this.store.dispatch(GridSelectedActions.selectMultiIds({ ids }))
  }

  startMultiCreate(location: string, type: BlockType) {
    switch (type) {
      case BLOCK_TYPE.PANEL:
        this.store.dispatch(MultiActions.startMultiCreatePanel({ location }))
    }
  }

  finishMultiCreate(location: string, type: BlockType, panels: GridPanelModel[]) {
    switch (type) {
      case BLOCK_TYPE.PANEL:
        this.store.dispatch(MultiActions.finishMultiCreatePanel({ location }))
        this.store.dispatch(GridPanelsActions.addManyPanels({ panels }))
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
