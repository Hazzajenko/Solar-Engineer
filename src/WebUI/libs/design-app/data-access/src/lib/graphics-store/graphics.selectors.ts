import { GRAPHICS_FEATURE_KEY, GraphicsState } from './graphics.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectGraphicsState = createFeatureSelector<GraphicsState>(GRAPHICS_FEATURE_KEY)

export const selectCreatePreview = createSelector(
	selectGraphicsState,
	(state: GraphicsState) => state.createPreview,
)

export const selectNearbyLines = createSelector(
	selectGraphicsState,
	(state: GraphicsState) => state.nearbyLines,
)