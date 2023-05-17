import { GraphicsActions } from './graphics.actions'
import { NEARBY_LINES_STATE, NearbyLinesState } from './graphics.types'
import { Action, createReducer, on } from '@ngrx/store'

export const GRAPHICS_FEATURE_KEY = 'graphics'

export type GraphicsState = {
	// createPreview: CreatePreviewState
	createPreview: boolean
	nearbyLinesState: NearbyLinesState
	nearbyLines: boolean
	colouredStrings: boolean
	stringBoxes: boolean
	selectedPanelFill: boolean
	selectedStringPanelFill: boolean
	linkModeSymbols: boolean
	linkModeOrderNumbers: boolean
	linkModePathLines: boolean
	notifications: boolean
	showFps: boolean
	history: Partial<GraphicsState>
}

export const initialGraphicsState: GraphicsState = {
	createPreview: true, // createPreview: CREATE_PREVIEW_STATE.CREATE_PREVIEW_ENABLED,
	nearbyLinesState: NEARBY_LINES_STATE.CENTER_LINE_BETWEEN_TWO_ENTITIES,
	nearbyLines: true,
	colouredStrings: true,
	stringBoxes: true,
	selectedPanelFill: false,
	selectedStringPanelFill: false,
	linkModeSymbols: true,
	linkModeOrderNumbers: true,
	linkModePathLines: true,
	notifications: true,
	showFps: false,
	history: {},
}

const reducer = createReducer(
	initialGraphicsState,
	on(GraphicsActions.toggleCreatePreview, (state) => ({
		...state,
		createPreview: !state.createPreview,
		history: {
			...state.history,
			createPreview: state.createPreview,
		},
	})),
	on(GraphicsActions.toggleNearbyLines, (state) => ({
		...state,
		nearbyLinesState:
			state.nearbyLinesState === NEARBY_LINES_STATE.NEARBY_LINES_DISABLED
				? state.history.nearbyLinesState ?? NEARBY_LINES_STATE.CENTER_LINE_BETWEEN_TWO_ENTITIES
				: NEARBY_LINES_STATE.NEARBY_LINES_DISABLED,
		nearbyLines: state.nearbyLinesState !== NEARBY_LINES_STATE.NEARBY_LINES_DISABLED,
		history: {
			...state.history,
			nearbyLines: state.nearbyLines,
		},
	})),
	on(GraphicsActions.setNearbyLines, (state, { nearbyLines }) => ({
		...state,
		nearbyLinesState: nearbyLines,
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
	on(GraphicsActions.toggleLinkModeSymbols, (state) => ({
		...state,
		linkModeSymbols: !state.linkModeSymbols,
	})),
	on(GraphicsActions.toggleLinkModeOrderNumbers, (state) => ({
		...state,
		linkModeOrderNumbers: !state.linkModeOrderNumbers,
	})),
	on(GraphicsActions.toggleLinkModePathLines, (state) => ({
		...state,
		linkModePathLines: !state.linkModePathLines,
	})),
	on(GraphicsActions.toggleNotifications, (state) => ({
		...state,
		notifications: !state.notifications,
	})),

	on(GraphicsActions.toggleShowFPS, (state) => ({
		...state,
		showFps: !state.showFps,
	})),
	on(GraphicsActions.resetGraphicsToDefault, () => initialGraphicsState),
)

export function graphicsReducer(state: GraphicsState | undefined, action: Action) {
	return reducer(state, action)
}
