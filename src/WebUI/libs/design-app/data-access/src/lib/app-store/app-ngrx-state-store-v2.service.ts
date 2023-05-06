import { AppStateActions } from './app-state.actions'
import { initialAppState } from './app-state.reducer'
import { selectAppStateState } from './app-state.selectors'
import {
	ContextMenuState,
	DragBoxState,
	ModeState,
	PreviewAxisState,
	ViewPositioningState,
} from './app-state.types'
import { inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { select, Store } from '@ngrx/store'


@Injectable({
	providedIn: 'root',
})
export class AppNgrxStateStoreV2Service {
	private readonly _store = inject(Store)
	private readonly _state$ = this._store.pipe(select(selectAppStateState))
	private readonly _state = toSignal(this._state$, { initialValue: initialAppState })
	// public select = inject(AppStateQueries)
	public dispatch = new AppNgrxRepository(this._store)

	get state() {
		return this._state()
	}
}

class AppNgrxRepository {
	constructor(private _store: Store) {}

	setHoveringOverEntityState(hoveringOverEntityId: string) {
		this._store.dispatch(AppStateActions.setHoveringOverEntity({ hoveringOverEntityId }))
	}

	liftHoveringOverEntity() {
		this._store.dispatch(AppStateActions.liftHoveringOverEntity())
	}

	setDragBoxState(dragBox: DragBoxState) {
		this._store.dispatch(AppStateActions.setDragBoxState({ dragBox }))
	}

	setViewPositioningState(view: ViewPositioningState) {
		this._store.dispatch(AppStateActions.setViewPositioningState({ view }))
	}

	setModeState(mode: ModeState) {
		this._store.dispatch(AppStateActions.setModeState({ mode }))
	}

	setContextMenuState(contextMenu: ContextMenuState) {
		this._store.dispatch(AppStateActions.setContextMenuState({ contextMenu }))
	}

	setPreviewAxisState(previewAxis: PreviewAxisState) {
		this._store.dispatch(AppStateActions.setPreviewAxisState({ previewAxis }))
	}

	/*	setSelectedState(selected: SelectedState) {
	 this._store.dispatch(AppStateActions.setSelectedState({ selected }))
	 }*/

	clearState() {
		this._store.dispatch(AppStateActions.clearState())
	}
}