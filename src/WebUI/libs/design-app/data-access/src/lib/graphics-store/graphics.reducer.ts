import { GraphicsActions } from './graphics.actions'
import { NEARBY_LINES_STATE, NearbyLinesState } from './graphics.types'
import { Action, createReducer, on } from '@ngrx/store'

export const GRAPHICS_FEATURE_KEY = 'graphics'

export type GraphicsState = {
	// createPreview: CreatePreviewState
	createPreview: boolean
	nearbyLines: NearbyLinesState
	colouredStrings: boolean
	stringBoxes: boolean
	selectedPanelFill: boolean
	selectedStringPanelFill: boolean
	history: Partial<GraphicsState>
}

export const initialGraphicsState: GraphicsState = {
	createPreview: true, // createPreview: CREATE_PREVIEW_STATE.CREATE_PREVIEW_ENABLED,
	nearbyLines: NEARBY_LINES_STATE.CENTER_LINE_BETWEEN_TWO_ENTITIES,
	colouredStrings: true,
	stringBoxes: true,
	selectedPanelFill: false,
	selectedStringPanelFill: false,
	history: {},
}

const reducer = createReducer(
	initialGraphicsState,
	on(GraphicsActions.toggleCreatePreview, (state) => ({
		...state,
		createPreview: !state.createPreview /*		createPreview:
	 state.createPreview === CREATE_PREVIEW_STATE.CREATE_PREVIEW_ENABLED
	 ? CREATE_PREVIEW_STATE.CREATE_PREVIEW_DISABLED
	 : CREATE_PREVIEW_STATE.CREATE_PREVIEW_ENABLED,*/,
		history: {
			...state.history,
			createPreview: state.createPreview,
		},
	})) /*	on(GraphicsActions.setCreatePreview, (state, { createPreview }) => ({
 ...state,
 createPreview,
 history: {
 ...state.history,
 createPreview: state.createPreview,
 },
 })),*/,
	on(GraphicsActions.toggleNearbyLines, (state) => ({
		...state,
		nearbyLines:
			state.nearbyLines === NEARBY_LINES_STATE.NEARBY_LINES_DISABLED
				? state.history.nearbyLines ?? NEARBY_LINES_STATE.CENTER_LINE_BETWEEN_TWO_ENTITIES
				: NEARBY_LINES_STATE.NEARBY_LINES_DISABLED,
		history: {
			...state.history,
			nearbyLines: state.nearbyLines,
		},
	})),
	on(GraphicsActions.setNearbyLines, (state, { nearbyLines }) => ({
		...state,
		nearbyLines,
		history: {
			...state.history,
			nearbyLines: state.nearbyLines,
		},
	})),
	on(GraphicsActions.toggleColouredStrings, (state) => ({
		...state,
		colouredStrings: !state.colouredStrings,
	})),
	on(GraphicsActions.toggleSelectedPanelFill, (state) => ({
		...state,
		selectedPanelFill: !state.selectedPanelFill,
	})),
	on(GraphicsActions.toggleSelectedStringPanelFill, (state) => ({
		...state,
		selectedStringPanelFill: !state.selectedStringPanelFill,
	})),
	on(GraphicsActions.toggleStringBoxes, (state) => ({
		...state,
		stringBoxes: !state.stringBoxes,
	})),
	on(GraphicsActions.resetGraphicsToDefault, () => initialGraphicsState),
)

export function graphicsReducer(state: GraphicsState | undefined, action: Action) {
	return reducer(state, action)
}
