import { GraphicsActions } from './graphics.actions'
import {
	CREATE_PREVIEW_STATE,
	CreatePreviewState,
	NEARBY_LINES_STATE,
	NearbyLinesState,
} from './graphics.types'
import { Action, createReducer, on } from '@ngrx/store'

export const GRAPHICS_FEATURE_KEY = 'graphics'

export type GraphicsState = {
	createPreview: CreatePreviewState
	nearbyLines: NearbyLinesState
}

export const initialGraphicsState: GraphicsState = {
	createPreview: CREATE_PREVIEW_STATE.CREATE_PREVIEW_DISABLED,
	nearbyLines: NEARBY_LINES_STATE.NEARBY_LINES_DISABLED,
}

const reducer = createReducer(
	initialGraphicsState,
	on(GraphicsActions.setCreatePreview, (state, { createPreview }) => ({
		...state,
		createPreview,
	})),
	on(GraphicsActions.setNearbyLines, (state, { nearbyLines }) => ({
		...state,
		nearbyLines,
	})),
	on(GraphicsActions.resetGraphicsToDefault, () => initialGraphicsState),
)

export function graphicsReducer(state: GraphicsState | undefined, action: Action) {
	return reducer(state, action)
}