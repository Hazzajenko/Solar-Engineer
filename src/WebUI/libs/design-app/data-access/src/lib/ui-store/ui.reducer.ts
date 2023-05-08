import { Action, createReducer, on } from '@ngrx/store'
import { ContextMenuInput, DialogInput } from '@design-app/data-access'
import { UiActions } from './ui.actions'

export const UI_FEATURE_KEY = 'ui'

export type UiState = {
	contextMenuOpen: boolean
	currentContextMenu: ContextMenuInput | undefined
	dialogOpen: boolean
	currentDialog: DialogInput | undefined
	sideUiNavOpen: boolean
}

export const initialUiState: UiState = {
	contextMenuOpen: false,
	currentContextMenu: undefined,
	dialogOpen: false,
	currentDialog: undefined,
	sideUiNavOpen: true,
}

const reducer = createReducer(
	initialUiState,
	on(UiActions.openContextMenu, (state, { contextMenu }) => ({
		...state,
		contextMenuOpen: true,
		currentContextMenu: contextMenu,
	})),
	on(UiActions.closeContextMenu, (state) => ({
		...state,
		contextMenuOpen: false,
		currentContextMenu: undefined,
	})),
	on(UiActions.openDialog, (state, { dialog }) => ({
		...state,
		dialogOpen: true,
		currentDialog: dialog,
	})),
	on(UiActions.closeDialog, (state) => ({
		...state,
		dialogOpen: false,
		currentDialog: undefined,
	})),
	on(UiActions.toggleSideUiNav, (state) => ({
		...state,
		sideUiNavOpen: !state.sideUiNavOpen,
	})),
	on(UiActions.clearUiState, () => initialUiState),
)

export function uiReducer(state: UiState | undefined, action: Action) {
	return reducer(state, action)
}
