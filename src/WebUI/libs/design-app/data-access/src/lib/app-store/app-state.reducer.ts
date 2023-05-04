import { AppStateActions } from './app-state.actions'
import {
	CONTEXT_MENU_STATE,
	ContextMenuState,
	DRAG_BOX_STATE,
	DragBoxState,
	MODE_STATE,
	ModeState,
	POINTER_STATE,
	PointerState,
	PREVIEW_AXIS_STATE,
	PreviewAxisState,
	SELECTED_STATE,
	SelectedState,
	TO_MOVE_STATE,
	TO_ROTATE_STATE,
	ToMoveState,
	ToRotateState,
	VIEW_POSITIONING_STATE,
	ViewPositioningState,
} from './app-state.types'
import { Action, createReducer, on } from '@ngrx/store'

export const APP_STATE_FEATURE_KEY = 'app-state'

export type AppState = {
	dragBox: DragBoxState
	pointer: PointerState
	toMove: ToMoveState
	toRotate: ToRotateState
	view: ViewPositioningState
	previewAxis: PreviewAxisState
	mode: ModeState
	contextMenu: ContextMenuState
	selected: SelectedState
}

export const initialAppState: AppState = {
	dragBox: DRAG_BOX_STATE.NO_DRAG_BOX,
	pointer: POINTER_STATE.NO_HOVER,
	toMove: TO_MOVE_STATE.NO_MOVE,
	toRotate: TO_ROTATE_STATE.NO_ROTATE,
	view: VIEW_POSITIONING_STATE.VIEW_NOT_MOVING,
	previewAxis: PREVIEW_AXIS_STATE.NONE,
	mode: MODE_STATE.SELECT_MODE,
	contextMenu: CONTEXT_MENU_STATE.NO_CONTEXT_MENU,
	selected: SELECTED_STATE.NONE_SELECTED,
}

const reducer = createReducer(
	initialAppState,
	on(AppStateActions.setDragBoxState, (state, { dragBox }) => ({
		...state,
		dragBox,
	})),
	on(AppStateActions.setPointerState, (state, { pointer }) => ({
		...state,
		pointer,
	})),
	on(AppStateActions.setToMoveState, (state, { toMove }) => ({
		...state,
		toMove,
	})),
	on(AppStateActions.setToRotateState, (state, { toRotate }) => ({
		...state,
		toRotate,
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
	})),
	on(AppStateActions.setSelectedState, (state, { selected }) => ({
		...state,
		selected,
	})),
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
