import { StringModel } from '@shared/data-access/models';
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { selectRouteParams } from '@shared/data-access/router'
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

export const selectStringsByRouteParams = createSelector(
  selectAllStrings,
  selectRouteParams,
  (strings, { projectId }) => strings.filter((s) => s.projectId === Number(projectId)),
)

export const selectStringById = (props: { id: string }) =>
  createSelector(selectAllStrings, (strings: StringModel[]) =>
  strings.find((string) => string.id === props.id),
  )
