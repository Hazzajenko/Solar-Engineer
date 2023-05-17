import { createFeature, createSelector, provideState } from '@ngrx/store'
import { SELECTED_FEATURE_KEY, selectedReducer, SelectedState } from './selected.reducer'
import { makeEnvironmentProviders } from '@angular/core'
import { provideEffects } from '@ngrx/effects'
import * as SelectedEffects from './selected.effects'

export const selectedFeature = createFeature({
	name: SELECTED_FEATURE_KEY,
	reducer: selectedReducer,
	extraSelectors: ({
		selectSelectedState,
		selectSelectedStringId,
		selectSelectedPanelLinkId,
		selectSingleSelectedEntityId,
		selectMultipleSelectedEntityIds,
		selectEntityState,
	}) => ({
		selectSelectedState,
		selectSelectedStringId,
		selectSelectedPanelLinkId,
		selectSingleSelectedEntityId,
		selectMultipleSelectedEntityIds,
		selectEntityState,
		selectSingleSelectedEntity: createSelector(
			selectSelectedState,
			(state: SelectedState) => state.singleSelectedEntityId,
		),
		selectMultiSelectedEntities: createSelector(
			selectSelectedState,
			(state: SelectedState) => state.multipleSelectedEntityIds,
		),
	}),
})

export function provideSelectedFeature() {
	return makeEnvironmentProviders([
		provideState(selectedFeature), // provideState(SELECTED_FEATURE_KEY, selectedReducer),
		provideEffects(SelectedEffects),
	])
}
