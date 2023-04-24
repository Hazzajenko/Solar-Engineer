import { DRAG_BOX_STATE, DragBoxState } from './drag-box'
import { POINTER_STATE, PointerState } from './pointer'
import { AdjustedSelectedState, SELECTED_STATE, SelectedState } from './selected'
import { AdjustedToMoveState, TO_MOVE_STATE, ToMoveState } from './to-move'
import { AdjustedToRotateState, TO_ROTATE_STATE, ToRotateState } from './to-rotate'


export type AppState =
	| DragBoxState
	| PointerState
	| AdjustedSelectedState
	| AdjustedToMoveState
	| AdjustedToRotateState

export const APP_STATE = {
	DRAG_BOX: DRAG_BOX_STATE,
	POINTER: POINTER_STATE,
	SELECTED: SELECTED_STATE,
	TO_MOVE: TO_MOVE_STATE,
	TO_ROTATE: TO_ROTATE_STATE,
} as const

export type AppStateValue = {
	[APP_STATE.DRAG_BOX.STATE]: DragBoxState
	[APP_STATE.POINTER.STATE]: PointerState
	[APP_STATE.SELECTED.STATE]: SelectedState
	[APP_STATE.TO_MOVE.STATE]: ToMoveState
	[APP_STATE.TO_ROTATE.STATE]: ToRotateState
}

export const InitialAppState: AppStateValue = {
	[APP_STATE.DRAG_BOX.STATE]: APP_STATE.DRAG_BOX.NO_DRAG_BOX,
	[APP_STATE.POINTER.STATE]: APP_STATE.POINTER.POINTER_UP,
	[APP_STATE.SELECTED.STATE]: APP_STATE.SELECTED.NONE_SELECTED,
	[APP_STATE.TO_MOVE.STATE]: APP_STATE.TO_MOVE.NO_MOVE,
	[APP_STATE.TO_ROTATE.STATE]: APP_STATE.TO_ROTATE.NO_ROTATE,
}