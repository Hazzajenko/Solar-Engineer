import { SelectedActions } from './selected.actions'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'


@Injectable({
	providedIn: 'root',
})
export class SelectedRepository {
	private readonly _store = inject(Store)

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