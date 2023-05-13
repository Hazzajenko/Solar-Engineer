import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { GridPanelsActions, GridSelectedActions } from '../../store'
import { GridPanelModel } from '@shared/data-access/models'
import { ProjectItemUpdate } from '@shared/utils'
import { UpdateStr } from '@ngrx/entity/src/models'

@Injectable({
  providedIn: 'root',
})
export class GridPanelsRepository {
  private store = inject(Store)

  init(projectId: number) {
    this.store.dispatch(GridPanelsActions.initPanels({ projectId }))
  }

  createPanel(panel: GridPanelModel) {
    this.store.dispatch(GridSelectedActions.clearSelectedPanelPathMap())
    this.store.dispatch(GridPanelsActions.addPanel({ panel }))
  }

  addManyPanels(panels: GridPanelModel[]) {
    this.store.dispatch(GridPanelsActions.addManyPanels({ panels }))
  }

  loadPanelsSuccess(panels: GridPanelModel[]) {
    this.store.dispatch(GridPanelsActions.loadPanelsSuccess({ panels }))
  }

  updatePanel(update: ProjectItemUpdate<GridPanelModel>) {
    this.store.dispatch(GridPanelsActions.updatePanel({ update }))
  }

  updateManyPanels(updates: UpdateStr<GridPanelModel>[]) {
    this.store.dispatch(GridPanelsActions.updateManyPanels({ updates }))
  }

  deletePanel(panelId: string) {
    this.store.dispatch(GridPanelsActions.deletePanel({ panelId }))
  }

  deleteManyPanels(panelIds: string[]) {
    this.store.dispatch(GridPanelsActions.deleteManyPanels({ panelIds }))
  }
}
