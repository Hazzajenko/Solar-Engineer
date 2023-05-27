import { AppStateActions } from './app-state.actions'
import { initialAppState } from './app-state.reducer'
import { selectAppStateState } from './app-state.selectors'
import { DragBox, ModeState, PreviewAxisState, ViewPositioningState } from './app-state.types'
import { inject, Injectable, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { select, Store } from '@ngrx/store'
import { PanelId } from '@entities/shared'

@Injectable({
	providedIn: 'root',
})
export class AppStateStoreService {
	private readonly _store = inject(Store)
	private readonly _state$ = this._store.pipe(select(selectAppStateState))
	private readonly _state = toSignal(this._state$, { initialValue: initialAppState })
	private _mousePos = signal({ x: 0, y: 0 })
	public dispatch = new AppNgrxRepository(this._store)

	get mousePos() {
		return this._mousePos()
	}

	set mousePos(mousePos: { x: number; y: number }) {
		this._mousePos.set(mousePos)
	}

	get state() {
		return this._state()
	}

	get state$() {
		return this._state$
	}

	/*	get contextMenu$() {
	 return this._store.pipe(select(selectContextMenuState))
	 }

	 get contextMenu() {
	 return this.state.contextMenu
	 }*/

	/*	get dialog$() {
	 return this._dialog$
	 }*/

	/*	get allDialogs$() {
	 return this._store.pipe(select(selectAllDialogs))
	 }*/
}

class AppNgrxRepository {
	constructor(private _store: Store) {}

	setHoveringOverEntityState(hoveringOverPanelId: PanelId) {
		this._store.dispatch(AppStateActions.setHoveringOverPanel({ hoveringOverPanelId }))
	}

	liftHoveringOverEntity() {
		this._store.dispatch(AppStateActions.liftHoveringOverEntity())
	}

	setDragBoxState(dragBox: DragBox) {
		this._store.dispatch(AppStateActions.setDragBoxState({ dragBox }))
	}

	setViewPositioningState(view: ViewPositioningState) {
		this._store.dispatch(AppStateActions.setViewPositioningState({ view }))
	}

	setModeState(mode: ModeState) {
		this._store.dispatch(AppStateActions.setModeState({ mode }))
	}

	/*	setContextMenuState(contextMenu: ContextMenuOpenState) {
	 this._store.dispatch(AppStateActions.setContextMenuState({ contextMenu }))
	 }

	 openContextMenu(contextMenuType: ContextMenuType) {
	 this._store.dispatch(AppStateActions.openContextMenu({ contextMenuType }))
	 }*/

	setPreviewAxisState(previewAxis: PreviewAxisState) {
		this._store.dispatch(AppStateActions.setPreviewAxisState({ previewAxis }))
	}

	/*	setSelectedState(selected: SelectedState) {
	 this._store.dispatch(AppStateActions.setSelectedState({ selected }))
	 }*/

	/*	toggleDialog() {
	 this._store.dispatch(AppStateActions.toggleDialogState())
	 }

	 addDialog(dialog: DialogInput) {
	 this._store.dispatch(AppStateActions.addDialog({ dialog }))
	 }

	 updateDialog(update: UpdateStr<DialogInput>) {
	 this._store.dispatch(AppStateActions.updateDialog({ update }))
	 }*/

	clearState() {
		this._store.dispatch(AppStateActions.clearState())
	}
}
