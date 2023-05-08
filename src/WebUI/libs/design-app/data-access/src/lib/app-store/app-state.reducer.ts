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
	// contextMenu: ContextMenuState
	/*	dialog: boolean
	 dialogs: DialogInput[]*/
}

export const initialAppState: AppState = {
	dragBox: DRAG_BOX_STATE.NO_DRAG_BOX, // hoveringOverEntityState: HOVERING_OVER_ENTITY_STATE.NO_HOVER,
	// hoveringOverEntityId:    undefined,
	pointer: InitialPointerState, // toMove:               TO_MOVE_STATE.NO_MOVE,
	// toRotate:             TO_ROTATE_STATE.NO_ROTATE,
	view: VIEW_POSITIONING_STATE.VIEW_NOT_MOVING,
	previewAxis: PREVIEW_AXIS_STATE.NONE,
	mode: MODE_STATE.SELECT_MODE /*	contextMenu: {
	 state: CONTEXT_MENU_OPEN_STATE.NO_CONTEXT_MENU,
	 type: undefined,
	 } */ /*	dialog: false,
	 dialogs: [],*/,
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
	})) /*	on(AppStateActions.setContextMenuState, (state, { contextMenu }) => ({
	 ...state,
	 contextMenu: {
	 ...state.contextMenu,
	 state: contextMenu,
	 },
	 })),
	 on(AppStateActions.openContextMenu, (state, { contextMenuType }) => ({
	 ...state,
	 contextMenu: {
	 ...state.contextMenu,
	 state: CONTEXT_MENU_OPEN_STATE.CONTEXT_MENU_OPEN,
	 type: contextMenuType,
	 },
	 })),*/,

	/*	on(AppStateActions.toggleDialogState, (state) => ({
	 ...state,
	 dialog: !state.dialog,
	 })),

	 on(AppStateActions.addDialog, (state, { dialog }) => ({
	 ...state,
	 dialogs: [...state.dialogs, dialog],
	 })),

	 on(AppStateActions.updateDialog, (state, { update }) => ({
	 ...state,
	 dialogs: state.dialogs.map((dialog) =>
	 dialog.id === update.id
	 ? {
	 ...dialog,
	 ...update.changes,
	 }
	 : dialog,
	 ),
	 })),

	 on(AppStateActions.removeDialog, (state, { dialogId }) => ({
	 ...state,
	 dialogs: state.dialogs.filter((d) => d.id !== dialogId),
	 })),*/

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
