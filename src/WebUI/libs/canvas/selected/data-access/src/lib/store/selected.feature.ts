import { createFeature, createSelector, provideState } from '@ngrx/store'
import { SELECTED_FEATURE_KEY, selectedReducer } from './selected.reducer'
import { makeEnvironmentProviders } from '@angular/core'
import { omit } from '@shared/utils'
import { provideEffects } from '@ngrx/effects'
import * as SelectedEffects from './selected.effects'
import { CompleteEntityBounds, TransformedPoint } from '@shared/data-access/models'
import { isPointInsideBounds } from '@canvas/utils'
import { PanelId, StringId } from '@entities/shared'

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
			createSelector(
				selectMultipleSelectedPanelIds,
				selectSelectedPanelsBoxBounds,
				(multipleSelectedPanelIds: PanelId[], boxBounds: CompleteEntityBounds | undefined) => {
					if (!boxBounds) return false
					if (multipleSelectedPanelIds.length < 2) return false
					return isPointInsideBounds(point, boxBounds)
				},
			),
		selectIsPointInsideSelectedStringBoxBounds: (point: TransformedPoint) =>
			createSelector(
				selectSelectedStringId,
				selectSelectedStringBoxBounds,
				(selectedStringId: StringId | undefined, boxBounds: CompleteEntityBounds | undefined) => {
					if (!boxBounds) return false
					if (!selectedStringId) return false
					return isPointInsideBounds(point, boxBounds)
				},
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
