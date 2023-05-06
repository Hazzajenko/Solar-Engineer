import { AppStateActions } from './app-state.actions'
import {
	ContextMenuOpenState,
	DragBoxState,
	ModeState,
	ViewPositioningState,
} from './app-state.types'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'


@Injectable({
	providedIn: 'root',
})
export class AppStateRepository {
	private _store = inject(Store)

	setDragBoxState(dragBox: DragBoxState) {
		this._store.dispatch(AppStateActions.setDragBoxState({ dragBox }))
	}

	setViewPositioningState(view: ViewPositioningState) {
		this._store.dispatch(AppStateActions.setViewPositioningState({ view }))
	}

	setModeState(mode: ModeState) {
		this._store.dispatch(AppStateActions.setModeState({ mode }))
	}

	setContextMenuState(contextMenu: ContextMenuOpenState) {
		this._store.dispatch(AppStateActions.setContextMenuState({ contextMenu }))
	}

	/*	setSelectedState(selected: SelectedState) {
	 this._store.dispatch(AppStateActions.setSelectedState({ selected }))
	 }*/

	clearState() {
		this._store.dispatch(AppStateActions.clearState())
	}
}