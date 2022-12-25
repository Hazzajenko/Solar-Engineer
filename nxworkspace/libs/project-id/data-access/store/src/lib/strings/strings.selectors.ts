import { createFeatureSelector, createSelector } from '@ngrx/store'
import { STRINGS_FEATURE_KEY, stringsAdapter, StringsState } from './strings.reducer'

export const selectStringsState = createFeatureSelector<StringsState>(STRINGS_FEATURE_KEY)

const { selectAll, selectEntities } = stringsAdapter.getSelectors()

export const selectStringsLoaded = createSelector(
  selectStringsState,
  (state: StringsState) => state.loaded,
)

export const selectStringsError = createSelector(
  selectStringsState,
  (state: StringsState) => state.error,
)

export const selectAllStrings = createSelector(selectStringsState, (state: StringsState) =>
  selectAll(state),
)

export const selectStringsEntities = createSelector(selectStringsState, (state: StringsState) =>
  selectEntities(state),
)
