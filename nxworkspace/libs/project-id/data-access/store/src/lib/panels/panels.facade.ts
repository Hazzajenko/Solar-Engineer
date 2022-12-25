import { inject, Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'

import { PanelsActions } from './panels.actions'
import * as PanelsSelectors from './panels.selectors'

@Injectable()
export class PanelsFacade {
  private readonly store = inject(Store)

  loaded$ = this.store.pipe(select(PanelsSelectors.selectPanelsLoaded))
  allPanels$ = this.store.pipe(select(PanelsSelectors.selectAllPanels))

  init(projectId: number) {
    this.store.dispatch(PanelsActions.initPanels({ projectId }))
  }
}
