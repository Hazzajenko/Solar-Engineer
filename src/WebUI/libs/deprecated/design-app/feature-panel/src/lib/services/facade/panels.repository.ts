import { PanelsActions } from '../../store'
import { inject, Injectable } from '@angular/core'
import { UpdateStr } from '@ngrx/entity/src/models'
import { Store } from '@ngrx/store'
import { PanelModel } from 'deprecated/design-app/feature-panel'

@Injectable({
	providedIn: 'root',
})
export class PanelsRepository {
	private _store = inject(Store)

	public addPanel(freePanel: PanelModel) {
		this._store.dispatch(PanelsActions.addPanel({ panel: freePanel }))
	}

	public addManyPanels(panels: PanelModel[]) {
		this._store.dispatch(PanelsActions.addManyPanels({ panels }))
	}

	public updatePanel(update: UpdateStr<PanelModel>) {
		this._store.dispatch(PanelsActions.updatePanel({ update }))
	}

	public updateManyPanels(updates: UpdateStr<PanelModel>[]) {
		this._store.dispatch(PanelsActions.updateManyPanels({ updates }))
	}

	public deletePanel(id: string) {
		this._store.dispatch(PanelsActions.deletePanel({ panelId: id }))
	}

	public deleteManyPanels(ids: string[]) {
		this._store.dispatch(PanelsActions.deleteManyPanels({ panelIds: ids }))
	}
}
