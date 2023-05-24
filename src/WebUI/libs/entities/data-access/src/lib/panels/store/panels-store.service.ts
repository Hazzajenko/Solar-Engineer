import { PanelsActions } from './panels.actions'
import { initialPanelsState, PanelsState } from './panels.reducer'
import { selectAllPanels, selectPanelsState } from './panels.selectors'
import { inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { PanelModel } from '@entities/shared'
import { UpdateStr } from '@ngrx/entity/src/models'
import { select, Store } from '@ngrx/store'
import { isNotNull } from '@shared/utils'

@Injectable({
	providedIn: 'root',
})
export class PanelsStoreService {
	private readonly _store = inject(Store<PanelsState>)
	private readonly _state$ = this._store.pipe(select(selectPanelsState))
	private readonly _state = toSignal(this._state$, {
		initialValue: initialPanelsState,
	})
	private _allPanels$ = this._store.select(selectAllPanels)

	// readonly dispatch = new PanelsRepository(this._store)

	get state() {
		return this._state()
	}

	get ids() {
		return this.state.ids
	}

	get entities() {
		return this.state.entities
	}

	get allPanels$() {
		return this._allPanels$
	}

	get allPanels() {
		return this._store.selectSignal(selectAllPanels)
		// return this.state.ids.map((id) => this.entities[id]).filter(isNotNull)
	}

	getById(id: string) {
		return this.entities[id]
	}

	getByIds(ids: string[]) {
		return ids.map((id) => this.entities[id]).filter(isNotNull)
	}

	getByStringId(stringId: string) {
		return this.allPanels().filter((panel) => panel.stringId === stringId)
		// return this.panelsByStringId()[stringId] ?? []
	}

	addPanel(panel: PanelModel) {
		this._store.dispatch(PanelsActions.addPanel({ panel }))
	}

	addManyPanels(panels: PanelModel[]) {
		this._store.dispatch(PanelsActions.addManyPanels({ panels }))
	}

	updatePanel(update: UpdateStr<PanelModel>) {
		this._store.dispatch(PanelsActions.updatePanel({ update }))
	}

	updateManyPanels(updates: UpdateStr<PanelModel>[]) {
		this._store.dispatch(PanelsActions.updateManyPanels({ updates }))
	}

	deletePanel(id: string) {
		this._store.dispatch(PanelsActions.deletePanel({ panelId: id }))
	}

	deleteManyPanels(ids: string[]) {
		this._store.dispatch(PanelsActions.deleteManyPanels({ panelIds: ids }))
	}

	clearPanelsState() {
		this._store.dispatch(PanelsActions.clearPanelsState())
	}
}

class PanelsRepository {
	constructor(private readonly _store: Store<PanelsState>) {}

	addPanel(panel: PanelModel) {
		this._store.dispatch(PanelsActions.addPanel({ panel }))
	}

	addManyPanels(panels: PanelModel[]) {
		this._store.dispatch(PanelsActions.addManyPanels({ panels }))
	}

	updatePanel(update: UpdateStr<PanelModel>) {
		this._store.dispatch(PanelsActions.updatePanel({ update }))
	}

	updateManyPanels(updates: UpdateStr<PanelModel>[]) {
		this._store.dispatch(PanelsActions.updateManyPanels({ updates }))
	}

	deletePanel(id: string) {
		this._store.dispatch(PanelsActions.deletePanel({ panelId: id }))
	}

	deleteManyPanels(ids: string[]) {
		this._store.dispatch(PanelsActions.deleteManyPanels({ panelIds: ids }))
	}

	clearPanelsState() {
		this._store.dispatch(PanelsActions.clearPanelsState())
	}
}
