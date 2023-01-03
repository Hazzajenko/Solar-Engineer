import { createFeatureSelector, createSelector } from '@ngrx/store'
import { UI_FEATURE_KEY, UiState } from 'libs/project-id/data-access/store/src/lib/ui/ui.reducer'

export const selectUiState = createFeatureSelector<UiState>(UI_FEATURE_KEY)

export const selectIsKeymapEnabled = createSelector(
  selectUiState,
  (state: UiState) => state.keymap,
)

