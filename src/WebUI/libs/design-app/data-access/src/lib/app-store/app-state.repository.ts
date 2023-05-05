import { AppStateActions } from './app-state.actions'
import {
	ContextMenuState,
	DragBoxState,
	ModeState,
	PointerState,
	PreviewAxisState,
	ToMoveState,
	ToRotateState,
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

	setPointerState(pointer: PointerState) {
		this._store.dispatch(AppStateActions.setPointerState({ pointer }))
	}

	setToMoveState(toMove: ToMoveState) {
		this._store.dispatch(AppStateActions.setToMoveState({ toMove }))
	}

	setToRotateState(toRotate: ToRotateState) {
		this._store.dispatch(AppStateActions.setToRotateState({ toRotate }))
	}

	setViewPositioningState(view: ViewPositioningState) {
		this._store.dispatch(AppStateActions.setViewPositioningState({ view }))
	}

	setPreviewAxisState(previewAxis: PreviewAxisState) {
		this._store.dispatch(AppStateActions.setPreviewAxisState({ previewAxis }))
	}

	setModeState(mode: ModeState) {
		this._store.dispatch(AppStateActions.setModeState({ mode }))
	}

	setContextMenuState(contextMenu: ContextMenuState) {
		this._store.dispatch(AppStateActions.setContextMenuState({ contextMenu }))
	}

	/*	setSelectedState(selected: SelectedState) {
	 this._store.dispatch(AppStateActions.setSelectedState({ selected }))
	 }*/

	clearState() {
		this._store.dispatch(AppStateActions.clearState())
	}
}