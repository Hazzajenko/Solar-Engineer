import { GRAPHICS_FEATURE_KEY, GraphicsState } from './graphics.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectGraphicsState = createFeatureSelector<GraphicsState>(GRAPHICS_FEATURE_KEY)

export const selectCreatePreview = createSelector(
	selectGraphicsState,
	(state: GraphicsState) => state.createPreview,
)

export const selectNearbyLines = createSelector(
	selectGraphicsState,
	(state: GraphicsState) => state.nearbyLinesState,
)

export const selectColouredStrings = createSelector(
	selectGraphicsState,
	(state: GraphicsState) => state.colouredStrings,
)

export const selectSelectedPanelFill = createSelector(
	selectGraphicsState,
	(state: GraphicsState) => state.selectedPanelFill,
)

// export type GraphicsSelector = typeof selectGraphicsState | typeof selectCreatePreview
// export type GraphicsSelector = typeof selectGraphicsState | typeof selectCreatePreview | typeof selectNearbyLines | typeof selectColouredStrings | typeof selectSelectedPanelFill
