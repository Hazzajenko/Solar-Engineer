import { DesignStringModel } from '../types'
import {
  DESIGN_STRINGS_FEATURE_KEY,
  designStringsAdapter,
  DesignStringsState,
} from './strings.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectStringsState = createFeatureSelector<DesignStringsState>(
  DESIGN_STRINGS_FEATURE_KEY,
)

const { selectAll, selectEntities } = designStringsAdapter.getSelectors()

export const selectStringsLoaded = createSelector(
  selectStringsState,
  (state: DesignStringsState) => state.loaded,
)

export const selectStringsError = createSelector(
  selectStringsState,
  (state: DesignStringsState) => state.error,
)

export const selectAllStrings = createSelector(selectStringsState, (state: DesignStringsState) =>
  selectAll(state),
)

export const selectStringsEntities = createSelector(
  selectStringsState,
  (state: DesignStringsState) => selectEntities(state),
)

export const selectAllDefinedStrings = createSelector(selectAllStrings, (strings) =>
  strings.filter((s) => s.name !== undefined && s.name !== null && s.name !== ''),
)

/*
 export const selectStringsByRouteParams = createSelector(
 selectAllStrings,
 RouterSelectors.selectRouteParams,
 (strings, { projectId }) =>
 strings.filter((s) => s.projectId === projectId /!*Number(projectId)*!/),
 )
 */

export const selectStringById = (props: { id: string }) =>
  createSelector(selectAllStrings, (strings: DesignStringModel[]) =>
    strings.find((string) => string.id === props.id),
  )

/*export const selectStringNameAndColorById = (props: { id: string }) =>
 createSelector(selectAllStrings, (strings: StringModel[]) => {
 const string = strings.find((string) => string.id === props.id)
 return { stringName: string?.name, stringColor: string?.color } as PanelStringNameColor
 })*/

/*
 export const selectPanelPathRecordByStringId = (props: { stringId: string }) =>
 createSelector(
 selectAllStrings,
 (strings: StringModel[]) => strings.find((string) => string.id === props.stringId)?.panelPaths,
 )
 */