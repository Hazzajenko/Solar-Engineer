import { inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Store } from '@ngrx/store'
import { initialUiState, UiState } from './ui.reducer'
import {
	selectContextMenuState,
	selectDialogState,
	selectSideUiNavState,
	selectUiState,
} from './ui.selectors'
import { ContextMenuInput, DialogInput } from '@design-app/data-access'
import { UiActions } from './ui.actions'

@Injectable({
	providedIn: 'root',
})
export class UiStoreService {
	private readonly _store = inject(Store<UiState>)
	private readonly _state$ = this._store.select(selectUiState)
	private readonly _state = toSignal(this._state$, { initialValue: initialUiState })
	private readonly _contextMenu$ = this._store.select(selectContextMenuState)
	private readonly _contextMenu = this._store.selectSignal(selectContextMenuState)
	private readonly _dialog$ = this._store.select(selectDialogState)
	private readonly _dialog = this._store.selectSignal(selectDialogState)
	private readonly _sideUiNav$ = this._store.select(selectSideUiNavState)
	private readonly _sideUiNav = this._store.selectSignal(selectSideUiNavState)
	public dispatch = new UiRepository(this._store)

	get state() {
		return this._state()
	}

	get state$() {
		return this._state$
	}

	get contextMenu$() {
		return this._contextMenu$
	}

	get contextMenu() {
		return this._contextMenu()
	}

	get dialog$() {
		return this._dialog$
	}

	get dialog() {
		return this._dialog()
	}

	get sideUiNav$() {
		return this._sideUiNav$
	}

	get sideUiNav() {
		return this._sideUiNav()
	}
}

class UiRepository {
	constructor(private _store: Store<UiState>) {}

	openContextMenu(contextMenu: ContextMenuInput) {
		this._store.dispatch(UiActions.openContextMenu({ contextMenu }))
	}

	closeContextMenu() {
		this._store.dispatch(UiActions.closeContextMenu())
	}

	openDialog(dialog: DialogInput) {
		this._store.dispatch(UiActions.openDialog({ dialog }))
	}

	closeDialog() {
		this._store.dispatch(UiActions.closeDialog())
	}

	toggleSideUiNav() {
		this._store.dispatch(UiActions.toggleSideUiNav())
	}

	clearUiState() {
		this._store.dispatch(UiActions.clearUiState())
	}
}
