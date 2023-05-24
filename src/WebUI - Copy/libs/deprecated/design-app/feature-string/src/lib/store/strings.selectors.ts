import { StringModel } from '../types'
import { designStringsAdapter, STRINGS_FEATURE_KEY, StringsState } from './strings.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectStringsState = createFeatureSelector<StringsState>(STRINGS_FEATURE_KEY)

const { selectAll, selectEntities } = designStringsAdapter.getSelectors()

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
	createSelector(selectAllStrings, (strings: StringModel[]) =>
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