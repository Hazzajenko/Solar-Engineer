import { createFeature, provideState } from '@ngrx/store'
import { SELECTED_FEATURE_KEY, selectedReducer } from './selected.reducer'
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
		selectSingleSelectedPanelId,
		selectMultipleSelectedPanelIds,
		selectEntityState,
	}) => ({
		selectSelectedState,
		selectSelectedStringId,
		selectSelectedPanelLinkId,
		selectSingleSelectedPanelId,
		selectMultipleSelectedPanelIds,
		selectEntityState /*		selectSingleSelectedEntity: createSelector(
		 selectSelectedState,
		 (state: SelectedState) => state.singleSelectedPanelId,
		 ),
		 selectMultiSelectedEntities: createSelector(
		 selectSelectedState,
		 (state: SelectedState) => state.multipleSelectedPanelIds,
		 ),*/,
	}),
})

export function provideSelectedFeature() {
	return makeEnvironmentProviders([
		provideState(selectedFeature), // provideState(SELECTED_FEATURE_KEY, selectedReducer),
		provideEffects(SelectedEffects),
	])
}
