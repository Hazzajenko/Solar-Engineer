import { SelectedActions } from './selected.actions'
import { initialSelectedState, SelectedState } from './selected.reducer'
import { selectMultiSelectedEntities, selectSelectedState, selectSelectedStringId, selectSingleSelectedEntity } from './selected.selectors'
import { inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { select, Store } from '@ngrx/store'
import { StringId } from '@entities/shared'

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

	get singleSelectedEntityId$() {
		return this._store.select(selectSingleSelectedEntity)
	}

	get multipleSelectedEntityIds() {
		return this.state.multipleSelectedEntityIds
	}

	get multipleSelectedEntityIds$() {
		return this._store.select(selectMultiSelectedEntities)
	}

	get selectedStringId() {
		return this.state.selectedStringId
	}

	get selectedStringId$() {
		return this._store.select(selectSelectedStringId)
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

	selectString(stringId: StringId) {
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
		this._store.dispatch(SelectedActions.startMultiSelect({ entityId }))
	}

	addEntitiesToMultiSelect(entityIds: string[]) {
		this._store.dispatch(SelectedActions.addEntitiesToMultiSelect({ entityIds }))
	}

	removeEntitiesFromMultiSelect(entityIds: string[]) {
		this._store.dispatch(SelectedActions.removeEntitiesFromMultiSelect({ entityIds }))
	}

	clearSelectedState() {
		this._store.dispatch(SelectedActions.clearSelectedState())
	}
}
