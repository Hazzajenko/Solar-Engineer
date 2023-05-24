import { AppStateActions } from './app-state.actions'
import {
	DRAG_BOX_STATE,
	DragBoxState,
	HOVERING_OVER_ENTITY_STATE,
	InitialPointerState,
	MODE_STATE,
	ModeState,
	PointerState,
	PREVIEW_AXIS_STATE,
	PreviewAxisState,
	VIEW_POSITIONING_STATE,
	ViewPositioningState,
} from './app-state.types'
import { Action, createReducer, on } from '@ngrx/store'

export const APP_STATE_FEATURE_KEY = 'appState'

export type AppState = {
	dragBox: DragBoxState
	pointer: PointerState
	view: ViewPositioningState
	previewAxis: PreviewAxisState
	mode: ModeState
}

export const initialAppState: AppState = {
	dragBox: DRAG_BOX_STATE.NO_DRAG_BOX,
	pointer: InitialPointerState,
	view: VIEW_POSITIONING_STATE.VIEW_NOT_MOVING,
	previewAxis: PREVIEW_AXIS_STATE.NONE,
	mode: MODE_STATE.SELECT_MODE,
}

const reducer = createReducer(
	initialAppState,
	on(AppStateActions.setDragBoxState, (state, { dragBox }) => ({
		...state,
		dragBox,
	})),
	on(AppStateActions.setHoveringOverEntity, (state, { hoveringOverEntityId }) => ({
		...state,
		pointer: {
			hoveringOverEntityId,
			hoverState: HOVERING_OVER_ENTITY_STATE.HOVERING_OVER_ENTITY,
		},
	})),
	on(AppStateActions.liftHoveringOverEntity, (state) => ({
		...state,
		pointer: {
			hoveringOverEntityId: undefined,
			hoverState: HOVERING_OVER_ENTITY_STATE.NO_HOVER,
		},
	})),
	on(AppStateActions.setViewPositioningState, (state, { view }) => ({
		...state,
		view,
	})),
	on(AppStateActions.setPreviewAxisState, (state, { previewAxis }) => ({
		...state,
		previewAxis,
	})),
	on(AppStateActions.setModeState, (state, { mode }) => ({
		...state,
		mode,
	})),
	on(AppStateActions.clearState, () => initialAppState),
)

export function appStateReducer(state: AppState | undefined, action: Action) {
	return reducer(state, action)
}
