import { createFeatureSelector, createSelector } from '@ngrx/store'
import { SELECTED_FEATURE_KEY, SelectedState } from './selected.reducer'
import { UNDEFINED_STRING_ID } from '@entities/shared'

export const selectSelectedState = createFeatureSelector<SelectedState>(SELECTED_FEATURE_KEY)

export const selectSingleSelectedEntity = createSelector(
	selectSelectedState,
	(state: SelectedState) => state.singleSelectedPanelId,
)

export const selectMultiSelectedEntities = createSelector(
	selectSelectedState,
	(state: SelectedState) => state.multipleSelectedPanelIds,
)

export const selectSingleAndMultiSelectedEntities = createSelector(
	selectSingleSelectedEntity,
	selectMultiSelectedEntities,
	(singleSelected, multiSelected) => ({
		singleSelected,
		multiSelected,
	}),
)

export const selectSelectedStringId = createSelector(
	selectSelectedState,
	(state: SelectedState) => state.selectedStringId,
)

export const selectSelectedStringIdOrUndefinedString = createSelector(
	selectSelectedState,
	(state: SelectedState) => state.selectedStringId ?? UNDEFINED_STRING_ID,
)

/*export const selectSelectedStringIdV2 = createSelector(
 selectSelectedState,
 (state: SelectedState | null | undefined) =>
 state ? state.selectedStringId || undefined : undefined,
 )*/

export const selectSelectedPanelLinkId = createSelector(
	selectSelectedState,
	(state: SelectedState) => state.selectedPanelLinkId,
)
