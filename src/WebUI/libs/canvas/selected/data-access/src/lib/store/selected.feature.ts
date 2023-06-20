import { createFeature, createSelector, provideState } from '@ngrx/store'
import { SELECTED_FEATURE_KEY, selectedReducer } from './selected.reducer'
import { makeEnvironmentProviders } from '@angular/core'
import { omit } from '@shared/utils'
import { provideEffects } from '@ngrx/effects'
import * as SelectedEffects from './selected.effects'
import { TransformedPoint } from '@shared/data-access/models'
import { isPointInsideBounds } from '@canvas/utils'

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
		selectSelectedPanelsBoxBounds,
		selectSelectedStringBoxBounds,
	}) => ({
		selectSelectedState,
		selectSelectedStringId,
		selectSelectedPanelLinkId,
		selectSingleSelectedPanelId,
		selectMultipleSelectedPanelIds,
		selectEntityState,
		selectSelectedPanelsBoxBounds,
		selectSelectedStringBoxBounds,
		selectIsPointInsideSelectedPanelsBoxBounds: (point: TransformedPoint) =>
			createSelector(selectSelectedPanelsBoxBounds, (boxBounds) =>
				boxBounds ? isPointInsideBounds(point, boxBounds) : false,
			),
		selectIsPointInsideSelectedStringBoxBounds: (point: TransformedPoint) =>
			createSelector(selectSelectedStringBoxBounds, (boxBounds) =>
				boxBounds ? isPointInsideBounds(point, boxBounds) : false,
			),
	}),
})

export function getSelectedSelectors() {
	return omit(selectedFeature, 'name', 'reducer')
}

// export const SelectedSelectors = omit(selectedFeature, 'name', 'reducer')

export function provideSelectedFeature() {
	return makeEnvironmentProviders([provideState(selectedFeature), provideEffects(SelectedEffects)])
}
