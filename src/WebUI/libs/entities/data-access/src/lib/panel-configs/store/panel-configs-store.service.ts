import { PanelConfigsActions } from './panel-configs.actions'
import { initialPanelConfigsState, PanelConfigsState } from './panel-configs.reducer'
import { selectAllPanelConfigs, selectPanelConfigsState } from './panel-configs.selectors'
import { inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { PanelConfig } from '@entities/shared'
import { UpdateStr } from '@ngrx/entity/src/models'
import { select, Store } from '@ngrx/store'
import { isNotNull } from '@shared/utils'

@Injectable({
	providedIn: 'root',
})
export class PanelConfigsStoreService {
	private readonly _store = inject(Store<PanelConfigsState>)
	private readonly _state$ = this._store.pipe(select(selectPanelConfigsState))
	private readonly _state = toSignal(this._state$, {
		initialValue: initialPanelConfigsState,
	})
	private _allPanelConfigs$ = this._store.select(selectAllPanelConfigs)

	// readonly dispatch = new PanelConfigsRepository(this._store)

	get state() {
		return this._state()
	}

	get ids() {
		return this.state.ids
	}

	get entities() {
		return this.state.entities
	}

	get allPanelConfigs$() {
		return this._allPanelConfigs$
	}

	get allPanelConfigs() {
		return this._store.selectSignal(selectAllPanelConfigs)
		// return this.state.ids.map((id) => this.entities[id]).filter(isNotNull)
	}

	getById(id: string) {
		return this.entities[id]
	}

	getByIds(ids: string[]) {
		return ids.map((id) => this.entities[id]).filter(isNotNull)
	}

	addPanelConfig(panelConfig: PanelConfig) {
		this._store.dispatch(PanelConfigsActions.addPanelConfig({ panelConfig }))
	}

	addManyPanelConfigs(panelConfigs: PanelConfig[]) {
		this._store.dispatch(PanelConfigsActions.addManyPanelConfigs({ panelConfigs }))
	}

	updatePanelConfig(update: UpdateStr<PanelConfig>) {
		this._store.dispatch(PanelConfigsActions.updatePanelConfig({ update }))
	}

	updateManyPanelConfigs(updates: UpdateStr<PanelConfig>[]) {
		this._store.dispatch(PanelConfigsActions.updateManyPanelConfigs({ updates }))
	}

	deletePanelConfig(panelConfigId: string) {
		this._store.dispatch(PanelConfigsActions.deletePanelConfig({ panelConfigId }))
	}

	deleteManyPanelConfigs(panelConfigIds: string[]) {
		this._store.dispatch(PanelConfigsActions.deleteManyPanelConfigs({ panelConfigIds }))
	}

	clearPanelConfigsState() {
		this._store.dispatch(PanelConfigsActions.clearPanelConfigsState())
	}
}

class PanelConfigsRepository {
	constructor(private readonly _store: Store<PanelConfigsState>) {}

	addPanelConfig(panelConfig: PanelConfig) {
		this._store.dispatch(PanelConfigsActions.addPanelConfig({ panelConfig }))
	}

	addManyPanelConfigs(panelConfigs: PanelConfig[]) {
		this._store.dispatch(PanelConfigsActions.addManyPanelConfigs({ panelConfigs }))
	}

	updatePanelConfig(update: UpdateStr<PanelConfig>) {
		this._store.dispatch(PanelConfigsActions.updatePanelConfig({ update }))
	}

	updateManyPanelConfigs(updates: UpdateStr<PanelConfig>[]) {
		this._store.dispatch(PanelConfigsActions.updateManyPanelConfigs({ updates }))
	}

	deletePanelConfig(panelConfigId: string) {
		this._store.dispatch(PanelConfigsActions.deletePanelConfig({ panelConfigId }))
	}

	deleteManyPanelConfigs(panelConfigIds: string[]) {
		this._store.dispatch(PanelConfigsActions.deleteManyPanelConfigs({ panelConfigIds }))
	}

	clearPanelConfigsState() {
		this._store.dispatch(PanelConfigsActions.clearPanelConfigsState())
	}
}
