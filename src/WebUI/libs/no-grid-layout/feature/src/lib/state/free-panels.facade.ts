import { inject, Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'

import * as FreePanelsActions from './free-panels.actions'
import * as FreePanelsSelectors from './free-panels.selectors'
import { FreePanelModel } from '../free-panel.model'
import { UpdateStr } from '@ngrx/entity/src/models'

@Injectable({
  providedIn: 'root',
})
export class FreePanelsFacade {
  private store = inject(Store)

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(FreePanelsSelectors.selectFreePanelsLoaded))
  allFreePanels$ = this.store.pipe(select(FreePanelsSelectors.selectAllFreePanels))
  selectedFreePanels$ = this.store.pipe(select(FreePanelsSelectors.selectEntity))

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(FreePanelsActions.initFreePanels())
  }

  addFreePanel(freePanel: FreePanelModel) {
    this.store.dispatch(FreePanelsActions.addFreePanel({ freePanel }))
  }

  getFreePanelById(freePanelId: string) {
    return this.store.select(
      FreePanelsSelectors.selectFreePanelById(freePanelId),
    )
  }

  // getFree

  updateFreePanel(update: UpdateStr<FreePanelModel>) {
    this.store.dispatch(FreePanelsActions.updateFreePanel({ update }))
  }
}
