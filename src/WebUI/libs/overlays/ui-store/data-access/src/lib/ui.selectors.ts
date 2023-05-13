import { createFeatureSelector, createSelector } from '@ngrx/store'
import { UI_FEATURE_KEY, UiState } from './ui.reducer'

export const selectUiState = createFeatureSelector<UiState>(UI_FEATURE_KEY)

export const selectContextMenuState = createSelector(selectUiState, (state: UiState) => ({
	contextMenuOpen: state.contextMenuOpen,
	currentContextMenu: state.currentContextMenu,
}))

export const selectDialogState = createSelector(selectUiState, (state: UiState) => ({
	dialogOpen: state.dialogOpen,
	currentDialog: state.currentDialog,
}))

export const selectSideUiNavState = createSelector(
	selectUiState,
	(state: UiState) => state.sideUiNavOpen,
)
