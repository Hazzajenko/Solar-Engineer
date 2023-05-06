import { AppStateActions } from './app-state.actions'
import {
	CONTEXT_MENU_STATE,
	ContextMenuState,
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

export const APP_STATE_FEATURE_KEY = 'app-state'

export type AppState = {
	dragBox: DragBoxState
	// hoveringOverEntityState: HoveringOverEntityState
	// hoveringOverEntityId: string | undefined
	pointer: PointerState
	// toMove: ToMoveState
	// toRotate: ToRotateState
	view: ViewPositioningState
	previewAxis: PreviewAxisState
	mode: ModeState
	contextMenu: ContextMenuState
	// selected: SelectedState
}

export const initialAppState: AppState = {
	dragBox: DRAG_BOX_STATE.NO_DRAG_BOX, // hoveringOverEntityState: HOVERING_OVER_ENTITY_STATE.NO_HOVER,
	// hoveringOverEntityId:    undefined,
	pointer: InitialPointerState, // toMove:               TO_MOVE_STATE.NO_MOVE,
	// toRotate:             TO_ROTATE_STATE.NO_ROTATE,
	view: VIEW_POSITIONING_STATE.VIEW_NOT_MOVING,
	previewAxis: PREVIEW_AXIS_STATE.NONE,
	mode: MODE_STATE.SELECT_MODE,
	contextMenu: CONTEXT_MENU_STATE.NO_CONTEXT_MENU, // selected: SELECTED_STATE.NONE_SELECTED,
}

const reducer = createReducer(
	initialAppState,
	on(AppStateActions.setDragBoxState, (state, { dragBox }) => ({
		...state,
		dragBox,
	})) /*	on(AppStateActions.setPointerState, (state, { pointer }) => ({
 ...state,
 pointer,
 hoveringOverEntityId:
 pointer === HOVERING_OVER_ENTITY_STATE.NO_HOVER ? undefined : state.hoveringOverEntityId,
 })),*/,
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
	on(AppStateActions.setContextMenuState, (state, { contextMenu }) => ({
		...state,
		contextMenu,
	})) /*	on(AppStateActions.setSelectedState, (state, { selected }) => ({
 ...state,
 selected,
 })),*/,
	on(AppStateActions.clearState, () => initialAppState),
)

/*nvuconst setDragBoxState = (state: AppState, dragBox: DragBoxState) => {
 switch (dragBox) {
 case DRAG_BOX_STATE.NO_DRAG_BOX:
 return {
 ...state,
 dragBox,
 }
 case DRAG_BOX_STATE.DRAG_BOX:
 return {

 }
 }
 }*/

export function appStateReducer(state: AppState | undefined, action: Action) {
	return reducer(state, action)
}