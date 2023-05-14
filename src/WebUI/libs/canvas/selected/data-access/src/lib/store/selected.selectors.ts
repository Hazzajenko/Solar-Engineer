import { SELECTED_FEATURE_KEY, SelectedState } from './selected.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectSelectedState = createFeatureSelector<SelectedState>(SELECTED_FEATURE_KEY)

export const selectSingleSelectedEntity = createSelector(
	selectSelectedState,
	(state: SelectedState) => state.singleSelectedEntityId,
)

export const selectMultiSelectedEntities = createSelector(
	selectSelectedState,
	(state: SelectedState) => state.multipleSelectedEntityIds,
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

export const selectSelectedPanelLinkId = createSelector(
	selectSelectedState,
	(state: SelectedState) => state.selectedPanelLinkId,
)
