import { map } from 'rxjs/operators'
import { of, Observable, shareReplay } from 'rxjs'
import { Update } from '@ngrx/entity'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'

import { PanelsActions } from './panels.actions'
import * as PanelsSelectors from './panels.selectors'
import { PanelModel } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class PanelsFacade {
  private readonly store = inject(Store)
  private panels$!: Observable<PanelModel[]>

  loaded$ = this.store.select(PanelsSelectors.selectPanelsLoaded)
  allPanels$ = this.store.select(PanelsSelectors.selectAllPanels)
  panelsFromRoute$ = this.store.select(PanelsSelectors.selectPanelsByRouteParams)

  init(projectId: number) {
    this.store.dispatch(PanelsActions.initPanels({ projectId }))
    this.panels$ = this.store
      .select(PanelsSelectors.selectAllPanels)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  panelById(id: string) {
    return this.store.select(PanelsSelectors.selectPanelById({ id }))
    // return this.panels$.pipe(map((panels) => panels.find((panel) => panel.id === id)))
    /*     return this.store
      .select(PanelsSelectors.selectAllPanels)
      .pipe(map((panels) => panels.find((panel) => panel.id === id))) */
  }

  panelsByStringId(stringId: string) {
    return this.store.select(PanelsSelectors.selectPanelsByStringId({ stringId }))
  }

  createPanel(panel: PanelModel) {
    this.store.dispatch(PanelsActions.addPanel({ panel }))
  }

  updatePanel(update: Update<PanelModel>) {
    this.store.dispatch(PanelsActions.updatePanel({ update }))
  }

  updatePanel$(update: Update<PanelModel>) {
    return of(PanelsActions.updatePanel({ update }))
  }

  updatePanel2$(update: Update<PanelModel>) {
    return of(this.store.dispatch(PanelsActions.updatePanel({ update })))
  }
}