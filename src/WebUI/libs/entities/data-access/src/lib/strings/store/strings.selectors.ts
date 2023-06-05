import { STRINGS_FEATURE_KEY, stringsAdapter, StringsState } from './strings.reducer'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { PanelModel, StringId, StringModel } from '@entities/shared'
import { selectAllPanels, selectPanelsByStringId } from '../../panels'

export const selectStringsState = createFeatureSelector<StringsState>(STRINGS_FEATURE_KEY)

const { selectAll, selectEntities } = stringsAdapter.getSelectors()

export const selectAllStrings = createSelector(selectStringsState, (state: StringsState) =>
	selectAll(state),
)

export const selectUndefinedStringId = createSelector(
	selectStringsState,
	(state: StringsState) => state.undefinedStringId,
)

export const selectAllStringsExceptUndefinedString = createSelector(
	selectAllStrings,
	selectUndefinedStringId,
	(strings: StringModel[], undefinedStringId: StringId | undefined) =>
		strings.filter((string) => string.id !== undefinedStringId),
)

export const selectStringsEntities = createSelector(selectStringsState, (state: StringsState) =>
	selectEntities(state),
)

export const selectStringById = (props: { id: string }) =>
	createSelector(selectStringsEntities, (strings: Dictionary<StringModel>) => strings[props.id])

/*export const selectSelectedString = createSelector(
 selectSelectedState,
 selectStringsEntities,
 (state: SelectedState, strings: Dictionary<CanvasString>) => {
 return state.selectedStringId ? strings[state.selectedStringId] : undefined
 },
 )*/
/*export const selectSelectedString = createSelector(
 selectedFeature.selectSelectedStringId,
 selectStringsEntities,
 (selectedStringId: string | undefined, strings: Dictionary<CanvasString>) => {
 return selectedStringId ? strings[selectedStringId] : undefined
 },
 )*/
// selectSelectedState
/*export const selectSelectedString = createSelector(
 selectStringsEntities,
 selectSelectedStringId,
 (strings: Dictionary<CanvasString>, selectedStringId: string | undefined) =>
 selectedStringId ? strings[selectedStringId] : undefined,
 )*/
export const selectAllStringsWithPanels = createSelector(
	selectAllStrings,
	selectAllPanels,
	(strings: StringModel[], panels: PanelModel[]) =>
		strings.map((string) => ({
			...string,
			panels: panels.filter((panel) => panel.stringId === string.id),
		})),
)

export const selectStringByIdWithPanels = (props: { stringId: string }) =>
	createSelector(
		selectStringById({ id: props.stringId }),
		selectPanelsByStringId({ stringId: props.stringId }),
		(string: StringModel | undefined, panels: PanelModel[]) => {
			if (!string) return undefined
			return {
				string,
				panels,
			}
		},
	)
