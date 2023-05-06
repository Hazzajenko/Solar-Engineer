import { SelectedActions } from './selected.actions'
import { initialSelectedState, SelectedState } from './selected.reducer'
import { selectSelectedState } from './selected.selectors'
import { inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { select, Store } from '@ngrx/store'


//
//
// type StoreGettersTempGenTest<T> = {
// 	[K in keyof T]: () => T[K]
// }

@Injectable({
	providedIn: 'root',
})
export class SelectedStoreService {
	private readonly _store = inject(Store<SelectedState>)
	private readonly _state$ = this._store.pipe(select(selectSelectedState))
	private readonly _state = toSignal(this._state$, {
		initialValue: initialSelectedState,
	})
	readonly dispatch = new SelectedRepository(this._store)

	get state() {
		return this._state()
	}

	get state$() {
		return this._state$
	}

	get singleSelectedEntityId() {
		return this.state.singleSelectedEntityId
	}

	get multipleSelectedEntityIds() {
		return this.state.multipleSelectedEntityIds
	}

	get selectedStringId() {
		return this.state.selectedStringId
	}

	get entityState() {
		return this.state.entityState
	}

	fetchByKey<K extends keyof SelectedState>(key: K) {
		return this._state()[key]
	}
}

class SelectedRepository {
	constructor(private readonly _store: Store<SelectedState>) {}

	selectString(stringId: string) {
		this._store.dispatch(SelectedActions.selectString({ stringId }))
	}

	clearSelectedString() {
		this._store.dispatch(SelectedActions.clearSelectedString())
	}

	selectEntity(entityId: string) {
		this._store.dispatch(SelectedActions.selectEntity({ entityId }))
	}

	selectMultipleEntities(entityIds: string[]) {
		this._store.dispatch(SelectedActions.selectMultipleEntities({ entityIds }))
	}

	clearSingleSelected() {
		this._store.dispatch(SelectedActions.clearSingleSelected())
	}

	clearMultiSelected() {
		this._store.dispatch(SelectedActions.clearMultiSelected())
	}

	startMultiSelect(entityId: string) {
		this._store.dispatch(SelectedActions.startMultiselect({ entityId }))
	}

	addEntitiesToMultiSelect(entityIds: string[]) {
		this._store.dispatch(SelectedActions.addEntitiesToMultiselect({ entityIds }))
	}

	removeEntitiesFromMultiSelect(entityIds: string[]) {
		this._store.dispatch(SelectedActions.removeEntitiesFromMultiselect({ entityIds }))
	}

	clearSelectedState() {
		this._store.dispatch(SelectedActions.clearSelectedState())
	}
}