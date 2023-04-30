import { CANVAS_FEATURE_KEY, CanvasState } from './canvas.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectCanvasState = createFeatureSelector<CanvasState>(CANVAS_FEATURE_KEY)

export const selectCanvas = createSelector(selectCanvasState, (state: CanvasState) => state.canvas)

export const selectCtx = createSelector(selectCanvasState, (state: CanvasState) => state.ctx)

export const selectDrawTime = createSelector(
	selectCanvasState,
	(state: CanvasState) => state.drawTime,
)
