import { DRAG_BOX_STATE, DRAG_BOX_STATE_KEY, DragBoxState } from './drag-box'
import { POINTER_STATE, POINTER_STATE_KEY, PointerState } from './pointer'
import {
	AdjustedSelectedState,
	SELECTED_STATE,
	SELECTED_STATE_KEY,
	SelectedState,
} from './selected'
import { AdjustedToMoveState, TO_MOVE_STATE, TO_MOVE_STATE_KEY, ToMoveState } from './to-move'
import {
	AdjustedToRotateState,
	TO_ROTATE_STATE,
	TO_ROTATE_STATE_KEY,
	ToRotateState,
} from './to-rotate'
import { VIEW_STATE, VIEW_STATE_KEY, ViewState } from './view'


export type AppState =
	| DragBoxState
	| PointerState
	| AdjustedSelectedState
	| AdjustedToMoveState
	| AdjustedToRotateState
	| ViewState

export const APP_STATE = {
	DRAG_BOX: DRAG_BOX_STATE,
	POINTER: POINTER_STATE,
	SELECTED: SELECTED_STATE,
	TO_MOVE: TO_MOVE_STATE,
	TO_ROTATE: TO_ROTATE_STATE,
} as const

export type AppStateValue = {
	[DRAG_BOX_STATE_KEY]: DragBoxState
	[POINTER_STATE_KEY]: PointerState
	[SELECTED_STATE_KEY]: SelectedState
	[TO_MOVE_STATE_KEY]: ToMoveState
	[TO_ROTATE_STATE_KEY]: ToRotateState
	[VIEW_STATE_KEY]: ViewState
}

export const InitialAppState: AppStateValue = {
	[DRAG_BOX_STATE_KEY]: DRAG_BOX_STATE.NO_DRAG_BOX,
	[POINTER_STATE_KEY]: POINTER_STATE.POINTER_UP,
	[SELECTED_STATE_KEY]: SELECTED_STATE.NONE_SELECTED,
	[TO_MOVE_STATE_KEY]: TO_MOVE_STATE.NO_MOVE,
	[TO_ROTATE_STATE_KEY]: TO_ROTATE_STATE.NO_ROTATE,
	[VIEW_STATE_KEY]: VIEW_STATE.VIEW_NOT_MOVING,
}

/*	[APP_STATE.DRAG_BOX.STATE]: APP_STATE.DRAG_BOX.NO_DRAG_BOX,
 [APP_STATE.POINTER.STATE]: APP_STATE.POINTER.POINTER_UP,
 [APP_STATE.SELECTED.STATE]: APP_STATE.SELECTED.NONE_SELECTED,
 [APP_STATE.TO_MOVE.STATE]: APP_STATE.TO_MOVE.NO_MOVE,
 [APP_STATE.TO_ROTATE.STATE]: APP_STATE.TO_ROTATE.NO_ROTATE,*/

/*	[APP_STATE.POINTER.STATE]: PointerState
 [APP_STATE.SELECTED.STATE]: SelectedState
 [APP_STATE.TO_MOVE.STATE]: ToMoveState
 [APP_STATE.TO_ROTATE.STATE]: ToRotateState*/