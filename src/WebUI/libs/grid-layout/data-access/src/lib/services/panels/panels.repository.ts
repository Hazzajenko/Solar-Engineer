import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { PanelsActions, SelectedActions } from '../../store'
import { PanelModel } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class PanelsRepository {
  private store = inject(Store)

  init(projectId: number) {
    this.store.dispatch(PanelsActions.initPanels({ projectId }))
  }

  createPanel(panel: PanelModel) {
    this.store.dispatch(SelectedActions.clearSelectedPanelPathMap())
    this.store.dispatch(PanelsActions.addPanel({ panel }))
  }

  addManyPanels(panels: PanelModel[]) {
    this.store.dispatch(PanelsActions.addManyPanels({ panels }))
  }

  loadPanelsSuccess(panels: PanelModel[]) {
    this.store.dispatch(PanelsActions.loadPanelsSuccess({ panels }))
  }

  updatePanel(update: Update<PanelModel>) {
    this.store.dispatch(PanelsActions.updatePanel({ update }))
  }

  updateManyPanels(updates: Update<PanelModel>[]) {
    this.store.dispatch(PanelsActions.updateManyPanels({ updates }))
  }

  deletePanel(panelId: string) {
    this.store.dispatch(PanelsActions.deletePanel({ panelId }))
  }

  deleteManyPanels(panelIds: string[]) {
    this.store.dispatch(PanelsActions.deleteManyPanels({ panelIds }))
  }
}
