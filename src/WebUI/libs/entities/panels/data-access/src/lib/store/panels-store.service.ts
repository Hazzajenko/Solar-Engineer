import { selectSelectedStringId } from '@canvas/selected/data-access'
import { PanelsActions } from './panels.actions'
import { initialPanelsState, PanelsState } from './panels.reducer'
import { selectAllPanels, selectPanelsState } from './panels.selectors'
import { computed, inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { CanvasPanel } from '@design-app/shared'
import { UpdateStr } from '@ngrx/entity/src/models'
import { select, Store } from '@ngrx/store'
import { dictionaryToArray, filterObject, isNotNull } from '@shared/utils'

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
	readonly dispatch = new PanelsRepository(this._store)
	panelSignals = this._store.selectSignal(selectPanelsState)
	selectedStringId = toSignal(this._state$.pipe(select(selectSelectedStringId)))

	panelsByStringId = computed(() => {
		console.log('panelsByStringId')
		return filterObject(this.state.entities, ([k, v]) => v?.stringId === this.selectedStringId())
	})

	panelsByStringIdMap = computed(() => {
		console.log('panelsByStringIdMap')
		return dictionaryToArray(this._state().entities)
			.filter(isNotNull)
			.reduce((map, panel) => {
				map.set(panel.stringId, [...(map.get(panel.stringId) ?? []), panel])
				return map
			}, new Map<string, CanvasPanel[]>())
	})

	panelIdsByStringIdMap = computed(() => {
		console.log('panelIdsByStringIdMap')
		return dictionaryToArray(this._state().entities)
			.filter(isNotNull)
			.reduce((map, panel) => {
				map.set(panel.stringId, [...(map.get(panel.stringId) ?? []), panel.id])
				return map
			}, new Map<string, string[]>())
	})

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
		return this.state.ids.map((id) => this.entities[id]).filter(isNotNull)
	}

	getById(id: string) {
		return this.entities[id]
	}

	getByIds(ids: string[]) {
		return ids.map((id) => this.entities[id]).filter(isNotNull)
	}

	getByStringId(stringId: string) {
		return this.allPanels.filter((panel) => panel.stringId === stringId)
		// return this.panelsByStringId()[stringId] ?? []
	}
}

class PanelsRepository {
	constructor(private readonly _store: Store<PanelsState>) {}

	addPanel(panel: CanvasPanel) {
		this._store.dispatch(PanelsActions.addPanel({ panel }))
	}

	addManyPanels(panels: CanvasPanel[]) {
		this._store.dispatch(PanelsActions.addManyPanels({ panels }))
	}

	updatePanel(update: UpdateStr<CanvasPanel>) {
		this._store.dispatch(PanelsActions.updatePanel({ update }))
	}

	updateManyPanels(updates: UpdateStr<CanvasPanel>[]) {
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
