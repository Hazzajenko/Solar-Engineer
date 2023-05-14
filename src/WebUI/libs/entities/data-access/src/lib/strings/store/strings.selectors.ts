import { STRINGS_FEATURE_KEY, stringsAdapter, StringsState } from './strings.reducer'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { CanvasString } from '@entities/shared'

export const selectStringsState = createFeatureSelector<StringsState>(STRINGS_FEATURE_KEY)

const { selectAll, selectEntities } = stringsAdapter.getSelectors()

export const selectAllStrings = createSelector(selectStringsState, (state: StringsState) =>
	selectAll(state),
)

export const selectStringsEntities = createSelector(selectStringsState, (state: StringsState) =>
	selectEntities(state),
)

export const selectStringById = (props: { id: string }) =>
	createSelector(selectStringsEntities, (strings: Dictionary<CanvasString>) => strings[props.id])

/*
 export const selectAllStringsWithPanels = createSelector(
 selectAllStrings,
 selectAllPanels,
 (strings: CanvasString[], panels: CanvasPanel[]) =>
 strings.map((string) => ({
 ...string,
 panels: panels.filter((panel) => panel.stringId === string.id),
 })),
 )
 */
