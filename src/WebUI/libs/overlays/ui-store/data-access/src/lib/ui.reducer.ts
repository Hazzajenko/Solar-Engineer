import { Action, createReducer, on } from '@ngrx/store'
import { UiActions } from './ui.actions'
import { ContextMenuInput } from './context-menu'
import { DialogInput } from './dialog-inputs'

export const UI_FEATURE_KEY = 'ui'

export type UiState = {
	contextMenuOpen: boolean
	currentContextMenu: ContextMenuInput | undefined
	dialogOpen: boolean
	currentDialog: DialogInput | undefined
	sideUiNavOpen: boolean
	sideUiMobileMenuOpen: boolean
}

export const initialUiState: UiState = {
	contextMenuOpen: false,
	currentContextMenu: undefined,
	dialogOpen: false,
	currentDialog: undefined,
	sideUiNavOpen: true,
	sideUiMobileMenuOpen: false,
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
	on(UiActions.toggleSideUiMobileMenu, (state) => ({
		...state,
		sideUiMobileMenuOpen: !state.sideUiMobileMenuOpen,
	})),
	on(UiActions.clearUiState, () => initialUiState),
)

export function uiReducer(state: UiState | undefined, action: Action) {
	return reducer(state, action)
}
