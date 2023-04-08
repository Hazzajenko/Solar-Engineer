import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { DesignPanelsActions } from '../../store'
import { UpdateStr } from '@ngrx/entity/src/models'
import { DesignPanelModel } from '@design-app/feature-panel'

@Injectable({
  providedIn: 'root',
})
export class PanelsRepository {
  private _store = inject(Store)

  public addPanel(freePanel: DesignPanelModel) {
    this._store.dispatch(DesignPanelsActions.addPanel({ panel: freePanel }))
  }

  public addManyPanels(panels: DesignPanelModel[]) {
    this._store.dispatch(DesignPanelsActions.addManyPanels({ panels }))
  }

  public updatePanel(update: UpdateStr<DesignPanelModel>) {
    this._store.dispatch(DesignPanelsActions.updatePanel({ update }))
  }

  public updateManyPanels(updates: UpdateStr<DesignPanelModel>[]) {
    this._store.dispatch(DesignPanelsActions.updateManyPanels({ updates }))
  }

  public deletePanel(id: string) {
    this._store.dispatch(DesignPanelsActions.deletePanel({ panelId: id }))
  }

  public deleteManyPanels(ids: string[]) {
    this._store.dispatch(DesignPanelsActions.deleteManyPanels({ panelIds: ids }))
  }
}
