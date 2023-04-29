import { Typegen0 } from './client.machine.typegen'
import { DRAG_BOX_STATE, DRAG_BOX_STATE_KEY, DragBoxState } from './drag-box'
import { GRID_STATE_KEY, GridState } from './grid'
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
import { VIEW_STATE_KEY, ViewState } from './view'


export type AppState =
	| DragBoxState
	| PointerState
	| AdjustedSelectedState
	| AdjustedToMoveState
	| AdjustedToRotateState
	| ViewState
	| GridState

export const APP_STATE = {
	DRAG_BOX: DRAG_BOX_STATE,
	POINTER: POINTER_STATE,
	SINGLE_SELECTED: SELECTED_STATE,
	TO_MOVE: TO_MOVE_STATE,
	TO_ROTATE: TO_ROTATE_STATE,
} as const

export type AppStateValueDeprecated = {
	[DRAG_BOX_STATE_KEY]: DragBoxState
	[POINTER_STATE_KEY]: PointerState
	[SELECTED_STATE_KEY]: SelectedState
	[TO_MOVE_STATE_KEY]: ToMoveState
	[TO_ROTATE_STATE_KEY]: ToRotateState
	[VIEW_STATE_KEY]: ViewState
	[GRID_STATE_KEY]: GridState
}

/*export const InitialAppState: AppStateValueDeprecated = {
 [DRAG_BOX_STATE_KEY]: DRAG_BOX_STATE.NO_DRAG_BOX,
 [POINTER_STATE_KEY]: POINTER_STATE.POINTER_UP,
 [SELECTED_STATE_KEY]: SELECTED_STATE.NONE_SELECTED,
 [TO_MOVE_STATE_KEY]: TO_MOVE_STATE.NO_MOVE,
 [TO_ROTATE_STATE_KEY]: TO_ROTATE_STATE.NO_ROTATE,
 [VIEW_STATE_KEY]: VIEW_STATE.VIEW_NOT_MOVING,
 [GRID_STATE_KEY]: InitialGridState,
 }*/

export type AppStateValue = {
	DragBoxState: DragBoxState
	PointerState: PointerState
	SelectedState: SelectedState
	ToMoveState: ToMoveState
	ToRotateState: ToRotateState
	ViewState: ViewState
	GridState: GridState
}

/*export const InitialAppStateV2: AppStateValue = {
 DragBoxState: DRAG_BOX_STATE.NO_DRAG_BOX,
 PointerState: POINTER_STATE.POINTER_UP,
 SelectedState: SELECTED_STATE.NONE_SELECTED,
 ToMoveState: TO_MOVE_STATE.NO_MOVE,
 ToRotateState: TO_ROTATE_STATE.NO_ROTATE,
 ViewState: VIEW_STATE.VIEW_NOT_MOVING,
 GridState: InitialGridState,
 }*/

export type AppStateMatches = Typegen0['matchesStates']

/*export const InitialAppStateMatches: AppStateMatches = {
 DragBoxState: DRAG_BOX_STATE.NO_DRAG_BOX,
 PointerState: POINTER_STATE.POINTER_UP,
 SelectedState: SELECTED_STATE.NONE_SELECTED,
 ToMoveState: TO_MOVE_STATE.NO_MOVE,
 ToRotateState: TO_ROTATE_STATE.NO_ROTATE,
 ViewState: VIEW_STATE.VIEW_NOT_MOVING,
 GridState: 'ModeState',
 }*/

export type AppStateMatchesModel = {
	DragBoxState?: 'CreationBoxInProgress' | 'NoDragBox' | 'SelectionBoxInProgress'
	GridState?:
		| 'ModeState'
		| 'PreviewAxisState'
		| {
				ModeState?: 'CreateMode' | 'SelectMode'
				PreviewAxisState?:
					| 'AxisCreatePreviewInProgress'
					| 'AxisRepositionPreviewInProgress'
					| 'None'
		  }
	PointerState?: 'HoveringOverEntity' | 'PointerIsDown' | 'PointerUp'
	SelectedState?: 'EntitySelected' | 'MultipleEntitiesSelected' | 'NoneSelected' | 'StringSelected'
	ToMoveState?: 'MultipleMoveInProgress' | 'NoMove' | 'SingleMoveInProgress'
	ToRotateState?:
		| 'MultipleRotateInProgress'
		| 'NoRotate'
		| 'SingleRotateInProgress'
		| 'SingleRotateModeInProgress'
	ViewState?:
		| 'ContextMenuState'
		| 'ViewPositioningState'
		| {
				ContextMenuState?: 'ContextMenuOpen' | 'NoContextMenu'
				ViewPositioningState?: 'ViewDraggingInProgress' | 'ViewNotMoving'
		  }
}

/*type ExtractRecord<T> = T extends Record<string, infer U> ? U : never
 type AppRecords = ExtractRecord<AppStateMatchesModel>
 type AppRecords2 = ExtractRecord<AppStateMatches>
 const asdas2312: AppRecords2 = {
 ViewPositioningState: 'ViewDraggingInProgress',
 }
 const asdas: AppRecords = {
 ViewPositioningState: 'ViewDraggingInProgress',
 }
 type ExtendsRecord = AppStateMatchesModel extends Record<string, any> ? true : false

 type test1 = {
 DragBoxState?: 'CreationBoxInProgress' | 'NoDragBox' | 'SelectionBoxInProgress'
 }

 type test1extends = test1 extends Record<string, object> ? true : false
 type ExtractRecordObjects<T> = T extends Record<string, object> ? T : never
 const test2:  ExtractRecordObjects<AppStateMatches> = {
 ViewState: 'ContextMenuState',
 }

 type AllSelectedEventsWithPayload = Extract<
 AppStateMatches,
 object | Record<string, object>
 >
 const test3: AllSelectedEventsWithPayload = {
 ViewState: 'ContextMenuState',
 GridState: 'ModeState',
 }
 const test4: Required<AllSelectedEventsWithPayload> = {
 ViewState: 'ContextMenuState',
 GridState: 'ModeState',
 ToRotateState: 'NoRotate',
 ToMoveState: 'NoMove',
 PointerState: 'PointerUp',
 DragBoxState: 'NoDragBox',
 SelectedState: 'NoneSelected',
 }
 // const test6: Required<AllSelectedEventsWithPayload> = 'ViewState'
 type AllSelectedEventsWithPayload2 = Extract<
 AppStateMatches,
 Record<string, object>
 >

 type testtyy = {
 ViewState?:
 | 'ContextMenuState'
 | 'ViewPositioningState'
 | {
 ContextMenuState?: 'ContextMenuOpen' | 'NoContextMenu'
 ViewPositioningState?: 'ViewDraggingInProgress' | 'ViewNotMoving'
 }
 }

 type testtyy2 = testtyy extends Record<string, object> ? true : false
 type testtyy3 = testtyy extends Record<string, any> ? true : false
 type testtyy4 = testtyy extends Record<string, unknown> ? true : false
 type testtyy5 = testtyy extends Record<string, never> ? true : false
 type testtyy6 = Extract<testtyy, object>
 const ttttt: testtyy6 = {
 ViewState: {
 ViewPositioningState: 'ViewDraggingInProgress',
 ContextMenuState: 'ContextMenuOpen',
 },
 }
 type testtyy7 = Extract<testtyy, Record<string, object>>

 type testtyy8 = Extract<testtyy, Record<string, any>>
 const tttttss: testtyy8 = {
 ViewState: 'ViewPositioningState',
 }*/
// const test4: AllSelectedEventsWithPayload2 = '0CF19D'
/*export const InitialAppStateMatches: AppStateMatches = {
 DragBoxState: DRAG_BOX_STATE.NO_DRAG_BOX,
 PointerState: POINTER_STATE.POINTER_UP,
 SelectedState: SELECTED_STATE.NONE_SELECTED,
 ToMoveState: TO_MOVE_STATE.NO_MOVE,
 }*/

/*export type GraphicsStateMatches = {
 [key in keyof AppStateMatches]: AppStateMatches[key]
 }

 const sadas: GraphicsStateMatches = ''*/
// const asdsas :AppStateMatches
/*export type AppStateMatchesInConst = {
 [keyof in AppStateMatches]: AppStateMatches[keyof]
 }*/
/*type AppStateMatchesInConst = {
 [DRAG_BOX_STATE_KEY]: Typegen0['matchesStates'][DRAG_BOX_STATE_KEY]
 }*/

/*const state: AppStateMatchesInConst = {
 [DRAG_BOX_STATE_KEY]: DRAG_BOX_STATE.NO_DRAG_BOX,

 }*/

// | 'GridState.PreviewAxisState.PreviewAxisDrawEnabled'
// const state = GridState.PreviewAxisState.PreviewAxisDrawEnabled
// const hello: GraphicsStateMatches = 'ToMoveState.SingleMoveInProgress'
/*	[APP_STATE.DRAG_BOX.STATE]: APP_STATE.DRAG_BOX.NO_DRAG_BOX,
 [APP_STATE.POINTER.STATE]: APP_STATE.POINTER.POINTER_UP,
 [APP_STATE.SELECTED.STATE]: APP_STATE.SELECTED.NONE_SELECTED,
 [APP_STATE.TO_MOVE.STATE]: APP_STATE.TO_MOVE.NO_MOVE,
 [APP_STATE.TO_ROTATE.STATE]: APP_STATE.TO_ROTATE.NO_ROTATE,*/

/*	[APP_STATE.POINTER.STATE]: PointerState
 [APP_STATE.SELECTED.STATE]: SelectedState
 [APP_STATE.TO_MOVE.STATE]: ToMoveState
 [APP_STATE.TO_ROTATE.STATE]: ToRotateState*/